# HistogramChart

> Charts/HistogramChart · charts · `@gaudi/design-system/charts/HistogramChart`

Observations in round bins with labelled markers such as the median, a percentile or a budget.

## Import

```js
import HistogramChart from '@gaudi/design-system/charts/HistogramChart';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `HistogramChart`, `default`, `histogramBins`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `values` | `number[]` | `[]` | no | Observations (or data). |
| `bins` | `number` | `auto` | no | Approximate bin count; edges snap to round numbers. |
| `domain` | `[number, number]` | `data extent` | no | Fix the axis so histograms compare. |
| `markers` | `Array<{ value, label, tone? }>` | `[]` | no | Vertical guides. |
| `unit / countLabel` | `string` | `— / Count` | no | Bin suffix and the count column name. |
| `color` | `string` | `chart-1` | no | Bar colour. |
| `title / description` | `ReactNode` | — | no | Figure caption above the plot. |
| `ariaLabel` | `string` | `title or Chart` | no | Accessible name of the plot, the single keyboard stop. |
| `height` | `number` | `type-specific` | no | Plot height in pixels. |
| `state` | `loading \| error \| empty \| invalid` | `from data` | no | Force a state; empty and invalid are otherwise detected from the data. |
| `labels` | `Partial<DEFAULT_CHART_LABELS>` | `English copy` | no | Copy for states, the keyboard hint, the data table and its toggle. |
| `locale` | `string` | `runtime` | no | Number format for axes, tooltips, the readout and the table. |
| `formatValue` | `Intl.NumberFormatOptions \| (value) => string` | `number` | no | Number format for axes, tooltips, the readout and the table. |
| `showData` | `hidden \| toggle \| visible` | `hidden` | no | Data table visibility; hidden keeps it available to assistive technology. |
| `onActivate` | `(point, index) => void` | — | no | Click, Enter or Space on a point; the active point changed. |
| `onActiveChange` | `(index \| null) => void` | — | no | Click, Enter or Space on a point; the active point changed. |
| `toolbar` | `ReactNode` | — | no | Controls beside the caption; the figure border and padding. |
| `framed` | `boolean` | `true` | no | Controls beside the caption; the figure border and padding. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `state`: `loading`, `error`, `empty`, `invalid`
- `showData`: `hidden`, `toggle`, `visible`

## Usage

```jsx
import { HistogramChart } from '@gaudi/design-system/charts';

<HistogramChart ariaLabel='Distribution of page weight' values={weights} markers={[{ value: 520, label: 'Median' }]} unit=' KB' />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-histogramchart--playground`)
- Two kinds of visit (Storybook `charts-histogramchart--bimodal`)
- Fixed domain and count label (Storybook `charts-histogramchart--fixed-domain`)

Curated patterns:

- Reading time with median and p90 — registry item `@gaudi/histogram-chart-reading-time` (uses `HistogramChart`, `ToggleGroupItem`, `ToggleGroupRoot`)

## README

Observations in round bins with labelled markers such as the median, a percentile or a budget.

[Open the docs](http://localhost:6007/?path=/docs/charts-histogramchart--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { HistogramChart } from '@gaudi/design-system/charts';

<HistogramChart ariaLabel='Distribution of page weight' values={weights} markers={[{ value: 520, label: 'Median' }]} unit=' KB' />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/HistogramChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `values` | number[] | [] | Observations (or data). |
| `bins` | number | auto | Approximate bin count; edges snap to round numbers. |
| `domain` | [number, number] | data extent | Fix the axis so histograms compare. |
| `markers` | Array<{ value, label, tone? }> | [] | Vertical guides. |
| `unit / countLabel` | string | — / Count | Bin suffix and the count column name. |
| `color` | string | chart-1 | Bar colour. |
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
