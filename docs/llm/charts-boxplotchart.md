# BoxPlotChart

> Charts/BoxPlotChart · charts · `@gaudi/design-system/charts/BoxPlotChart`

Distributions side by side: median, quartiles, whiskers at 1.5 × IQR and outliers, from raw samples or precomputed summaries.

## Import

```js
import BoxPlotChart from '@gaudi/design-system/charts/BoxPlotChart';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `BoxPlotChart`, `boxGroups`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `Array<{ label, values } \| { label, min, q1, median, q3, max, outliers? }>` | `[]` | no | Groups. |
| `labelKey / valuesKey` | `string` | `label / values` | no | Field names. |
| `unit` | `string` | — | no | Suffix on axis ticks. |
| `color` | `string` | `chart-1` | no | Box colour. |
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
import { BoxPlotChart } from '@gaudi/design-system/charts';

<BoxPlotChart ariaLabel='Load time by template' data={[{ label: 'Home', values: [410, 460, 480, 520, 1420] }]} unit='ms' />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-boxplotchart--playground`)
- Precomputed summaries (Storybook `charts-boxplotchart--precomputed`)
- Regions with a custom colour (Storybook `charts-boxplotchart--regions`)

Curated patterns:

- Response time by route — registry item `@gaudi/box-plot-chart-response-times` (uses `BoxPlotChart`, `ToggleGroupItem`, `ToggleGroupRoot`)

## Related

`core-field`

## README

Distributions side by side: median, quartiles, whiskers at 1.5 × IQR and outliers, from raw samples or precomputed summaries.

[Open the docs](http://localhost:6007/?path=/docs/charts-boxplotchart--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { BoxPlotChart } from '@gaudi/design-system/charts';

<BoxPlotChart ariaLabel='Load time by template' data={[{ label: 'Home', values: [410, 460, 480, 520, 1420] }]} unit='ms' />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/BoxPlotChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `data` | Array<{ label, values } \| { label, min, q1, median, q3, max, outliers? }> | [] | Groups. |
| `labelKey / valuesKey` | string | label / values | Field names. |
| `unit` | string | — | Suffix on axis ticks. |
| `color` | string | chart-1 | Box colour. |
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
