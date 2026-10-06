# ScatterChart

> Charts/ScatterChart · charts · `@gaudi/design-system/charts/ScatterChart`

Correlation between two numbers, with labelled points, reference lines and bubbles sized by a third value (BubbleChart).

## Import

```js
import ScatterChart from '@gaudi/design-system/charts/ScatterChart';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `BubbleChart`, `ScatterChart`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `xKey / yKey / zKey` | `string` | `x / y / —` | no | Numeric fields; zKey sizes bubbles. |
| `xLabel / yLabel / zLabel` | `string` | `field names` | no | Names in the readout, tooltip and table. |
| `zRange` | `[number, number]` | `[60, 900]` | no | Bubble area range. |
| `references` | `Array<{ x?, y?, label }>` | — | no | Guide lines on either axis. |
| `color` | `string` | `chart-1` | no | Point colour; a point may carry its own color. |
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

- `state`: `loading`, `error`, `empty`, `invalid`
- `showData`: `hidden`, `toggle`, `visible`

## Usage

```jsx
import { BubbleChart, ScatterChart } from '@gaudi/design-system/charts';

<ScatterChart ariaLabel='Essay length against minutes read' data={essays} xKey='words' yKey='minutes' xLabel='Words' yLabel='Minutes' />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-scatterchart--playground`)
- Quadrants with reference lines (Storybook `charts-scatterchart--with-references`)
- Bubbles sized by traffic (Storybook `charts-scatterchart--bubbles`)

Curated patterns:

- Length, read time and shares — registry item `@gaudi/scatter-chart-length-vs-shares` (uses `BubbleChart`)

## README

Correlation between two numbers, with labelled points, reference lines and bubbles sized by a third value (BubbleChart).

[Open the docs](http://localhost:6007/?path=/docs/charts-scatterchart--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { BubbleChart, ScatterChart } from '@gaudi/design-system/charts';

<ScatterChart ariaLabel='Essay length against minutes read' data={essays} xKey='words' yKey='minutes' xLabel='Words' yLabel='Minutes' />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/ScatterChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `xKey / yKey / zKey` | string | x / y / — | Numeric fields; zKey sizes bubbles. |
| `xLabel / yLabel / zLabel` | string | field names | Names in the readout, tooltip and table. |
| `zRange` | [number, number] | [60, 900] | Bubble area range. |
| `references` | Array<{ x?, y?, label }> | — | Guide lines on either axis. |
| `color` | string | chart-1 | Point colour; a point may carry its own color. |
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
