'use client';

import { useMemo } from 'react';

import { clamp } from '../../../utilities/clamp.js';
import { ChartFrame, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { useElementSize } from '../../../hooks/layout/use-element-size.js';
import { ChartLegendList, ChartValueGrid, chartTones } from '../ChartFrame/ChartMarks.jsx';
import { binValues, extent, isChartNumber, niceTicks, resolveFormatter, scaleLinear } from '../ChartFrame/chartScale.js';
import { chartStatus, splitFrameProps } from '../ChartFrame/chartData.js';

const margin = { 'bottom': 28, 'left': 44, 'right': 16, 'top': 22 };

/**
 * Bins on round edges: the domain snaps to nice ticks, so bins read as 0–50, 50–100…
 *
 * @param {number[]} values
 * @param {{ bins?: number, domain?: [number, number] }} [options]
 */
export function histogramBins(values, { bins, domain } = {}) {
  const range = domain || extent(values);
  if (!range) return [];
  const ticks = niceTicks(range[0], range[1], bins || Math.ceil(Math.log2(values.filter(isChartNumber).length) + 1));

  return binValues(values, { 'bins': ticks.length - 1, 'domain': [ ticks[0], ticks.at(-1) ] });
}

function HistogramPlot({ bins, color, height, markers, unit }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const [ ref, { width, height: measuredHeight } ] = useElementSize();
  const plotHeight = measuredHeight || height;
  const maxCount = Math.max(...bins.map((bin) => bin.count), 1);
  const countTicks = useMemo(() => niceTicks(0, maxCount, 4), [ maxCount ]);
  const low = bins[0].start;
  const high = bins.at(-1).end;
  const x = scaleLinear([ low, high ], [ margin.left, Math.max(margin.left, width - margin.right) ]);
  const y = scaleLinear([ 0, countTicks.at(-1) ], [ plotHeight - margin.bottom, margin.top ]);
  const labelEvery = Math.max(1, Math.ceil(bins.length / Math.max(1, Math.floor((width - margin.left) / 56))));

  return (
    <div className='flex h-full min-w-0 flex-col gap-2'>
      {markers.length ? (
        <ChartLegendList data-slot='chart-markers' items={ markers.map((marker, index) => ({ 'color': chartTones[marker.tone] || chartTones.accent, 'key': `${marker.label}-${index}`, 'label': `${marker.label} ${format(marker.value)}${unit || ''}` })) } />
      ) : null}
      <div ref={ref} className='min-h-0 w-full flex-1'>
      {width ? (
        <svg aria-hidden='true' className='block' height={ plotHeight } width={ width }>
          <ChartValueGrid format={ format } left={ margin.left } right={ width - margin.right } ticks={ countTicks } y={ y } />
          {bins.map((bin, index) => {
            const left = x(bin.start) + 0.5;
            const barWidth = Math.max(1, x(bin.end) - x(bin.start) - 1);

            return (
              <g key={ bin.start } data-chart-index={ index }>
                <rect fill='transparent' height={ plotHeight - margin.bottom - margin.top } width={ barWidth + 1 } x={ left - 0.5 } y={ margin.top } />
                <rect fill={ color } fillOpacity={ active == null || active === index ? 0.85 : 0.35 } height={ Math.max(0, y(0) - y(bin.count)) } rx={ 1 } width={ barWidth } x={ left } y={ y(bin.count) } />
              </g>
            );
          })}
          <line stroke='var(--ds-color-chart-baseline)' x1={ margin.left } x2={ width - margin.right } y1={ y(0) } y2={ y(0) } />
          {[ ...bins.map((bin) => bin.start), high ].map((edge, index) => {
            const label = `${format(edge)}${unit || ''}`;
            const lastLabelWidth = `${format(high)}${unit || ''}`.length * 7;
            const first = index === 0;
            const last = index === bins.length;
            const fitsBeforeLast = x(edge) + label.length * 3.5 + 8 < x(high) - lastLabelWidth;
            if (!first && !last && (index % labelEvery !== 0 || !fitsBeforeLast)) return null;
            return <text key={edge} fill='var(--ds-color-text-muted)' fontSize={12} textAnchor={first ? 'start' : last ? 'end' : 'middle'} x={x(edge)} y={plotHeight - 8}>{label}</text>;
          })}
          {markers.map((marker) => {
            const tone = chartTones[marker.tone] || chartTones.accent;
            const mx = x(clamp(marker.value, low, high));
            return <line key={`${marker.label}-${marker.value}`} stroke={tone} strokeDasharray='4 3' strokeWidth={1.5} x1={mx} x2={mx} y1={margin.top - 4} y2={y(0)} />;
          })}
        </svg>
      ) : null}
      </div>
    </div>
  );
}

/**
 * How observations spread: counts in equal bins, with labelled markers for statistics such as
 * the median or p95. Reading time, page weight, latency.
 *
 * @param {object} props
 * @param {number[]} props.values - Observations (or `data`).
 * @param {number} [props.bins] - Approximate bin count; edges snap to round numbers.
 * @param {Array<{ value: number, label: string, tone?: string }>} [props.markers] - Vertical guides.
 * @param {string} [props.unit] - Suffix on bin edges.
 */
export function HistogramChart(props) {
  const [ frameProps, { bins, color = 'var(--ds-color-chart-1)', countLabel = 'Count', data, domain, markers = [], state, unit, values } ] = splitFrameProps(props);
  const observations = useMemo(() => (Array.isArray(values) ? values : Array.isArray(data) ? data : []), [ values, data ]);
  const binned = useMemo(() => histogramBins(observations, { bins, domain }), [ observations, bins, domain ]);
  const format = resolveFormatter(frameProps.formatValue, frameProps.locale);
  const status = chartStatus({ 'data': observations, 'keys': [], state, 'status': !observations.length ? 'empty' : observations.some((value) => !isChartNumber(value)) ? 'invalid' : 'ready', 'usesRecharts': false });
  const height = typeof frameProps.height === 'number' ? frameProps.height : 280;
  const points = status === 'ready' ? binned.map((bin) => ({
    'label': `${format(bin.start)}–${format(bin.end)}${unit || ''}`,
    'values': [{ 'name': countLabel, 'value': bin.count }]
  })) : [];

  return (
    <ChartFrame { ...frameProps } height={ height } labels={{ 'category': 'Range', ...frameProps.labels }} points={ points } status={ status }>
      <HistogramPlot bins={ binned } color={ color } height={ height } markers={ markers } unit={ unit } />
    </ChartFrame>
  );
}
