# Chart (MDX)

The MDX adapter for the Charts collection. Authors write `<Chart type=… />` in an article, or any chart by name from the MDX component map, and get the same framed, accessible chart an application renders from `@gaudi/design-system/charts`.

[Open the docs](http://localhost:6007/?path=/docs/mdx-chart--docs) for the Playground and an article that renders a chart inside its prose.

## In an article

```mdx
Search still brings in most readers, and the newsletter has grown every month.

<Chart
  type='line'
  title='Readers by channel'
  ariaLabel='Monthly readers by channel'
  data={[{ label: 'Jan', search: 1840 }, { label: 'Feb', search: 2110 }]}
  yKey='search'
/>

<DonutChart title='Essays by topic' data={[{ label: 'Data', value: 42 }, { label: 'Engineering', value: 28 }]} />
```

The blog loads the adapter on demand with `dynamic(() => import('@gaudi/design-system/mdx/Chart'))`; `MDXComponents` from `@gaudi/design-system/mdx` also maps every chart by name.

## Types

`type` picks the chart; every other prop goes to it. Each type has its own page under **Charts** with detailed examples.

| `type` | Chart |
| --- | --- |
| `bar`, `line`, `area`, `composed`, `range`, `sparkline` | BarChart, LineChart, AreaChart, ComposedChart, RangeChart, Sparkline |
| `waterfall`, `funnel`, `sankey` | WaterfallChart, FunnelChart, SankeyChart |
| `pie`, `donut`, `bar-list`, `treemap` | PieChart, DonutChart, StackedBarList, TreemapChart |
| `histogram`, `box-plot`, `scatter`, `bubble` | HistogramChart, BoxPlotChart, ScatterChart, BubbleChart |
| `gauge`, `radial`, `radar`, `heatmap` | GaugeChart, RadialBarChart, RadarChart, HeatmapChart |

Keyboard reading, the data table, the loading, empty, invalid and error states, and locale formatting come from the chart's frame; see `Charts/ChartFrame`.

See [source notices](../../../../README.md#third-party-notices).
