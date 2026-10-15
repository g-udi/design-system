'use client';

import { useMemo } from 'react';

import { ChartFrame, activeOpacity, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { ChartGrid, ChartReferenceLine, ChartXAxis, ChartYAxis, useRechartsActive } from '../ChartFrame/ChartMarks.jsx';
import { createRowsTooltip } from '../ChartFrame/chartTooltip.jsx';
import { Bar, Cell, RechartsBarChart, RechartsTooltip, ResponsiveContainer } from '../ChartFrame/chartRuntime.js';
import { defaultMargins } from '../ChartFrame/ChartSeries.jsx';
import { chartStatus, splitFrameProps } from '../ChartFrame/chartData.js';
import { waterfallSteps } from './waterfallModel.js';

const stepColor = (step) => (step.isTotal ? 'var(--ds-color-chart-total)' : step.change < 0 ? 'var(--ds-color-chart-negative)' : 'var(--ds-color-chart-positive)');

function WaterfallPlot({ changeLabel, showGrid, steps, totalLabel }) {
  const frame = useChartFrame();
  const handlers = useRechartsActive();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => {
    const step = payload[0]?.payload;
    if (!step) return [];

    return step.isTotal
      ? [{ 'color': stepColor(step), 'label': totalLabel, 'value': format(step.end) }]
      : [{ 'color': stepColor(step), 'label': changeLabel, 'value': `${step.change > 0 ? '+' : ''}${format(step.change)}` }, { 'label': totalLabel, 'value': format(step.end) }];
  }), [ changeLabel, format, totalLabel ]);

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsBarChart accessibilityLayer={ false } barCategoryGap='18%' data={ steps } margin={ defaultMargins } { ...handlers }>
        {showGrid ? <ChartGrid /> : null}
        <ChartXAxis dataKey='label' />
        <ChartYAxis tickFormatter={ format } />
        <ChartReferenceLine dashed={ false } y={ 0 } />
        <RechartsTooltip content={ <Rows /> } cursor={{ 'fill': 'var(--ds-color-chart-cursor)' }} />
        {/* A bar whose value is [low, high] floats between the totals before and after the change. */}
        <Bar dataKey='range' isAnimationActive={ false } name={ changeLabel } radius={ 2 }>
          {steps.map((step, index) => <Cell key={ `${step.label}-${index}` } fill={ stepColor(step) } fillOpacity={ activeOpacity(active, index) } />)}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

/**
 * How a starting value becomes an ending one through increases and decreases.
 *
 * @param {object} props
 * @param {object[]} props.data - Steps `{ label, value }`; `{ label, total: true }` draws the running total (or `value` when given).
 * @param {string} [props.changeLabel='Change'] / [props.totalLabel='Total'] - Names in tooltips and the table.
 */
export function WaterfallChart(props) {
  const [ frameProps, { changeLabel = 'Change', data = [], labelKey = 'label', showGrid = true, state, totalKey = 'total', totalLabel = 'Total', valueKey = 'value' } ] = splitFrameProps(props);
  const records = Array.isArray(data) ? data : [];
  const status = chartStatus({ 'data': records, 'keys': [ valueKey ], state });
  const steps = status === 'ready' ? waterfallSteps(records, { labelKey, totalKey, valueKey }) : [];
  const points = steps.map((step) => ({
    'label': step.label,
    'values': step.isTotal
      ? [{ 'name': totalLabel, 'value': step.end }]
      : [{ 'name': changeLabel, 'value': step.change }, { 'name': totalLabel, 'value': step.end }]
  }));

  return (
    <ChartFrame { ...frameProps } points={ points } status={ status }>
      <WaterfallPlot changeLabel={ changeLabel } showGrid={ showGrid } steps={ steps } totalLabel={ totalLabel } />
    </ChartFrame>
  );
}
