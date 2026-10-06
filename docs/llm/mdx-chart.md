# Chart

> MDX/Chart · mdx · `@gaudi/design-system/mdx/Chart`

Chart is the MDX adapter for the Charts collection: authors write <Chart type=…> (or a chart by name) in an article and get the same framed, accessible chart an application renders from @gaudi/design-system/charts.

In MDX, use Chart with type, or any chart by name from the MDX component map; the blog loads it with dynamic(() => import('@gaudi/design-system/mdx/Chart')). In application code import the charts from @gaudi/design-system/charts. Each chart type has its own page under Charts with detailed examples; this page shows how a chart reads inside an article.

## Import

```js
import Chart from '@gaudi/design-system/mdx/Chart';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `CHART_TYPES`, `Chart`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `bar \| line \| area \| composed \| pie \| donut \| scatter \| bubble \| radar \| radial \| sparkline \| range \| waterfall \| bar-list \| funnel \| sankey \| treemap \| box-plot \| histogram \| gauge \| heatmap` | `bar` | no | Picks the chart from the Charts collection; every other prop goes to that chart. |
| `data` | `Array<Record<string, unknown>> \| number[]` | `[]` | no | Records for the chart; the data shape follows the type (series, slices, steps, cells, groups). |
| `xKey / yKey / series` | `string / string / Array<{ key, label, type?, axis?, dashed? }>` | `label / value / —` | no | Category field and value fields for series charts; composed series take type and axis. |
| `title / description` | `ReactNode` | — | no | Figure caption. |
| `ariaLabel` | `string` | `title or Chart` | no | Accessible name of the plot. |
| `height` | `number \| auto` | `320 (type-specific)` | no | Plot height; list-shaped charts default to auto. |
| `state` | `loading \| error \| empty \| invalid` | `from data` | no | Force a state; otherwise empty and invalid are detected from the data. |
| `labels` | `Partial<typeof DEFAULT_CHART_LABELS>` | `English copy` | no | Copy for states, the keyboard hint, the data table and its toggle. |
| `locale / formatValue` | `string / Intl.NumberFormatOptions \| (value) => string` | `runtime / default number` | no | Number formatting for axes, tooltips, the readout and the table. |
| `showData` | `hidden \| toggle \| visible` | `hidden` | no | Data table visibility; hidden keeps it available to assistive technology. |
| `onActivate / onActiveChange` | `(point, index) => void / (index \| null) => void` | — | no | Click, Enter or Space on a point; the active point changed. |
| `references / annotations` | `Array<{ x?, y?, label, tone? }> / Array<{ x, y, label, tone? }>` | — | no | Labelled guide lines and point notes on category and scatter charts. |
| `stacked / showGrid / showLegend / showTooltip` | `boolean` | `false / true / false / true` | no | Series chart presentation. |
| `selectedIndex / defaultSelectedIndex / onSelect` | `number \| null / number \| null / (slice, index) => void` | `— / null / —` | no | Donut selection; the centre summary shows the selected slice. |
| `otherThreshold / maxSlices / centerLabel` | `number / number / string` | `— / — / Total` | no | Fold small slices into Other; the donut centre caption. |
| `toolbar / framed` | `ReactNode / boolean` | `— / true (false for Sparkline)` | no | Controls beside the caption; the figure border and padding. |
| `colors` | `string[]` | `Gaudi categorical palette` | no | Override the series or slice colours. |
| `className` | `string` | — | no | Root figure class override. |

## Variants

- `type`: `bar`, `line`, `area`, `composed`, `pie`, `donut`, `scatter`, `bubble`, `radar`, `radial`, `sparkline`, `range`, `waterfall`, `bar-list`, `funnel`, `sankey`, `treemap`, `box-plot`, `histogram`, `gauge`, `heatmap`
- `state`: `loading`, `error`, `empty`, `invalid`
- `showData`: `hidden`, `toggle`, `visible`

## Usage

```jsx
<Chart
  type='line'
  title='Readers by channel'
  ariaLabel='Monthly readers by channel'
  data={[
    { label: 'Jan', search: 1840 },
    { label: 'Feb', search: 2110 }
  ]}
  yKey='search'
/>

<DonutChart title='Essays by topic' data={[{ label: 'Data', value: 42 }, { label: 'Engineering', value: 28 }]} />
```

## Accessibility

Every chart is a captioned figure whose plot is one tab stop with a name and the role description "chart". The arrow keys walk the points (Up and Down move between rows on a heatmap), Home and End jump to the ends, Enter or Space activates the point, and Escape clears it; the active point is drawn on the chart and read out in a polite live region. Every value is also in a data table, hidden by default and shown with showData. Loading sets aria-busy, invalid and error states are alerts, and the SVG itself is hidden from assistive technology because the table carries the same data.

## Examples

- Playground (Storybook `mdx-chart--playground`)
- Writing a chart in MDX (Storybook `mdx-chart--in-mdx`)

## README

The MDX adapter for the Charts collection. Authors write `<Chart type=… />` in an article, or any chart by name from the MDX component map, and get the same framed, accessible chart an application renders from `@gaudi/design-system/charts`.

[Open the docs](http://localhost:6007/?path=/docs/mdx-chart--docs) for the Playground and an article that renders a chart inside its prose.

### In an article

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

### Types

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
