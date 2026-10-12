# BarChart

> Charts/BarChart · charts · `@gaudi/design-system/charts/BarChart`

Bars per category: single, grouped or stacked, upright or on their side, with references, annotations and a highlighted bar.

## Import

```js
import BarChart from '@gaudi/design-system/charts/BarChart';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `BarChart`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `xKey / yKey` | `string` | `label / value` | no | Category field and the single value field when series is omitted. |
| `series` | `Array<{ key, label?, dashed? }>` | `from yKey` | no | Value fields drawn as series, in order; a dashed series reads as a projection or target. |
| `stacked` | `boolean` | `false` | no | Stack the series into one bar. |
| `layout` | `vertical \| horizontal` | `vertical` | no | Horizontal lays bars along the value axis for long labels. |
| `highlight` | `string` | — | no | Category to emphasise; the others dim. |
| `barRadius` | `number` | `4` | no | Corner radius at the bar end. |
| `references / annotations` | `Array<{ x?, y?, label, tone? }>` | — | no | Labelled guide lines and point notes. |
| `showGrid / showLegend / showTooltip` | `boolean` | `true / false / true` | no | Presentation. |
| `colors` | `string[]` | `categorical palette` | no | Override the series colours with chart tokens. |
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

- `layout`: `vertical`, `horizontal`
- `state`: `loading`, `error`, `empty`, `invalid`
- `showData`: `hidden`, `toggle`, `visible`

## Usage

```jsx
import { BarChart } from '@gaudi/design-system/charts';

<BarChart title='Readers by channel' ariaLabel='Monthly readers by channel' data={readers} series={[{ key: 'search', label: 'Search' }, { key: 'newsletter', label: 'Newsletter' }]} showLegend />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-barchart--playground`)
- Horizontal bars for long labels (Storybook `charts-barchart--horizontal`)
- Stacked with a target (Storybook `charts-barchart--stacked`)
- Highlight and activate a bar (Storybook `charts-barchart--highlighted`)

Curated patterns:

- Fills, comparison and layout — registry item `@gaudi/bar-chart-fills-layout` (uses `CardContent`, `CardDescription`, `CardHeader`, `CardRoot`, `CardTitle`, `ChartContainer`, `ChartLegend`, `ChartLegendContent`, `ChartTooltip`, `ChartTooltipContent`, `Label`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Hover to reveal values — registry item `@gaudi/bar-chart-hover-values` (uses `Badge`, `CardContent`, `CardDescription`, `CardHeader`, `CardRoot`, `CardTitle`, `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `RegistryIcon`, `cn`)

## README

Bars per category: single, grouped or stacked, upright or on their side, with references, annotations and a highlighted bar.

[Open the docs](http://localhost:6007/?path=/docs/charts-barchart--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { BarChart } from '@gaudi/design-system/charts';

<BarChart title='Readers by channel' ariaLabel='Monthly readers by channel' data={readers} series={[{ key: 'search', label: 'Search' }, { key: 'newsletter', label: 'Newsletter' }]} showLegend />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/BarChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `xKey / yKey` | string | label / value | Category field and the single value field when series is omitted. |
| `series` | Array<{ key, label?, dashed? }> | from yKey | Value fields drawn as series, in order; a dashed series reads as a projection or target. |
| `stacked` | boolean | false | Stack the series into one bar. |
| `layout` | vertical \| horizontal | vertical | Horizontal lays bars along the value axis for long labels. |
| `highlight` | string | — | Category to emphasise; the others dim. |
| `barRadius` | number | 4 | Corner radius at the bar end. |
| `references / annotations` | Array<{ x?, y?, label, tone? }> | — | Labelled guide lines and point notes. |
| `showGrid / showLegend / showTooltip` | boolean | true / false / true | Presentation. |
| `colors` | string[] | categorical palette | Override the series colours with chart tokens. |
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
