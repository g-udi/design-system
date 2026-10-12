# DonutChart

> Charts/DonutChart · charts · `@gaudi/design-system/charts/DonutChart`

Parts of a whole as a donut with a centre summary, or a pie (PieChart); slices are selectable and small ones fold into Other.

## Import

```js
import DonutChart from '@gaudi/design-system/charts/DonutChart';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `DonutChart`, `PieChart`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `object[]` | `[]` | no | Slices. |
| `nameKey` | `string` | `label` | no | Slices. |
| `valueKey` | `string` | `value` | no | Slices. |
| `selectable` | `boolean` | — | no | Selection pins a slice; the centre shows its share. |
| `selectedIndex` | `number \| null` | — | no | Selection pins a slice; the centre shows its share. |
| `defaultSelectedIndex` | `number \| null` | — | no | Selection pins a slice; the centre shows its share. |
| `onSelect` | `(slice, index) => void` | — | no | Selection pins a slice; the centre shows its share. |
| `otherThreshold` | `number` | — | no | Fold small slices into Other. |
| `maxSlices` | `number` | — | no | Fold small slices into Other. |
| `otherLabel` | `string` | `Other` | no | Fold small slices into Other. |
| `centerLabel` | `string` | `Total` | no | Caption under the centre value. |
| `innerRadius` | `string \| number` | `'56%' (DonutChart), 0 (PieChart)` | no | Hole size. |
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

- `state`: `loading`, `error`, `empty`, `invalid`
- `showData`: `hidden`, `toggle`, `visible`

## Usage

```jsx
import { DonutChart } from '@gaudi/design-system/charts';

<DonutChart title='Where readers came from' ariaLabel='Sessions by source' data={sources} otherThreshold={0.03} onSelect={(slice) => setSource(slice?.label)} />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-donutchart--playground`)
- Pie for a few parts (Storybook `charts-donutchart--pie`)
- Controlled selection with a detail panel (Storybook `charts-donutchart--controlled`)

Curated patterns:

- Patterned slices — registry item `@gaudi/donut-chart-patterned-slices` (uses `CardContent`, `CardDescription`, `CardHeader`, `CardRoot`, `CardTitle`, `ChartContainer`, `ChartLegend`, `ChartLegendContent`, `ChartTooltip`, `ChartTooltipContent`, `Label`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Select a topic, small slices as Other — registry item `@gaudi/donut-chart-topic-select` (uses `DonutChart`)

## README

Parts of a whole as a donut with a centre summary, or a pie (PieChart); slices are selectable and small ones fold into Other.

[Open the docs](http://localhost:6007/?path=/docs/charts-donutchart--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { DonutChart } from '@gaudi/design-system/charts';

<DonutChart title='Where readers came from' ariaLabel='Sessions by source' data={sources} otherThreshold={0.03} onSelect={(slice) => setSource(slice?.label)} />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/DonutChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `data / nameKey / valueKey` | object[] / string / string | [] / label / value | Slices. |
| `selectable / selectedIndex / defaultSelectedIndex / onSelect` | boolean / number \| null / number \| null / (slice, index) => void | true for donuts | Selection pins a slice; the centre shows its share. |
| `otherThreshold / maxSlices / otherLabel` | number / number / string | — / — / Other | Fold small slices into Other. |
| `centerLabel` | string | Total | Caption under the centre value. |
| `innerRadius` | string \| number | '56%' (DonutChart), 0 (PieChart) | Hole size. |
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
