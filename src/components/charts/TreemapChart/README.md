# TreemapChart

Nested rectangles sized by value, tinted by group or shaded on the heat ramp.

[Open the docs](http://localhost:6007/?path=/docs/charts-treemapchart--docs) for the Playground and detailed examples, each with its complete JSX.

## Usage

```jsx
import { TreemapChart } from '@gaudi/design-system/charts';

<TreemapChart ariaLabel='Hours read by section' data={[{ name: 'Essays', children: [{ name: 'Engineering', value: 1240 }] }]} />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/TreemapChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

## API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `data` | Array<{ name, value } \| { name, children }> | [] | One or two levels. |
| `nameKey / valueKey` | string | name / value | Field names. |
| `colorBy` | group \| value | group | Tint by top-level group or shade by value. |
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

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

Colours come from the chart palette tokens (`--ds-color-chart-1` … `-8`, the sequential, diverging and heatmap ramps and the chart neutrals), with light and dark values checked by the token tests.

See [source notices](../../../../THIRD_PARTY_NOTICES.md).
