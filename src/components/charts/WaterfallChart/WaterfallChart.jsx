'use client';

import { useMemo } from 'react';

import { ChartFrame, activeOpacity, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { ChartGrid, ChartReferenceLine, ChartXAxis, ChartYAxis, createRowsTooltip, useRechartsActive } from '../ChartFrame/ChartMarks.jsx';
import { Bar, Cell, RechartsBarChart, RechartsTooltip, ResponsiveContainer } from '../ChartFrame/chartRuntime.js';
import { isChartNumber } from '../ChartFrame/chartScale.js';
import { chartStatus, splitFrameProps } from '../ChartFrame/chartData.js';

const stepColor = (step) => (step.isTotal ? 'var(--ds-color-chart-total)' : step.change < 0 ? 'var(--ds-color-chart-negative)' : 'var(--ds-color-chart-positive)');

/**
 * Running totals for a waterfall: each change floats from the previous total; totals start at 0.
 *
 * @param {object[]} data - Steps `{ label, value, total? }`.
 * @returns {Array<{ label: string, change: number, start: number, end: number, isTotal: boolean }>}
 */
export function waterfallSteps(data, { labelKey = 'label', totalKey = 'total', valueKey = 'value' } = {}) {
  let running = 0;

  return data.map((item) => {
    if (item[totalKey]) {
      const end = isChartNumber(item[valueKey]) ? item[valueKey] : running;
      running = end;

      return { 'change': end, end, 'isTotal': true, 'label': String(item[labelKey]), 'range': [ 0, end ], 'start': 0 };
    }
    const start = running;
    const end = running + item[valueKey];
    running = end;

    return { 'change': item[valueKey], end, 'isTotal': false, 'label': String(item[labelKey]), 'range': [ Math.min(start, end), Math.max(start, end) ], start };
  });
}

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
      <RechartsBarChart accessibilityLayer={ false } barCategoryGap='18%' data={ steps } margin={{ 'bottom': 8, 'left': 8, 'right': 16, 'top': 16 }} { ...handlers }>
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
