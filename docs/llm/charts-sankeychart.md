# SankeyChart

> Charts/SankeyChart · charts · `@gaudi/design-system/charts/SankeyChart`

Flows between stages with widths proportional to volume; each flow is a keyboard point and a table row.

## Import

```js
import SankeyChart from '@gaudi/design-system/charts/SankeyChart';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `SankeyChart`, `default`, `sankeyGraph`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `links` | `Array<{ source, target, value }>` | `[]` | no | Flows by stage name or index. |
| `nodes` | `Array<string \| { name, color? }>` | `from links` | no | Stage order and colours. |
| `nodeWidth` | `number` | `10` | no | Stage bar width. |
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
import { SankeyChart } from '@gaudi/design-system/charts';

<SankeyChart ariaLabel='Support tickets from channel to outcome' links={[{ source: 'Email', target: 'Billing', value: 420 }, { source: 'Billing', target: 'Solved', value: 390 }]} />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-sankeychart--playground`)
- Budget from income to spend (Storybook `charts-sankeychart--budget`)
- Drop-off between steps (Storybook `charts-sankeychart--onboarding`)

Curated patterns:

- Where readers go — registry item `@gaudi/sankey-chart-reader-paths` (uses `SankeyChart`)

## README

Flows between stages with widths proportional to volume; each flow is a keyboard point and a table row.

[Open the docs](http://localhost:6007/?path=/docs/charts-sankeychart--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { SankeyChart } from '@gaudi/design-system/charts';

<SankeyChart ariaLabel='Support tickets from channel to outcome' links={[{ source: 'Email', target: 'Billing', value: 420 }, { source: 'Billing', target: 'Solved', value: 390 }]} />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/SankeyChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `links` | Array<{ source, target, value }> | [] | Flows by stage name or index. |
| `nodes` | Array<string \| { name, color? }> | from links | Stage order and colours. |
| `nodeWidth` | number | 10 | Stage bar width. |
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
