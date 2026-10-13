'use client';

/*
 * The category plot shared by BarChart, LineChart, AreaChart and ComposedChart: series over a
 * category axis inside the Gaudi chart frame, with references, annotations, tooltips, a legend,
 * keyboard points and the active marker.
 */
import { useId, useMemo } from 'react';

import { ChartFrame, activeOpacity, useChartFrame } from './ChartFrame.jsx';
import { useMeasuredWidth } from './chartMeasure.js';
import {
  ChartActiveMarker,
  ChartAnnotations,
  ChartAreaGradient,
  ChartGrid,
  ChartReferenceLine,
  ChartSeriesLegend,
  ChartXAxis,
  ChartYAxis,
  createRowsTooltip,
  useRechartsActive
} from './ChartMarks.jsx';
import {
  Area,
  Bar,
  Cell,
  Line,
  RechartsAreaChart,
  RechartsBarChart,
  RechartsLineChart,
  RechartsTooltip,
  ResponsiveContainer,
  getChartColor
} from './chartRuntime.js';
import { chartStatus, normalizeRecords, splitFrameProps } from './chartData.js';

export const defaultMargins = { 'bottom': 8, 'left': 8, 'right': 16, 'top': 16 };

/** The series to draw: `series`, a single `yKey`, or the default `value`. */
export const getSeries = ({ series, yKey }) => {
  if (series?.length) return series;
  if (yKey) return [{ 'key': yKey, 'label': yKey }];

  return [{ 'key': 'value', 'label': 'Value' }];
};

/** Points the frame navigates: one per category, with a value per series. */
export const categoryPoints = (data, xKey, series, colors) => data.map((item) => ({
  'label': String(item[xKey] ?? ''),
  'values': series.map((entry, index) => ({ 'color': getChartColor(colors, index), 'name': entry.label || entry.key, 'value': item[entry.key] }))
}));

/** Tooltip rows formatted with the frame's number format. */
const useSeriesTooltip = () => {
  const frame = useChartFrame();
  const format = frame?.format || String;

  return useMemo(() => createRowsTooltip(({ payload }) => payload.map((item) => ({
    'color': item.color || item.payload?.fill,
    'label': item.name || item.dataKey,
    'value': Array.isArray(item.value) ? item.value.map(format).join(' – ') : format(item.value)
  }))), [ format ]);
};

export const SeriesChrome = ({ showLegend, showTooltip }) => {
  const Rows = useSeriesTooltip();

  return (
    <>
      {showTooltip ? <RechartsTooltip content={ <Rows /> } cursor={{ 'fill': 'var(--ds-color-chart-cursor)', 'stroke': 'var(--ds-color-chart-grid)' }} /> : null}
      {showLegend ? <ChartSeriesLegend /> : null}
    </>
  );
};

/** Axes, references and annotations shared by the category charts. */
export const CategoryAxes = ({ annotations, categoryWidth, format, layout = 'horizontal', references, showGrid, xKey, yDomain }) => (layout === 'vertical' ? (
  <>
    {showGrid ? <ChartGrid horizontal={ false } vertical /> : null}
    <ChartXAxis domain={ yDomain } tickFormatter={ format } type='number' />
    <ChartYAxis dataKey={ xKey } type='category' width={ categoryWidth } />
    {references?.map((reference) => <ChartReferenceLine key={ `${reference.x ?? ''}-${reference.y ?? ''}-${reference.label ?? ''}` } { ...reference } />)}
    {annotations?.length ? <ChartAnnotations annotations={ annotations } /> : null}
  </>
) : (
  <>
    {showGrid ? <ChartGrid /> : null}
    <ChartXAxis dataKey={ xKey } />
    <ChartYAxis domain={ yDomain } tickFormatter={ format } />
    {references?.map((reference) => <ChartReferenceLine key={ `${reference.x ?? ''}-${reference.y ?? ''}-${reference.label ?? ''}` } { ...reference } />)}
    {annotations?.length ? <ChartAnnotations annotations={ annotations } /> : null}
  </>
));

const barRadiusFor = ({ barRadius, horizontal, last, stacked }) => {
  const round = horizontal ? [ 0, barRadius, barRadius, 0 ] : [ barRadius, barRadius, 0, 0 ];

  return stacked && !last ? 0 : round;
};

function SeriesPlot({ annotations, barRadius = 4, colors, curve = 'monotone', data, highlight, kind, layout, references, series, showDots = true, showGrid, showLegend, showTooltip, stacked, xKey, yDomain }) {
  const gradientId = useId();
  const frame = useChartFrame();
  const handlers = useRechartsActive();
  const active = frame?.activeIndex ?? (highlight == null ? null : data.findIndex((item) => String(item[xKey]) === String(highlight)));
  const format = frame?.format;
  const horizontal = kind === 'bar' && layout === 'horizontal';
  // Horizontal bars give their category labels at most a third of the plot, so long titles wrap on phones.
  const [ measureRef, plotWidth ] = useMeasuredWidth(640);
  const categoryWidth = Math.round(Math.min(180, Math.max(72, plotWidth * 0.34)));
  const markerSeries = series.map((item, index) => ({ 'color': getChartColor(colors, index), 'key': item.key }));
  const axes = <CategoryAxes annotations={ annotations } categoryWidth={ categoryWidth } format={ format } layout={ horizontal ? 'vertical' : 'horizontal' } references={ references } showGrid={ showGrid } xKey={ xKey } yDomain={ yDomain } />;
  const chrome = <SeriesChrome showLegend={ showLegend } showTooltip={ showTooltip } />;
  const common = { 'accessibilityLayer': false, data, 'margin': defaultMargins, ...handlers };

  if (kind === 'bar') {
    return (
      <div ref={ measureRef } className='h-full w-full'>
        <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
          <RechartsBarChart { ...common } layout={ horizontal ? 'vertical' : 'horizontal' }>
            {axes}
            {chrome}
            {series.map((item, seriesIndex) => (
              <Bar
                key={ item.key }
                dataKey={ item.key }
                fill={ getChartColor(colors, seriesIndex) }
                isAnimationActive={ false }
                name={ item.label || item.key }
                radius={ barRadiusFor({ barRadius, horizontal, 'last': seriesIndex === series.length - 1, stacked }) }
                stackId={ stacked ? 'stack' : undefined }
              >
                {data.map((entry, index) => <Cell key={ `${entry[xKey]}-${index}` } fillOpacity={ activeOpacity(active < 0 ? null : active, index) } />)}
              </Bar>
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const Root = kind === 'area' ? RechartsAreaChart : RechartsLineChart;

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <Root { ...common }>
        {kind === 'area' ? series.map((item, index) => <ChartAreaGradient key={ item.key } color={ getChartColor(colors, index) } id={ `${gradientId}-${index}` } />) : null}
        {axes}
        {chrome}
        {series.map((item, index) => (kind === 'area' ? (
          <Area
            key={ item.key }
            dataKey={ item.key }
            fill={ `url(#${gradientId}-${index})` }
            isAnimationActive={ false }
            name={ item.label || item.key }
            stackId={ stacked ? 'stack' : undefined }
            stroke={ getChartColor(colors, index) }
            strokeDasharray={ item.dashed ? '5 4' : undefined }
            strokeWidth={ 2.5 }
            type={ curve }
          />
        ) : (
          <Line
            key={ item.key }
            dataKey={ item.key }
            dot={ showDots ? { 'r': 3 } : false }
            isAnimationActive={ false }
            name={ item.label || item.key }
            stroke={ getChartColor(colors, index) }
            strokeDasharray={ item.dashed ? '5 4' : undefined }
            strokeWidth={ 2.5 }
            type={ curve }
          />
        )))}
        <ChartActiveMarker data={ data } series={ markerSeries } xKey={ xKey } />
      </Root>
    </ResponsiveContainer>
  );
}

/**
 * A framed series chart of one kind. The returned component reads `data`, `series` (or
 * `yKey`), `xKey`, `stacked`, `references`, `annotations`, `highlight` and the frame props.
 *
 * @param {'bar'|'line'|'area'} kind
 */
export const makeSeriesChart = (kind) => {
  function SeriesChart(props) {
    const [ frameProps, { annotations, barRadius, colors, curve, data = [], highlight, layout = 'vertical', references, series, showDots, showGrid = true, showLegend = false, showTooltip = true, stacked = false, state, xKey = 'label', yDomain, yKey = 'value' } ] = splitFrameProps(props);
    const resolvedSeries = getSeries({ series, yKey });
    const chartData = normalizeRecords(data, xKey, yKey);
    const status = chartStatus({ data: chartData, 'keys': resolvedSeries.map((item) => item.key), state });

    return (
      <ChartFrame { ...frameProps } points={ status === 'ready' ? categoryPoints(chartData, xKey, resolvedSeries, colors) : [] } status={ status }>
        <SeriesPlot
          annotations={ annotations }
          barRadius={ barRadius }
          colors={ colors }
          curve={ curve }
          data={ chartData }
          highlight={ highlight }
          kind={ kind }
          layout={ layout }
          references={ references }
          series={ resolvedSeries }
          showDots={ showDots }
          showGrid={ showGrid }
          showLegend={ showLegend }
          showTooltip={ showTooltip }
          stacked={ stacked }
          xKey={ xKey }
          yDomain={ yDomain }
        />
      </ChartFrame>
    );
  }

  return SeriesChart;
};
