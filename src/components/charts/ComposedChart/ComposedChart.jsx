'use client';

import { ChartFrame, activeOpacity, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { ChartActiveMarker, ChartYAxis, useRechartsActive } from '../ChartFrame/ChartMarks.jsx';
import { Area, Bar, Cell, Line, RechartsComposedChart, ResponsiveContainer, getChartColor } from '../ChartFrame/chartRuntime.js';
import { CategoryAxes, SeriesChrome, categoryPoints, defaultMargins } from '../ChartFrame/ChartSeries.jsx';
import { chartStatus, normalizeRecords, splitFrameProps } from '../ChartFrame/chartData.js';

function ComposedPlot({ annotations, colors, data, references, series, showGrid, showLegend, showTooltip, xKey }) {
  const frame = useChartFrame();
  const handlers = useRechartsActive();
  const active = frame?.activeIndex;
  const lines = series.filter((item) => item.type !== 'bar').map((item) => ({ 'color': getChartColor(colors, series.indexOf(item)), 'key': item.key, 'yAxisId': item.axis === 'right' ? 'right' : undefined }));
  const hasRightAxis = series.some((item) => item.axis === 'right');

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsComposedChart accessibilityLayer={ false } data={ data } margin={ defaultMargins } { ...handlers }>
        <CategoryAxes annotations={ annotations } format={ frame?.format } references={ references } showGrid={ showGrid } xKey={ xKey } />
        {/* A second scale for series measured in other units, such as minutes beside views. */}
        {hasRightAxis ? <ChartYAxis orientation='right' tickFormatter={ frame?.format } yAxisId='right' /> : null}
        <SeriesChrome showLegend={ showLegend } showTooltip={ showTooltip } />
        {series.map((item, index) => {
          const color = getChartColor(colors, index);
          const yAxisId = item.axis === 'right' ? 'right' : undefined;
          if (item.type === 'bar') {
            return (
              <Bar key={ item.key } dataKey={ item.key } fill={ color } isAnimationActive={ false } name={ item.label || item.key } radius={ [ 4, 4, 0, 0 ] } stackId={ item.stack } yAxisId={ yAxisId }>
                {data.map((entry, pointIndex) => <Cell key={ `${entry[xKey]}-${pointIndex}` } fillOpacity={ activeOpacity(active, pointIndex) } />)}
              </Bar>
            );
          }
          if (item.type === 'area') return <Area key={ item.key } dataKey={ item.key } fill={ color } fillOpacity={ 0.16 } isAnimationActive={ false } name={ item.label || item.key } stroke={ color } strokeWidth={ 2 } type='monotone' yAxisId={ yAxisId } />;

          return <Line key={ item.key } dataKey={ item.key } dot={{ 'r': 3 }} isAnimationActive={ false } name={ item.label || item.key } stroke={ color } strokeDasharray={ item.dashed ? '5 4' : undefined } strokeWidth={ 2.5 } type='monotone' yAxisId={ yAxisId } />;
        })}
        <ChartActiveMarker data={ data } series={ lines } xKey={ xKey } />
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
}

/**
 * Bars and lines (or areas) on one category axis. Pass `series` with `type: 'bar' | 'line' |
 * 'area'`, `axis: 'right'` for a series in other units and `stack` to stack bars, or the older
 * `barKey`/`lineKey` pair (the line then reads against its own right-hand axis).
 */
export function ComposedChart(props) {
  const [ frameProps, { annotations, barKey = 'views', barLabel = 'Views', colors, data = [], lineKey = 'readTime', lineLabel = 'Read time', references, series, showGrid = true, showLegend = true, showTooltip = true, state, xKey = 'label' } ] = splitFrameProps(props);
  const resolvedSeries = series?.length ? series : [{ 'key': barKey, 'label': barLabel, 'type': 'bar' }, { 'axis': 'right', 'key': lineKey, 'label': lineLabel, 'type': 'line' }];
  const chartData = normalizeRecords(data, xKey, resolvedSeries[0].key);
  const status = chartStatus({ data: chartData, 'keys': resolvedSeries.map((item) => item.key), state });

  return (
    <ChartFrame { ...frameProps } points={ status === 'ready' ? categoryPoints(chartData, xKey, resolvedSeries, colors) : [] } status={ status }>
      <ComposedPlot annotations={ annotations } colors={ colors } data={ chartData } references={ references } series={ resolvedSeries } showGrid={ showGrid } showLegend={ showLegend } showTooltip={ showTooltip } xKey={ xKey } />
    </ChartFrame>
  );
}
