# GaugeChart

> Charts/GaugeChart · charts · `@gaudi/design-system/charts/GaugeChart`

One reading against threshold bands with a target tick, on any scale.

## Import

```js
import GaugeChart from '@gaudi/design-system/charts/GaugeChart';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `GaugeChart`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number` | `required` | no | The reading. |
| `min / max` | `number` | `0 / 100` | no | Scale. |
| `target` | `number` | — | no | Goal marked on the track. |
| `bands` | `Array<{ to, tone }>` | `[]` | no | Ascending threshold bands. |
| `label / unit` | `string` | — | no | Caption under the value and its suffix. |
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
import { GaugeChart } from '@gaudi/design-system/charts';

<GaugeChart ariaLabel='Mobile performance score' value={84} target={90} bands={[{ to: 50, tone: 'danger' }, { to: 90, tone: 'warning' }, { to: 100, tone: 'success' }]} />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-gaugechart--playground`)
- Spend against a monthly budget (Storybook `charts-gaugechart--budget`)
- A row of readings (Storybook `charts-gaugechart--row`)

Curated patterns:

- Core Web Vitals — registry item `@gaudi/gauge-chart-web-vitals` (uses `GaugeChart`)

## README

One reading against threshold bands with a target tick, on any scale.

[Open the docs](http://localhost:6007/?path=/docs/charts-gaugechart--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { GaugeChart } from '@gaudi/design-system/charts';

<GaugeChart ariaLabel='Mobile performance score' value={84} target={90} bands={[{ to: 50, tone: 'danger' }, { to: 90, tone: 'warning' }, { to: 100, tone: 'success' }]} />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/GaugeChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `value` | number | required | The reading. |
| `min / max` | number | 0 / 100 | Scale. |
| `target` | number | — | Goal marked on the track. |
| `bands` | Array<{ to, tone }> | [] | Ascending threshold bands. |
| `label / unit` | string | — | Caption under the value and its suffix. |
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
