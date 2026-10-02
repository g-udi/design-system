'use client';

import { ChartFrame, activeOpacity, useChartFrame } from '../../ChartFrame/parts/frame.jsx';
import { ChartActiveMarker, ChartAreaGradient, useRechartsActive } from '../../ChartFrame/parts/primitives.jsx';
import { Area, Bar, Cell, Line, RechartsAreaChart, RechartsBarChart, RechartsLineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, YAxis, chartColors } from '../../ChartFrame/parts/runtime.js';
import { chartStatus, normalizeRecords, splitFrameProps } from '../../ChartFrame/parts/shared.js';

function SparklinePlot({ color, data, reference, showEndpoint, variant, xKey, yKey }) {
  const frame = useChartFrame();
  const handlers = useRechartsActive();
  const active = frame?.activeIndex;
  const id = `gaudi-sparkline-${yKey}`;
  const last = data.at(-1);
  const margin = { 'bottom': 3, 'left': 3, 'right': showEndpoint ? 6 : 3, 'top': 3 };
  const extras = (
    <>
      {/* A hidden, data-fitted value axis so the reference line shares the series' scale. */}
      <YAxis domain={ [ 'dataMin', 'dataMax' ] } hide />
      {reference != null ? <ReferenceLine ifOverflow='extendDomain' stroke='var(--ds-color-chart-baseline)' strokeDasharray='2 3' y={ reference } /> : null}
    </>
  );

  if (variant === 'bar') {
    return (
      <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
        <RechartsBarChart accessibilityLayer={ false } barCategoryGap={ 1 } data={ data } margin={ margin } { ...handlers }>
          {extras}
          <Bar dataKey={ yKey } fill={ color } isAnimationActive={ false } radius={ [ 1, 1, 0, 0 ] }>
            {data.map((entry, index) => <Cell key={ `${entry[xKey]}-${index}` } fillOpacity={ activeOpacity(active, index) } />)}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }
  const Root = variant === 'area' ? RechartsAreaChart : RechartsLineChart;

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <Root accessibilityLayer={ false } data={ data } margin={ margin } { ...handlers }>
        {variant === 'area' ? <ChartAreaGradient color={ color } from={ 0.3 } id={ id } /> : null}
        {extras}
        {variant === 'area'
          ? <Area dataKey={ yKey } dot={ false } fill={ `url(#${id})` } isAnimationActive={ false } stroke={ color } strokeWidth={ 1.75 } type='monotone' />
          : <Line dataKey={ yKey } dot={ false } isAnimationActive={ false } stroke={ color } strokeWidth={ 1.75 } type='monotone' />}
        {showEndpoint && last && active == null ? <ReferenceDot fill={ color } r={ 2.5 } stroke='var(--ds-color-surface)' strokeWidth={ 1.5 } x={ last[xKey] } y={ last[yKey] } /> : null}
        <ChartActiveMarker data={ data } series={ [{ color, 'key': yKey }] } xKey={ xKey } />
      </Root>
    </ResponsiveContainer>
  );
}

/**
 * A word-sized trend for stat cards, tables and running text: no axes, no frame by default.
 *
 * @param {object} props
 * @param {Array<number|object>} props.data - Numbers, or records read through `xKey`/`yKey`.
 * @param {'line'|'area'|'bar'} [props.variant='line']
 * @param {number} [props.reference] - A dashed guide such as a target or average.
 * @param {boolean} [props.showEndpoint=true] - Dot on the latest value.
 * @param {string} props.ariaLabel - Name the trend: "Signups, last 14 days".
 */
export function Sparkline(props) {
  const [ frameProps, { color = chartColors[0], data = [], reference, showEndpoint = true, state, variant = 'line', xKey = 'label', yKey = 'value', valueLabel } ] = splitFrameProps(props);
  const records = normalizeRecords(data, xKey, yKey);
  const status = chartStatus({ data: records, 'keys': [ yKey ], state });
  const points = records.map((item) => ({ 'label': String(item[xKey]), 'values': [{ 'name': valueLabel || 'Value', 'value': item[yKey] }] }));

  return (
    <ChartFrame framed={ false } height={ 40 } { ...frameProps } points={ status === 'ready' ? points : [] } status={ status }>
      <SparklinePlot color={ color } data={ records } reference={ reference } showEndpoint={ showEndpoint } variant={ variant } xKey={ xKey } yKey={ yKey } />
    </ChartFrame>
  );
}
