'use client';

import { useMemo } from 'react';

import { ChartFrame, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { useMeasuredWidth } from '../ChartFrame/chartMeasure.js';
import { getChartColor } from '../ChartFrame/chartRuntime.js';
import { boxStats, isChartNumber, niceTicks, scaleLinear } from '../ChartFrame/chartScale.js';
import { chartStatus, splitFrameProps } from '../ChartFrame/chartData.js';

const STAT_KEYS = [ 'min', 'q1', 'median', 'q3', 'max' ];

/** Each group's five-number summary, from raw `values` or precomputed fields. */
export function boxGroups(data, { labelKey = 'label', valuesKey = 'values' } = {}) {
  return data.map((item) => {
    if (!item || typeof item !== 'object') return { label: '', stats: null };
    const stats = Array.isArray(item[valuesKey])
      ? boxStats(item[valuesKey])
      : STAT_KEYS.every((key) => isChartNumber(item[key])) ? { 'count': item.count, 'outliers': item.outliers || [], ...Object.fromEntries(STAT_KEYS.map((key) => [ key, item[key] ])) } : null;

    return { 'label': String(item[labelKey]), stats };
  });
}

function BoxPlotPlot({ color, colors, groups, height, unit }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const [ ref, width ] = useMeasuredWidth(0);
  const ticks = useMemo(() => {
    const values = groups.flatMap((group) => [ group.stats.min, group.stats.max, ...group.stats.outliers ]);

    return niceTicks(Math.min(...values), Math.max(...values), 5);
  }, [ groups ]);
  // The left margin fits the longest tick label (about 7px per character at 12px).
  const margin = { 'bottom': 28, 'left': 16 + Math.max(3, ...ticks.map((tick) => `${format(tick)}${unit || ''}`.length)) * 7, 'right': 12, 'top': 12 };
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  const y = scaleLinear([ ticks[0], ticks.at(-1) ], [ margin.top + innerHeight, margin.top ]);
  const band = groups.length ? innerWidth / groups.length : 0;
  const boxWidth = Math.min(56, band * 0.5);

  return (
    <div ref={ ref } className='h-full w-full'>
      {width ? (
        <svg aria-hidden='true' className='block' height={ height } width={ width }>
          {ticks.map((tick) => (
            <g key={ tick }>
              <line stroke='var(--ds-color-chart-grid)' strokeDasharray='3 3' x1={ margin.left } x2={ width - margin.right } y1={ y(tick) } y2={ y(tick) } />
              <text dominantBaseline='middle' fill='var(--ds-color-text-muted)' fontSize={ 12 } textAnchor='end' x={ margin.left - 8 } y={ y(tick) }>{`${format(tick)}${unit || ''}`}</text>
            </g>
          ))}
          {groups.map((group, index) => {
            const center = margin.left + band * index + band / 2;
            const { max, median, min, outliers, q1, q3 } = group.stats;
            const stroke = group.color || (colors ? getChartColor(colors, index) : color);
            const isActive = active === index;

            return (
              <g key={ group.label } data-chart-index={ index }>
                {/* The whole column is the hover target, not just the box. */}
                <rect fill={ isActive ? 'var(--ds-color-chart-cursor)' : 'transparent' } height={ innerHeight } width={ band } x={ center - band / 2 } y={ margin.top } />
                <line stroke={ stroke } strokeWidth={ 1.5 } x1={ center } x2={ center } y1={ y(max) } y2={ y(q3) } />
                <line stroke={ stroke } strokeWidth={ 1.5 } x1={ center } x2={ center } y1={ y(q1) } y2={ y(min) } />
                <line stroke={ stroke } strokeWidth={ 1.5 } x1={ center - boxWidth / 4 } x2={ center + boxWidth / 4 } y1={ y(max) } y2={ y(max) } />
                <line stroke={ stroke } strokeWidth={ 1.5 } x1={ center - boxWidth / 4 } x2={ center + boxWidth / 4 } y1={ y(min) } y2={ y(min) } />
                <rect fill={ stroke } fillOpacity={ isActive ? 0.3 : 0.16 } height={ Math.max(1, y(q1) - y(q3)) } rx={ 2 } stroke={ stroke } strokeWidth={ isActive ? 2.5 : 1.5 } width={ boxWidth } x={ center - boxWidth / 2 } y={ y(q3) } />
                <line stroke={ stroke } strokeWidth={ 2.5 } x1={ center - boxWidth / 2 } x2={ center + boxWidth / 2 } y1={ y(median) } y2={ y(median) } />
                {outliers.map((value, outlier) => <circle key={ `${value}-${outlier}` } cx={ center } cy={ y(value) } fill='var(--ds-color-surface)' r={ 3 } stroke={ stroke } strokeWidth={ 1.5 } />)}
                <text fill='var(--ds-color-text-muted)' fontSize={ 12 } textAnchor='middle' x={ center } y={ height - 8 }>{group.label}</text>
              </g>
            );
          })}
        </svg>
      ) : null}
    </div>
  );
}

/**
 * Distributions side by side: median, quartiles, whiskers at 1.5 × IQR and outliers. Page load
 * time by route, essay length by section, response time by region.
 *
 * @param {object} props
 * @param {object[]} props.data - Groups `{ label, values: number[] }`, or precomputed `{ label, min, q1, median, q3, max, outliers }`.
 * @param {string} [props.unit] - Suffix on axis ticks, e.g. 'ms'.
 */
export function BoxPlotChart(props) {
  const [ frameProps, { color = 'var(--ds-color-chart-1)', colors, data = [], labelKey = 'label', state, unit, valuesKey = 'values' } ] = splitFrameProps(props);
  const records = Array.isArray(data) ? data : [];
  const groups = useMemo(() => boxGroups(Array.isArray(data) ? data : [], { labelKey, valuesKey }), [ data, labelKey, valuesKey ]);
  const status = chartStatus({ data: records, 'keys': [], state, 'status': !records.length ? 'empty' : groups.some((group) => !group.stats) ? 'invalid' : 'ready', 'usesRecharts': false });
  const height = typeof frameProps.height === 'number' ? frameProps.height : 320;
  const points = status === 'ready' ? groups.map((group) => ({
    'label': group.label,
    'values': [
      { 'name': 'Min', 'value': group.stats.min },
      { 'name': 'Q1', 'value': group.stats.q1 },
      { 'name': 'Median', 'value': group.stats.median },
      { 'name': 'Q3', 'value': group.stats.q3 },
      { 'name': 'Max', 'value': group.stats.max },
      { 'display': String(group.stats.outliers.length), 'name': 'Outliers', 'value': group.stats.outliers.length }
    ]
  })) : [];

  return (
    <ChartFrame { ...frameProps } height={ height } points={ points } status={ status }>
      <BoxPlotPlot color={ color } colors={ colors } groups={ groups } height={ height } unit={ unit } />
    </ChartFrame>
  );
}
