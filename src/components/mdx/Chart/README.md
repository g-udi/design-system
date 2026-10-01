# Chart

This Gaudi owner includes **chart**, with **22 practical examples** for articles and application analytics.

Import the documented composition from `@gaudi/design-system/mdx/Chart` (or `@gaudi/design-system/mdx` for the MDX map). Existing convenience names are preserved; compound roots use explicit aliases where needed.

[Open the first example](http://localhost:6007/?path=/story/mdx-chart--chart-pattern-13) for the complete JSX and public imports. The Storybook catalogue lists every chart type, grouped by type.

## Chart types

`Chart type=…` and the named exports are the same charts:

| Shape | Types |
| --- | --- |
| Series over categories | `BarChart`, `LineChart`, `AreaChart`, `ComposedChart` (series on a right-hand `axis`), `RangeChart` (a low–high band with a line), `Sparkline` |
| Change and flow | `WaterfallChart`, `FunnelChart`, `SankeyChart` |
| Part of a whole | `PieChart`, `DonutChart` (selection, centre summary, small slices folded into Other), `StackedBarList`, `TreemapChart` |
| Distribution and correlation | `HistogramChart` (round bins, labelled markers), `BoxPlotChart`, `ScatterChart`, `BubbleChart` |
| Single readings and grids | `GaugeChart` (threshold bands, target), `RadialBarChart`, `HeatmapChart` (sequential or diverging) |

## Accessibility

Every chart renders in the same frame. The plot is one tab stop named by `ariaLabel`; the arrow keys walk the points (Up and Down move between rows on a heatmap), Home and End jump to the ends, Enter or Space calls `onActivate`, and Escape clears the active point. The active point is drawn on the chart and read out above it. Every value is mirrored in a data table, visually hidden by default; `showData='toggle'` adds a Show data button and `'visible'` always shows it.

## States and formatting

Charts show loading, empty, invalid and error states in place of the plot. Empty and invalid are detected from the data (no records, or values that are not numbers); pass `state='loading'` or `state='error'` while the host fetches. `labels` replaces any of the copy. Numbers go through `Intl.NumberFormat`: set `locale` and `formatValue` (Intl options or a function) to format axes, tooltips, the readout and the table together.

## Colours

Series use the categorical palette (`--ds-color-chart-1` … `-8`), and magnitude uses the sequential, diverging and heatmap ramps, with neutrals for tracks, baselines and "Other". Each has light and dark values, and the token tests check the contrast. `chartPalettes` in `@gaudi/design-system/tokens` lists them.

## Building your own

The Recharts parts (`ChartContainer`, `ChartTooltip`, `ChartLegend`) and Gaudi primitives (`ChartXAxis`, `ChartYAxis`, `ChartGrid`, `ChartReferenceLine`, `ChartAnnotations`, `ChartAreaGradient`, `createRowsTooltip`) style bespoke Recharts charts. `ChartFrame` and `ChartDataTable` give a custom visual the same keyboard model, states and table. The helpers `niceTicks`, `binValues`, `boxStats`, `groupSmallSlices` and `createChartFormatter` are exported too.

All chart types run on Recharts, which Gaudi already depends on; there is no extra chart dependency.

Provide visible labels for controls, preserve heading order, and connect controlled values to application state. The examples exercise keyboard and accessibility behavior; application networking and persistence remain consumer responsibilities.

See [reconciliation and compatibility details](../../../../PATTERN-COVERAGE.md) and [source notices](../../../../THIRD_PARTY_NOTICES.md).
