'use client';

import { useMemo } from 'react';

import { ChartFrame, useChartFrame } from '../frame.jsx';
import { ChartActiveMarker, ChartAnnotations, ChartGrid, ChartReferenceLine, ChartXAxis, ChartYAxis, createRowsTooltip, useRechartsActive } from '../primitives.jsx';
import { Area, Line, RechartsComposedChart, RechartsTooltip, ResponsiveContainer, chartColors } from '../runtime.js';
import { chartStatus, splitFrameProps } from '../shared.js';

function RangePlot({ annotations, bandLabel, color, data, highKey, lowKey, references, showGrid, valueKey, valueLabel, xKey }) {
  const frame = useChartFrame();
  const handlers = useRechartsActive();
  const format = frame?.format || String;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => {
    const point = payload[0]?.payload || {};

    return [
      valueKey ? { color, 'label': valueLabel, 'value': format(point[valueKey]) } : null,
      { 'label': bandLabel, 'value': `${format(point[lowKey])} – ${format(point[highKey])}` }
    ];
  }), [ bandLabel, color, format, highKey, lowKey, valueKey, valueLabel ]);

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsComposedChart accessibilityLayer={ false } data={ data } margin={{ 'bottom': 8, 'left': 8, 'right': 16, 'top': 16 }} { ...handlers }>
        {showGrid ? <ChartGrid /> : null}
        <ChartXAxis dataKey={ xKey } />
        <ChartYAxis tickFormatter={ format } />
        <RechartsTooltip content={ <Rows /> } cursor={{ 'stroke': 'var(--ds-color-chart-grid)' }} />
        {/* An area whose value is [low, high] draws the band between them. */}
        <Area dataKey={ (item) => [ item[lowKey], item[highKey] ] } fill={ color } fillOpacity={ 0.18 } isAnimationActive={ false } name={ bandLabel } stroke='none' type='monotone' />
        {valueKey ? <Line dataKey={ valueKey } dot={ false } isAnimationActive={ false } name={ valueLabel } stroke={ color } strokeWidth={ 2.25 } type='monotone' /> : null}
        {references?.map((reference) => <ChartReferenceLine key={ `${reference.x ?? ''}-${reference.y ?? ''}` } { ...reference } />)}
        {annotations?.length ? <ChartAnnotations annotations={ annotations } /> : null}
        {valueKey ? <ChartActiveMarker data={ data } series={ [{ color, 'key': valueKey }] } xKey={ xKey } /> : null}
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
}

/**
 * A band between a low and a high value per category, with an optional line through it:
 * forecasts with confidence intervals, p50 latency inside its p10–p90 spread, daily temperature.
 *
 * @param {object} props
 * @param {object[]} props.data - Records with `lowKey`, `highKey` and optionally `valueKey`.
 * @param {string} [props.bandLabel='Range'] - Name of the band in tooltips and the table.
 * @param {string} [props.valueLabel='Value'] - Name of the line.
 */
export function RangeChart(props) {
  const [ frameProps, { annotations, bandLabel = 'Range', color = chartColors[0], data = [], highKey = 'high', lowKey = 'low', references, showGrid = true, state, valueKey = 'value', valueLabel = 'Value', xKey = 'label' } ] = splitFrameProps(props);
  const records = Array.isArray(data) ? data : [];
  const hasValue = valueKey && records.some((item) => item?.[valueKey] != null);
  const line = hasValue ? valueKey : null;
  const status = chartStatus({ 'data': records, 'keys': [ lowKey, highKey, ...(line ? [ line ] : []) ], state });
  const points = records.map((item) => ({
    'label': String(item[xKey]),
    'values': [
      ...(line ? [{ 'name': valueLabel, 'value': item[line] }] : []),
      { 'name': `${bandLabel} low`, 'value': item[lowKey] },
      { 'name': `${bandLabel} high`, 'value': item[highKey] }
    ]
  }));

  return (
    <ChartFrame { ...frameProps } points={ status === 'ready' ? points : [] } status={ status }>
      <RangePlot annotations={ annotations } bandLabel={ bandLabel } color={ color } data={ records } highKey={ highKey } lowKey={ lowKey } references={ references } showGrid={ showGrid } valueKey={ line } valueLabel={ valueLabel } xKey={ xKey } />
    </ChartFrame>
  );
}
