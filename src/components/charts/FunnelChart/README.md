# FunnelChart

Steps in order with the conversion from each step to the next, as left-aligned bars or a centred funnel.

[Open the docs](http://localhost:6007/?path=/docs/charts-funnelchart--docs) for the Playground and detailed examples, each with its complete JSX.

## Usage

```jsx
import { FunnelChart } from '@gaudi/design-system/charts';

<FunnelChart ariaLabel='Trial to paid funnel' data={steps} align='center' />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/FunnelChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

## API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `data / labelKey / valueKey` | object[] / string / string | [] / label / value | Steps in order. |
| `align` | start \| center | start | Left-aligned bars or a centred funnel. |
| `monochrome` | boolean | true | One hue fading by step. |
| `conversionLabel` | string | from previous | Suffix on each conversion rate. |
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
