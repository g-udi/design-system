'use client';

/*
 * Article and application charts on Recharts, framed by Gaudi: a captioned figure, one keyboard
 * stop with arrow-key navigation and a readout, loading/empty/invalid states, locale-aware
 * numbers, and a data table that mirrors every value. `Chart type=…` switches between all the
 * types; the named exports are the same charts.
 */
import { useMemo, useState } from 'react';

import { ChartFrame, activeOpacity, useChartFrame } from './parts/frame.jsx';
import {
  ChartActiveMarker,
  ChartAnnotations,
  ChartAreaGradient,
  ChartGrid,
  ChartReferenceLine,
  ChartXAxis,
  ChartYAxis,
  createRowsTooltip,
  useRechartsActive
} from './parts/primitives.jsx';
import {
  Area,
  Bar,
  Cell,
  Legend,
  Line,
  Pie,
  PolarAngleAxis,
  RadialBar,
  RechartsAreaChart,
  RechartsBarChart,
  RechartsComposedChart,
  RechartsLineChart,
  RechartsPieChart,
  RechartsRadialBarChart,
  RechartsScatterChart,
  RechartsTooltip,
  ResponsiveContainer,
  Scatter,
  ZAxis,
  chartColors,
  getChartColor
} from './parts/runtime.js';
import { groupSmallSlices, isChartNumber } from './parts/scale.js';
import { chartStatus, normalizeRecords, splitFrameProps } from './parts/shared.js';

import { BoxPlotChart } from './parts/types/box-plot.jsx';
import { FunnelChart } from './parts/types/funnel.jsx';
import { GaugeChart } from './parts/types/gauge.jsx';
import { HeatmapChart } from './parts/types/heatmap.jsx';
import { HistogramChart } from './parts/types/histogram.jsx';
import { RangeChart } from './parts/types/range.jsx';
import { SankeyChart } from './parts/types/sankey.jsx';
import { Sparkline } from './parts/types/sparkline.jsx';
import { StackedBarList } from './parts/types/stacked-bar-list.jsx';
import { TreemapChart } from './parts/types/treemap.jsx';
import { WaterfallChart } from './parts/types/waterfall.jsx';

const defaultMargins = { 'bottom': 8, 'left': 8, 'right': 16, 'top': 16 };

const getSeries = ({ series, yKey }) => {
  if (series?.length) return series;
  if (yKey) return [{ 'key': yKey, 'label': yKey }];

  return [{ 'key': 'value', 'label': 'Value' }];
};

/** Points the frame navigates: one per category, with a value per series. */
const categoryPoints = (data, xKey, series, colors) => data.map((item) => ({
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

const SeriesChrome = ({ showLegend, showTooltip }) => {
  const Rows = useSeriesTooltip();

  return (
    <>
      {showTooltip ? <RechartsTooltip content={ <Rows /> } cursor={{ 'fill': 'var(--ds-color-chart-cursor)', 'stroke': 'var(--ds-color-chart-grid)' }} /> : null}
      {showLegend ? <Legend iconType='circle' wrapperStyle={{ 'fontSize': 12, 'paddingTop': 12 }} /> : null}
    </>
  );
};

/** Axes, references and annotations shared by the category charts. */
const CategoryAxes = ({ annotations, format, references, showGrid, xKey, yDomain }) => (
  <>
    {showGrid ? <ChartGrid /> : null}
    <ChartXAxis dataKey={ xKey } />
    <ChartYAxis domain={ yDomain } tickFormatter={ format } />
    {references?.map((reference) => <ChartReferenceLine key={ `${reference.x ?? ''}-${reference.y ?? ''}-${reference.label ?? ''}` } { ...reference } />)}
    {annotations?.length ? <ChartAnnotations annotations={ annotations } /> : null}
  </>
);

// MARK: Bar, line and area

function SeriesPlot({ annotations, barRadius = 4, colors, data, kind, references, series, showGrid, showLegend, showTooltip, stacked, xKey, yDomain }) {
  const frame = useChartFrame();
  const handlers = useRechartsActive();
  const active = frame?.activeIndex;
  const format = frame?.format;
  const markerSeries = series.map((item, index) => ({ 'color': getChartColor(colors, index), 'key': item.key }));
  const axes = <CategoryAxes annotations={ annotations } format={ format } references={ references } showGrid={ showGrid } xKey={ xKey } yDomain={ yDomain } />;
  const chrome = <SeriesChrome showLegend={ showLegend } showTooltip={ showTooltip } />;
  const common = { 'accessibilityLayer': false, data, 'margin': defaultMargins, ...handlers };

  if (kind === 'bar') {
    return (
      <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
        <RechartsBarChart { ...common }>
          {axes}
          {chrome}
          {series.map((item, seriesIndex) => (
            <Bar
              key={ item.key }
              dataKey={ item.key }
              fill={ getChartColor(colors, seriesIndex) }
              isAnimationActive={ false }
              name={ item.label || item.key }
              radius={ stacked ? (seriesIndex === series.length - 1 ? [ barRadius, barRadius, 0, 0 ] : 0) : [ barRadius, barRadius, 0, 0 ] }
              stackId={ stacked ? 'stack' : undefined }
            >
              {data.map((entry, index) => <Cell key={ `${entry[xKey]}-${index}` } fillOpacity={ activeOpacity(active, index) } />)}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  const Root = kind === 'area' ? RechartsAreaChart : RechartsLineChart;

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <Root { ...common }>
        {kind === 'area' ? series.map((item, index) => <ChartAreaGradient key={ item.key } color={ getChartColor(colors, index) } id={ `gaudi-chart-${item.key}` } />) : null}
        {axes}
        {chrome}
        {series.map((item, index) => (kind === 'area' ? (
          <Area
            key={ item.key }
            dataKey={ item.key }
            fill={ `url(#gaudi-chart-${item.key})` }
            isAnimationActive={ false }
            name={ item.label || item.key }
            stackId={ stacked ? 'stack' : undefined }
            stroke={ getChartColor(colors, index) }
            strokeWidth={ 2.5 }
            type='monotone'
          />
        ) : (
          <Line
            key={ item.key }
            dataKey={ item.key }
            dot={{ 'r': 3 }}
            isAnimationActive={ false }
            name={ item.label || item.key }
            stroke={ getChartColor(colors, index) }
            strokeDasharray={ item.dashed ? '5 4' : undefined }
            strokeWidth={ 2.5 }
            type='monotone'
          />
        )))}
        <ChartActiveMarker data={ data } series={ markerSeries } xKey={ xKey } />
      </Root>
    </ResponsiveContainer>
  );
}

const makeSeriesChart = (kind) => {
  function SeriesChart(props) {
    const [ frameProps, { annotations, barRadius, colors, data = [], references, series, showGrid = true, showLegend = false, showTooltip = true, stacked = false, state, xKey = 'label', yDomain, yKey = 'value' } ] = splitFrameProps(props);
    const resolvedSeries = getSeries({ series, yKey });
    const chartData = normalizeRecords(data, xKey, yKey);
    const status = chartStatus({ data: chartData, 'keys': resolvedSeries.map((item) => item.key), state });

    return (
      <ChartFrame { ...frameProps } points={ status === 'ready' ? categoryPoints(chartData, xKey, resolvedSeries, colors) : [] } status={ status }>
        <SeriesPlot
          annotations={ annotations }
          barRadius={ barRadius }
          colors={ colors }
          data={ chartData }
          kind={ kind }
          references={ references }
          series={ resolvedSeries }
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

/** Bars per category; `series` for grouped bars, `stacked` to stack them. */
export const BarChart = makeSeriesChart('bar');
/** Lines per series over categories; a series with `dashed: true` reads as a projection. */
export const LineChart = makeSeriesChart('line');
/** Filled areas per series; `stacked` stacks them. */
export const AreaChart = makeSeriesChart('area');

// MARK: Composed

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
              <Bar key={ item.key } dataKey={ item.key } fill={ color } isAnimationActive={ false } name={ item.label || item.key } radius={ [ 4, 4, 0, 0 ] } yAxisId={ yAxisId }>
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
 * 'area'` and `axis: 'right'` for a series in other units, or the older `barKey`/`lineKey`
 * pair (the line then reads against its own right-hand axis).
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

// MARK: Pie and donut

function PiePlot({ centerLabel, colors, data, innerRadius, nameKey, selectedIndex, showLegend, showTooltip, total, valueKey }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => payload.map((item) => ({
    'color': item.payload?.fill,
    'label': item.name,
    'value': `${format(item.value)} · ${Math.round((item.value / total) * 100)}%`
  }))), [ format, total ]);
  const focus = selectedIndex ?? active;
  const focused = focus == null ? null : data[focus];

  return (
    <div className='relative h-full w-full'>
      <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
        <RechartsPieChart accessibilityLayer={ false }>
          {showTooltip ? <RechartsTooltip content={ <Rows /> } /> : null}
          {showLegend ? <Legend iconType='circle' wrapperStyle={{ 'fontSize': 12, 'paddingTop': 12 }} /> : null}
          <Pie
            cx='50%'
            cy='48%'
            data={ data }
            dataKey={ valueKey }
            innerRadius={ innerRadius }
            isAnimationActive={ false }
            nameKey={ nameKey }
            onMouseEnter={ (_, index) => frame?.setActive(index) }
            outerRadius='78%'
            paddingAngle={ 2 }
          >
            {data.map((entry, index) => (
              <Cell
                key={ entry[nameKey] ?? index }
                fill={ entry.isOther ? 'var(--ds-color-chart-muted)' : getChartColor(colors, index) }
                fillOpacity={ activeOpacity(focus, index) }
                stroke={ selectedIndex === index ? 'var(--ds-color-text)' : 'var(--ds-color-surface)' }
                strokeWidth={ selectedIndex === index ? 2 : 1 }
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
      {innerRadius ? (
        // Centre summary: the total, or the selected (or active) slice and its share.
        <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 top-[48%] flex -translate-y-1/2 flex-col items-center text-center' data-slot='chart-center'>
          <span className='text-xl font-semibold tabular-nums text-text'>{format(focused ? focused[valueKey] : total)}</span>
          <span className='max-w-28 truncate text-xs text-text-muted'>
            {focused ? `${focused[nameKey]} · ${Math.round((focused[valueKey] / total) * 100)}%` : centerLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Parts of a whole. Donuts show a centre summary; selection (click, Enter or Space) pins a
 * slice. `otherThreshold` (share) or `maxSlices` folds small slices into "Other".
 */
export function PieChart(props) {
  const [ frameProps, {
    centerLabel,
    colors,
    data = [],
    defaultSelectedIndex = null,
    innerRadius = 0,
    maxSlices,
    nameKey = 'label',
    onSelect,
    otherLabel,
    otherThreshold,
    selectable = Boolean(innerRadius),
    selectedIndex: controlledSelected,
    showLegend = true,
    showTooltip = true,
    state,
    valueKey = 'value'
  } ] = splitFrameProps(props);
  const [ uncontrolledSelected, setSelected ] = useState(defaultSelectedIndex);
  const selectedIndex = controlledSelected === undefined ? uncontrolledSelected : controlledSelected;
  const labels = { 'other': 'Other', 'total': 'Total', ...frameProps.labels };
  const records = normalizeRecords(data, nameKey, valueKey);
  const status = chartStatus({ data: records, 'keys': [ valueKey ], state });
  const slices = status === 'ready' ? groupSmallSlices(records, { maxSlices, nameKey, 'otherLabel': otherLabel || labels.other, 'threshold': otherThreshold, valueKey }) : [];
  const total = slices.reduce((sum, item) => sum + (isChartNumber(item[valueKey]) ? item[valueKey] : 0), 0);
  const points = slices.map((item) => ({
    'label': String(item[nameKey]),
    'values': [
      { 'name': props.valueLabel || 'Value', 'value': item[valueKey] },
      { 'display': `${total ? Math.round((item[valueKey] / total) * 100) : 0}%`, 'name': 'Share', 'value': total ? item[valueKey] / total : 0 },
      ...(item.isOther ? [{ 'display': item.members.join(', '), 'name': 'Includes', 'value': item.members.length }] : [])
    ]
  }));

  const select = (point, index) => {
    if (selectable) {
      const next = selectedIndex === index ? null : index;
      setSelected(next);
      onSelect?.(next == null ? null : slices[next], next);
    }
    frameProps.onActivate?.(point, index);
  };

  return (
    <ChartFrame { ...frameProps } height={ frameProps.height ?? 320 } onActivate={ selectable || frameProps.onActivate ? select : undefined } points={ points } status={ status }>
      <PiePlot centerLabel={ centerLabel || labels.total } colors={ colors } data={ slices } innerRadius={ innerRadius } nameKey={ nameKey } selectedIndex={ selectable ? selectedIndex : null } showLegend={ showLegend } showTooltip={ showTooltip } total={ total } valueKey={ valueKey } />
    </ChartFrame>
  );
}

/** A pie with a hole and a centre summary; selectable by default. */
export const DonutChart = (props) => <PieChart innerRadius='56%' { ...props } />;

// MARK: Scatter and bubble

function ScatterPlot({ color, data, references, showGrid, showTooltip, xKey, xLabel, yKey, yLabel, zKey, zLabel, zRange }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => {
    const point = payload[0]?.payload || {};

    return [
      { 'label': xLabel || xKey, 'value': format(point[xKey]) },
      { 'label': yLabel || yKey, 'value': format(point[yKey]) },
      zKey ? { 'label': zLabel || zKey, 'value': format(point[zKey]) } : null
    ];
  }, { 'title': (_, payload) => payload[0]?.payload?.label }), [ format, xKey, xLabel, yKey, yLabel, zKey, zLabel ]);
  const fill = color || chartColors[0];

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsScatterChart accessibilityLayer={ false } margin={ defaultMargins }>
        {showGrid ? <ChartGrid vertical /> : null}
        <ChartXAxis dataKey={ xKey } name={ xLabel || xKey } tickFormatter={ format } type='number' />
        <ChartYAxis dataKey={ yKey } name={ yLabel || yKey } tickFormatter={ format } type='number' />
        {zKey ? <ZAxis dataKey={ zKey } name={ zLabel || zKey } range={ zRange } type='number' /> : null}
        {references?.map((reference) => <ChartReferenceLine key={ `${reference.x ?? ''}-${reference.y ?? ''}` } { ...reference } />)}
        {showTooltip ? <RechartsTooltip content={ <Rows /> } cursor={{ 'strokeDasharray': '3 3' }} /> : null}
        <Scatter
          data={ data }
          fill={ fill }
          fillOpacity={ zKey ? 0.55 : 0.9 }
          isAnimationActive={ false }
          name={ yLabel || yKey }
          onMouseEnter={ (_, index) => frame?.setActive(index) }
        >
          {data.map((entry, index) => (
            <Cell
              key={ entry.label ?? `${entry[xKey]}-${entry[yKey]}-${index}` }
              fill={ entry.color || fill }
              fillOpacity={ active === index ? 1 : active == null ? (zKey ? 0.55 : 0.9) : 0.3 }
              stroke={ active === index ? 'var(--ds-color-text)' : 'var(--ds-color-surface)' }
              strokeWidth={ active === index ? 2 : 1 }
            />
          ))}
        </Scatter>
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}

/** Correlation between two numbers; add `zKey` for bubble sizes. Points may carry a `label`. */
export function ScatterChart(props) {
  const [ frameProps, { color, data = [], references, showGrid = true, showTooltip = true, state, xKey = 'x', xLabel, yKey = 'y', yLabel, zKey, zLabel, zRange = [ 60, 900 ] } ] = splitFrameProps(props);
  const records = normalizeRecords(data, xKey, yKey, true);
  const keys = [ xKey, yKey, ...(zKey ? [ zKey ] : []) ];
  const status = chartStatus({ data: records, keys, state });
  const points = records.map((item, index) => ({
    'label': String(item.label ?? `${index + 1}`),
    'values': [
      { 'name': xLabel || xKey, 'value': item[xKey] },
      { 'name': yLabel || yKey, 'value': item[yKey] },
      ...(zKey ? [{ 'name': zLabel || zKey, 'value': item[zKey] }] : [])
    ]
  }));

  return (
    <ChartFrame { ...frameProps } points={ status === 'ready' ? points : [] } status={ status }>
      <ScatterPlot color={ color } data={ records } references={ references } showGrid={ showGrid } showTooltip={ showTooltip } xKey={ xKey } xLabel={ xLabel } yKey={ yKey } yLabel={ yLabel } zKey={ zKey } zLabel={ zLabel } zRange={ zRange } />
    </ChartFrame>
  );
}

/** A scatter whose third value sets each bubble's area. */
export const BubbleChart = ({ zKey = 'z', ...props }) => <ScatterChart zKey={ zKey } { ...props } />;

// MARK: Radial

function RadialPlot({ color, colors, data, nameKey, valueKey }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => payload.map((item) => ({ 'label': item.payload?.[nameKey], 'value': `${item.value}%` }))), [ nameKey ]);

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsRadialBarChart accessibilityLayer={ false } barSize={ 18 } cx='50%' cy='50%' data={ data } endAngle={ -270 } innerRadius='42%' outerRadius='88%' startAngle={ 90 }>
        {/* Values are percentages: the track is the full 0–100 range. */}
        <PolarAngleAxis domain={ [ 0, 100 ] } tick={ false } type='number' />
        <RadialBar background={{ 'fill': 'var(--ds-color-chart-track)' }} cornerRadius={ 16 } dataKey={ valueKey } fill={ color || chartColors[0] } isAnimationActive={ false } nameKey={ nameKey } onMouseEnter={ (_, index) => frame?.setActive(index) }>
          {data.map((entry, index) => <Cell key={ entry[nameKey] ?? index } fill={ data.length > 1 ? getChartColor(colors, index) : color || chartColors[0] } fillOpacity={ activeOpacity(active, index) } />)}
        </RadialBar>
        <RechartsTooltip content={ <Rows /> } />
      </RechartsRadialBarChart>
    </ResponsiveContainer>
  );
}

/** Progress against a full 0–100 track, one ring per record. */
export function RadialBarChart(props) {
  const [ frameProps, { color, colors, data = [], nameKey = 'label', state, valueKey = 'value' } ] = splitFrameProps(props);
  const records = normalizeRecords(data, nameKey, valueKey);
  const status = chartStatus({ data: records, 'keys': [ valueKey ], state });
  const points = records.map((item) => ({ 'label': String(item[nameKey]), 'values': [{ 'display': `${item[valueKey]}%`, 'name': props.valueLabel || 'Value', 'value': item[valueKey] }] }));

  return (
    <ChartFrame { ...frameProps } height={ frameProps.height ?? 300 } points={ status === 'ready' ? points : [] } status={ status }>
      <RadialPlot color={ color } colors={ colors } data={ records } nameKey={ nameKey } valueKey={ valueKey } />
    </ChartFrame>
  );
}

// MARK: Chart switch

const chartTypes = {
  'area': AreaChart,
  'bar': BarChart,
  'bar-list': StackedBarList,
  'box-plot': BoxPlotChart,
  'bubble': BubbleChart,
  'composed': ComposedChart,
  'donut': DonutChart,
  'funnel': FunnelChart,
  'gauge': GaugeChart,
  'heatmap': HeatmapChart,
  'histogram': HistogramChart,
  'line': LineChart,
  'pie': PieChart,
  'radial': RadialBarChart,
  'range': RangeChart,
  'sankey': SankeyChart,
  'scatter': ScatterChart,
  'sparkline': Sparkline,
  'treemap': TreemapChart,
  'waterfall': WaterfallChart
};

/** Every chart type the switch accepts. */
export const CHART_TYPES = Object.keys(chartTypes);

/** One component for every chart: `type` picks the chart, the other props go to it. */
export const Chart = ({ type = 'bar', ...props }) => {
  const Component = chartTypes[type] || BarChart;

  return <Component { ...props } />;
};

export { BoxPlotChart, FunnelChart, GaugeChart, HeatmapChart, HistogramChart, RangeChart, SankeyChart, Sparkline, StackedBarList, TreemapChart, WaterfallChart };

export default Chart;
