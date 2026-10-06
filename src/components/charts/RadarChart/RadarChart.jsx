'use client';

import { useMemo } from 'react';

import { ChartFrame, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { chartAxisTick, createRowsTooltip } from '../ChartFrame/ChartMarks.jsx';
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RechartsRadarChart, RechartsTooltip, ResponsiveContainer, getChartColor } from '../ChartFrame/chartRuntime.js';
import { categoryPoints, getSeries } from '../ChartFrame/ChartSeries.jsx';
import { chartStatus, normalizeRecords, splitFrameProps } from '../ChartFrame/chartData.js';

/** The ringed dot that marks the frame's active axis on each series. */
function ActiveVertex({ cx, cy, fill, index, active }) {
  if (index !== active) return null;

  return <circle cx={ cx } cy={ cy } fill={ fill } r={ 5 } stroke='var(--ds-color-surface)' strokeWidth={ 2 } />;
}

function RadarPlot({ colors, data, domain, filled, series, showLegend, showRings, showTooltip, xKey }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => payload.map((item) => ({ 'color': item.color || item.stroke, 'label': item.name, 'value': format(item.value) }))), [ format ]);

  return (
    <div className='h-full w-full overflow-x-auto' role='region' aria-label='Scrollable radar chart' tabIndex={0}>
      <div className='h-full min-w-sm'>
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsRadarChart accessibilityLayer={ false } cx='50%' cy='50%' data={ data } margin={{ top: 20, right: 88, bottom: 44, left: 88 }} outerRadius='85%'>
        <PolarGrid gridType='polygon' stroke='var(--ds-color-chart-grid)' />
        <PolarAngleAxis dataKey={ xKey } tick={ chartAxisTick } />
        <PolarRadiusAxis angle={ 90 } axisLine={ false } domain={ domain } tick={ showRings ? { ...chartAxisTick, 'fontSize': 10 } : false } tickFormatter={ format } />
        {showTooltip ? <RechartsTooltip content={ <Rows /> } /> : null}
        {showLegend ? <Legend iconType='circle' wrapperStyle={{ 'bottom': 0, 'fontSize': 12, 'paddingTop': 12 }} /> : null}
        {series.map((item, index) => {
          const color = getChartColor(colors, index);

          return (
            <Radar
              key={ item.key }
              activeDot={ false }
              dataKey={ item.key }
              dot={ (props) => <ActiveVertex key={ `${item.key}-${props.index}` } active={ active } { ...props } fill={ color } /> }
              fill={ color }
              fillOpacity={ filled && !item.dashed ? 0.18 : 0 }
              isAnimationActive={ false }
              name={ item.label || item.key }
              stroke={ color }
              strokeDasharray={ item.dashed ? '5 4' : undefined }
              strokeWidth={ 2 }
            />
          );
        })}
      </RechartsRadarChart>
    </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Scores on several axes at once: one record per axis (`xKey`, default `label`) and a value per
 * series. A series with `dashed: true` reads as a target; `domain` fixes the scale so two
 * charts compare, and the arrow keys walk the axes.
 */
export function RadarChart(props) {
  const [ frameProps, { colors, data = [], domain = [ 0, 'auto' ], filled = true, series, showLegend = true, showRings = true, showTooltip = true, state, xKey = 'label', yKey = 'value' } ] = splitFrameProps(props);
  const resolvedSeries = getSeries({ series, yKey });
  const records = normalizeRecords(data, xKey, yKey);
  const status = chartStatus({ data: records, 'keys': resolvedSeries.map((item) => item.key), state });

  return (
    <ChartFrame { ...frameProps } height={ frameProps.height ?? 320 } points={ status === 'ready' ? categoryPoints(records, xKey, resolvedSeries, colors) : [] } status={ status }>
      <RadarPlot colors={ colors } data={ records } domain={ domain } filled={ filled } series={ resolvedSeries } showLegend={ showLegend } showRings={ showRings } showTooltip={ showTooltip } xKey={ xKey } />
    </ChartFrame>
  );
}
