# StackedBarList

> Charts/StackedBarList · charts · `@gaudi/design-system/charts/StackedBarList`

Ranked rows of stacked segments that grow with the list: issues by status per team, readers by source per post.

## Import

```js
import StackedBarList from '@gaudi/design-system/charts/StackedBarList';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `StackedBarList`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data / labelKey` | `object[] / string` | `[] / label` | no | Rows. |
| `series` | `Array<{ key, label? }>` | `valueKey` | no | Segments in order. |
| `normalize` | `boolean` | `false` | no | Each row as 100% to compare mixes. |
| `sort` | `boolean` | `true` | no | Largest row first. |
| `showLegend` | `boolean` | `true` | no | Segment legend. |
| `colors` | `string[]` | `categorical palette` | no | Override the series colours with chart tokens. |
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
import { StackedBarList } from '@gaudi/design-system/charts';

<StackedBarList ariaLabel='Issues per team by status' data={teams} series={[{ key: 'open', label: 'Open' }, { key: 'done', label: 'Done' }]} />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-stackedbarlist--playground`)
- Ranked list with one value (Storybook `charts-stackedbarlist--single-value`)
- Compare mixes as 100% (Storybook `charts-stackedbarlist--normalised`)

Curated patterns:

- Top posts by source — registry item `@gaudi/stacked-bar-list-top-posts` (uses `Label`, `StackedBarList`, `SwitchRoot`)

## README

Ranked rows of stacked segments that grow with the list: issues by status per team, readers by source per post.

[Open the docs](http://localhost:6007/?path=/docs/charts-stackedbarlist--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { StackedBarList } from '@gaudi/design-system/charts';

<StackedBarList ariaLabel='Issues per team by status' data={teams} series={[{ key: 'open', label: 'Open' }, { key: 'done', label: 'Done' }]} />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/StackedBarList`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `data / labelKey` | object[] / string | [] / label | Rows. |
| `series` | Array<{ key, label? }> | valueKey | Segments in order. |
| `normalize` | boolean | false | Each row as 100% to compare mixes. |
| `sort` | boolean | true | Largest row first. |
| `showLegend` | boolean | true | Segment legend. |
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
