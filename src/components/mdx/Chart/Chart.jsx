'use client';

/*
 * The MDX adapter for the Charts collection. Authors write `<Chart type='line' data={…} />` in an
 * article; `type` picks the chart from @gaudi/design-system/charts and every other prop goes to
 * it, so a chart in MDX renders exactly as it does in an application.
 */
import { AreaChart } from '../../charts/AreaChart/index.js';
import { BarChart } from '../../charts/BarChart/index.js';
import { BoxPlotChart } from '../../charts/BoxPlotChart/index.js';
import { ComposedChart } from '../../charts/ComposedChart/index.js';
import { DonutChart, PieChart } from '../../charts/DonutChart/index.js';
import { FunnelChart } from '../../charts/FunnelChart/index.js';
import { GaugeChart } from '../../charts/GaugeChart/index.js';
import { HeatmapChart } from '../../charts/HeatmapChart/index.js';
import { HistogramChart } from '../../charts/HistogramChart/index.js';
import { LineChart } from '../../charts/LineChart/index.js';
import { RadarChart } from '../../charts/RadarChart/index.js';
import { RadialBarChart } from '../../charts/RadialChart/index.js';
import { RangeChart } from '../../charts/RangeChart/index.js';
import { SankeyChart } from '../../charts/SankeyChart/index.js';
import { BubbleChart, ScatterChart } from '../../charts/ScatterChart/index.js';
import { Sparkline } from '../../charts/Sparkline/index.js';
import { StackedBarList } from '../../charts/StackedBarList/index.js';
import { TreemapChart } from '../../charts/TreemapChart/index.js';
import { WaterfallChart } from '../../charts/WaterfallChart/index.js';

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
  'radar': RadarChart,
  'radial': RadialBarChart,
  'range': RangeChart,
  'sankey': SankeyChart,
  'scatter': ScatterChart,
  'sparkline': Sparkline,
  'treemap': TreemapChart,
  'waterfall': WaterfallChart
};

/** Every chart type the MDX switch accepts. */
export const CHART_TYPES = Object.keys(chartTypes);

/** One component for every chart in MDX: `type` picks the chart, the other props go to it. */
export const Chart = ({ type = 'bar', ...props }) => {
  const Component = chartTypes[type] || BarChart;

  return <Component { ...props } />;
};

export default Chart;
