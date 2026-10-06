# ChartFrame

> Charts/ChartFrame · charts · `@gaudi/design-system/charts/ChartFrame`

The frame every chart renders in: a captioned figure with one keyboard stop and a readout, loading, empty, invalid and error states, locale-aware numbers and a data table built from points. Use it around a custom visual, with the Recharts composition parts and Gaudi primitives.

## Import

```js
import ChartFrame from '@gaudi/design-system/charts/ChartFrame';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `ChartActiveMarker`, `ChartAnnotations`, `ChartAreaGradient`, `ChartContainer`, `ChartDataTable`, `ChartFrame`, `ChartGrid`, `ChartLegend`, `ChartLegendContent`, `ChartReferenceLabel`, `ChartReferenceLine`, `ChartStatePanel`, `ChartStyle`, `ChartTooltip`, `ChartTooltipContent`, `ChartTooltipRows`, `ChartXAxis`, `ChartYAxis`, `DEFAULT_CHART_LABELS`, `binValues`, `boxStats`, `chartAxisTick`, `chartColors`, `chartScales`, `chartTones`, `createChartFormatter`, `createRowsTooltip`, `dataStatus`, `default`, `extent`, `getChartColor`, `groupSmallSlices`, `isChartNumber`, `niceTicks`, `scaleLinear`, `useChartFrame`, `useRechartsActive`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `points` | `Array<{ label, values: Array<{ name, value, display?, color? }> }>` | `[]` | no | What the keyboard walks and the table lists. |
| `status` | `ready \| loading \| empty \| invalid \| error` | `ready` | no | The frame state; charts derive it from their data. |
| `columns` | `number` | — | no | Row length for Up and Down on grid-shaped visuals. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `useChartFrame()` | `hook` | — | no | activeIndex, setActive and format for drawn elements; mark them with data-chart-index. |
| `ChartContainer / ChartGrid / ChartXAxis / ChartYAxis / ChartReferenceLine / ChartAnnotations / createRowsTooltip` | `parts` | — | no | Style bespoke Recharts charts with chart tokens. |
| `title / description` | `ReactNode` | — | no | Figure caption above the plot. |
| `ariaLabel` | `string` | `title or Chart` | no | Accessible name of the plot, the single keyboard stop. |
| `height` | `number` | `type-specific` | no | Plot height in pixels. |
| `state` | `loading \| error \| empty \| invalid` | `from data` | no | Force a state; empty and invalid are otherwise detected from the data. |
| `labels` | `Partial<DEFAULT_CHART_LABELS>` | `English copy` | no | Copy for states, the keyboard hint, the data table and its toggle. |
| `locale / formatValue` | `string / Intl.NumberFormatOptions \| (value) => string` | `runtime / number` | no | Number format for axes, tooltips, the readout and the table. |
| `showData` | `hidden \| toggle \| visible` | `hidden` | no | Data table visibility; hidden keeps it available to assistive technology. |
| `onActivate / onActiveChange` | `(point, index) => void / (index \| null) => void` | — | no | Click, Enter or Space on a point; the active point changed. |
| `toolbar / framed` | `ReactNode / boolean` | `— / true` | no | Controls beside the caption; the figure border and padding. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `status`: `ready`, `loading`, `empty`, `invalid`, `error`
- `state`: `loading`, `error`, `empty`, `invalid`
- `showData`: `hidden`, `toggle`, `visible`

## Usage

```jsx
import { ChartFrame, useChartFrame } from '@gaudi/design-system/charts';

<ChartFrame title='Writing goals' ariaLabel='Progress towards writing goals' points={points} showData='toggle'>
  <GoalBars />
</ChartFrame>
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-chartframe--playground`)
- Recharts with Gaudi primitives (Storybook `charts-chartframe--primitives`)
- Controls in the caption (Storybook `charts-chartframe--toolbar`)
- Data table on its own (Storybook `charts-chartframe--data-table`)

Curated patterns:

- Loading, empty, invalid, error and locale — registry item `@gaudi/chart-frame-states-locale` (uses `BarChart`, `ToggleGroupItem`, `ToggleGroupRoot`)

## README

The frame every chart renders in: a captioned figure with one keyboard stop and a readout, loading, empty, invalid and error states, locale-aware numbers and a data table built from points. Use it around a custom visual, with the Recharts composition parts and Gaudi primitives.

[Open the docs](http://localhost:6007/?path=/docs/charts-chartframe--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { ChartFrame, useChartFrame } from '@gaudi/design-system/charts';

<ChartFrame title='Writing goals' ariaLabel='Progress towards writing goals' points={points} showData='toggle'>
  <GoalBars />
</ChartFrame>
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/ChartFrame`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `points` | Array<{ label, values: Array<{ name, value, display?, color? }> }> | [] | What the keyboard walks and the table lists. |
| `status` | ready \| loading \| empty \| invalid \| error | ready | The frame state; charts derive it from their data. |
| `columns` | number | — | Row length for Up and Down on grid-shaped visuals. |
| `children` | ReactNode | — | Content composed from the exported parts. |
| `useChartFrame()` | hook | — | activeIndex, setActive and format for drawn elements; mark them with data-chart-index. |
| `ChartContainer / ChartGrid / ChartXAxis / ChartYAxis / ChartReferenceLine / ChartAnnotations / createRowsTooltip` | parts | — | Style bespoke Recharts charts with chart tokens. |
| `title / description` | ReactNode | — | Figure caption above the plot. |
| `ariaLabel` | string | title or Chart | Accessible name of the plot, the single keyboard stop. |
| `height` | number | type-specific | Plot height in pixels. |
| `state` | loading \| error \| empty \| invalid | from data | Force a state; empty and invalid are otherwise detected from the data. |
| `labels` | Partial<DEFAULT_CHART_LABELS> | English copy | Copy for states, the keyboard hint, the data table and its toggle. |
| `locale / formatValue` | string / Intl.NumberFormatOptions \| (value) => string | runtime / number | Number format for axes, tooltips, the readout and the table. |
| `showData` | hidden \| toggle \| visible | hidden | Data table visibility; hidden keeps it available to assistive technology. |
| `onActivate / onActiveChange` | (point, index) => void / (index \| null) => void | — | Click, Enter or Space on a point; the active point changed. |
| `toolbar / framed` | ReactNode / boolean | — / true | Controls beside the caption; the figure border and padding. |
| `className` | string | — | Additional classes on the outer element. |

### Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

Colours come from the chart palette tokens (`--ds-color-chart-1` … `-8`, the sequential, diverging and heatmap ramps and the chart neutrals), with light and dark values checked by the token tests.

See [source notices](../../../../README.md#third-party-notices).
