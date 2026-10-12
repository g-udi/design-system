/**
 * Recharts runtime
 *
 * @description Imports each Recharts module by path and resolves its export the same way in
 * ESM, CJS-interop and SSR builds, so one missing export renders the chart fallback instead of
 * throwing. Every chart type reads its Recharts pieces from here.
 */

import * as AreaModule from 'recharts/es6/cartesian/Area.js';
import * as BarModule from 'recharts/es6/cartesian/Bar.js';
import * as CartesianGridModule from 'recharts/es6/cartesian/CartesianGrid.js';
import * as LineModule from 'recharts/es6/cartesian/Line.js';
import * as ReferenceAreaModule from 'recharts/es6/cartesian/ReferenceArea.js';
import * as ReferenceDotModule from 'recharts/es6/cartesian/ReferenceDot.js';
import * as ReferenceLineModule from 'recharts/es6/cartesian/ReferenceLine.js';
import * as ScatterModule from 'recharts/es6/cartesian/Scatter.js';
import * as XAxisModule from 'recharts/es6/cartesian/XAxis.js';
import * as YAxisModule from 'recharts/es6/cartesian/YAxis.js';
import * as ZAxisModule from 'recharts/es6/cartesian/ZAxis.js';
import * as RechartsAreaChartModule from 'recharts/es6/chart/AreaChart.js';
import * as RechartsBarChartModule from 'recharts/es6/chart/BarChart.js';
import * as RechartsComposedChartModule from 'recharts/es6/chart/ComposedChart.js';
import * as RechartsLineChartModule from 'recharts/es6/chart/LineChart.js';
import * as RechartsPieChartModule from 'recharts/es6/chart/PieChart.js';
import * as RechartsRadarChartModule from 'recharts/es6/chart/RadarChart.js';
import * as RechartsRadialBarChartModule from 'recharts/es6/chart/RadialBarChart.js';
import * as RechartsSankeyModule from 'recharts/es6/chart/Sankey.js';
import * as RechartsScatterChartModule from 'recharts/es6/chart/ScatterChart.js';
import * as RechartsTreemapModule from 'recharts/es6/chart/Treemap.js';
import * as CellModule from 'recharts/es6/component/Cell.js';
import * as HooksModule from 'recharts/es6/hooks.js';
import * as LegendModule from 'recharts/es6/component/Legend.js';
import * as ResponsiveContainerModule from 'recharts/es6/component/ResponsiveContainer.js';
import * as RechartsTextModule from 'recharts/es6/component/Text.js';
import * as RechartsTooltipModule from 'recharts/es6/component/Tooltip.js';
import * as PieModule from 'recharts/es6/polar/Pie.js';
import * as PolarAngleAxisModule from 'recharts/es6/polar/PolarAngleAxis.js';
import * as PolarGridModule from 'recharts/es6/polar/PolarGrid.js';
import * as PolarRadiusAxisModule from 'recharts/es6/polar/PolarRadiusAxis.js';
import * as RadarModule from 'recharts/es6/polar/Radar.js';
import * as RadialBarModule from 'recharts/es6/polar/RadialBar.js';

const resolve = (module, key) => module[key] || module.default?.[key] || module.default;

export const Area = resolve(AreaModule, 'Area');
export const Bar = resolve(BarModule, 'Bar');
export const CartesianGrid = resolve(CartesianGridModule, 'CartesianGrid');
export const Cell = resolve(CellModule, 'Cell');
export const usePlotArea = resolve(HooksModule, 'usePlotArea');
export const Legend = resolve(LegendModule, 'Legend');
export const Line = resolve(LineModule, 'Line');
export const Pie = resolve(PieModule, 'Pie');
export const PolarAngleAxis = resolve(PolarAngleAxisModule, 'PolarAngleAxis');
export const PolarGrid = resolve(PolarGridModule, 'PolarGrid');
export const PolarRadiusAxis = resolve(PolarRadiusAxisModule, 'PolarRadiusAxis');
export const Radar = resolve(RadarModule, 'Radar');
export const RadialBar = resolve(RadialBarModule, 'RadialBar');
export const RechartsAreaChart = resolve(RechartsAreaChartModule, 'AreaChart');
export const RechartsBarChart = resolve(RechartsBarChartModule, 'BarChart');
export const RechartsComposedChart = resolve(RechartsComposedChartModule, 'ComposedChart');
export const RechartsLineChart = resolve(RechartsLineChartModule, 'LineChart');
export const RechartsPieChart = resolve(RechartsPieChartModule, 'PieChart');
export const RechartsRadarChart = resolve(RechartsRadarChartModule, 'RadarChart');
export const RechartsRadialBarChart = resolve(RechartsRadialBarChartModule, 'RadialBarChart');
export const RechartsSankey = resolve(RechartsSankeyModule, 'Sankey');
export const RechartsScatterChart = resolve(RechartsScatterChartModule, 'ScatterChart');
export const RechartsText = resolve(RechartsTextModule, 'Text');
export const RechartsTooltip = resolve(RechartsTooltipModule, 'Tooltip');
export const RechartsTreemap = resolve(RechartsTreemapModule, 'Treemap');
export const ReferenceArea = resolve(ReferenceAreaModule, 'ReferenceArea');
export const ReferenceDot = resolve(ReferenceDotModule, 'ReferenceDot');
export const ReferenceLine = resolve(ReferenceLineModule, 'ReferenceLine');
export const ResponsiveContainer = resolve(ResponsiveContainerModule, 'ResponsiveContainer');
export const Scatter = resolve(ScatterModule, 'Scatter');
export const XAxis = resolve(XAxisModule, 'XAxis');
export const YAxis = resolve(YAxisModule, 'YAxis');
export const ZAxis = resolve(ZAxisModule, 'ZAxis');

/** False when any Recharts export failed to resolve; charts then render their fallback. */
export const isChartRuntimeReady = [
  Area, Bar, CartesianGrid, Cell, Legend, Line, Pie, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadialBar,
  RechartsAreaChart, RechartsBarChart, RechartsComposedChart, RechartsLineChart, RechartsPieChart,
  RechartsRadarChart, RechartsRadialBarChart, RechartsSankey, RechartsScatterChart, RechartsText, RechartsTooltip, RechartsTreemap,
  ReferenceArea, ReferenceDot, ReferenceLine, ResponsiveContainer, Scatter, XAxis, YAxis, ZAxis
].every(Boolean);

/** Categorical series colours, in order; the tokens follow light and dark themes. */
export const chartColors = [
  'var(--ds-color-chart-1)',
  'var(--ds-color-chart-2)',
  'var(--ds-color-chart-3)',
  'var(--ds-color-chart-4)',
  'var(--ds-color-chart-5)',
  'var(--ds-color-chart-6)',
  'var(--ds-color-chart-7)',
  'var(--ds-color-chart-8)'
];

/** The nth series colour: an explicit `colors` entry, else the categorical palette. */
export const getChartColor = (colors, index) => colors?.[index] || chartColors[index % chartColors.length];

/** Ordered ramps for magnitude: sequential (low → high), diverging (negative → positive), heatmap (empty → hot). */
export const chartScales = {
  'diverging': [ 'var(--ds-color-chart-div-neg-2)', 'var(--ds-color-chart-div-neg-1)', 'var(--ds-color-chart-div-mid)', 'var(--ds-color-chart-div-pos-1)', 'var(--ds-color-chart-div-pos-2)' ],
  'heatmap': [ 0, 1, 2, 3, 4, 5 ].map((step) => `var(--ds-color-chart-heat-${step})`),
  'heatmapInk': [ 0, 1, 2, 3, 4, 5 ].map((step) => `var(--ds-color-chart-heat-ink-${step})`),
  'sequential': [ 1, 2, 3, 4, 5 ].map((step) => `var(--ds-color-chart-seq-${step})`)
};
