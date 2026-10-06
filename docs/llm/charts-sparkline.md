# Sparkline

> Charts/Sparkline · charts · `@gaudi/design-system/charts/Sparkline`

A word-sized trend without axes, for stat cards, tables and prose; still a named chart with its data table.

## Import

```js
import Sparkline from '@gaudi/design-system/charts/Sparkline';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `Sparkline`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `number[] \| object[]` | `[]` | no | Numbers, or records read through xKey / yKey. |
| `variant` | `line \| area \| bar` | `line` | no | How the trend draws. |
| `reference` | `number` | — | no | A dashed guide such as a target. |
| `showEndpoint` | `boolean` | `true` | no | Dot on the latest value. |
| `color` | `string` | `chart-1` | no | Trend colour. |
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

- `variant`: `line`, `area`, `bar`
- `state`: `loading`, `error`, `empty`, `invalid`
- `showData`: `hidden`, `toggle`, `visible`

## Usage

```jsx
import { Sparkline } from '@gaudi/design-system/charts';

<Sparkline ariaLabel='Readers, last 14 days' data={readers} variant='area' height={48} />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-sparkline--playground`)
- Trends in a table (Storybook `charts-sparkline--in-table`)
- Inline in prose (Storybook `charts-sparkline--inline`)

Curated patterns:

- Stat cards with trends — registry item `@gaudi/sparkline-stat-trends` (uses `Sparkline`, `StatCard`)

## README

A word-sized trend without axes, for stat cards, tables and prose; still a named chart with its data table.

[Open the docs](http://localhost:6007/?path=/docs/charts-sparkline--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { Sparkline } from '@gaudi/design-system/charts';

<Sparkline ariaLabel='Readers, last 14 days' data={readers} variant='area' height={48} />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/Sparkline`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `data` | number[] \| object[] | [] | Numbers, or records read through xKey / yKey. |
| `variant` | line \| area \| bar | line | How the trend draws. |
| `reference` | number | — | A dashed guide such as a target. |
| `showEndpoint` | boolean | true | Dot on the latest value. |
| `color` | string | chart-1 | Trend colour. |
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
