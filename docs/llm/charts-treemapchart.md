# TreemapChart

> Charts/TreemapChart · charts · `@gaudi/design-system/charts/TreemapChart`

Nested rectangles sized by value, tinted by group or shaded on the heat ramp.

## Import

```js
import TreemapChart from '@gaudi/design-system/charts/TreemapChart';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `TreemapChart`, `default`, `treemapLeaves`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `Array<{ name, value } \| { name, children }>` | `[]` | no | One or two levels. |
| `nameKey / valueKey` | `string` | `name / value` | no | Field names. |
| `colorBy` | `group \| value` | `group` | no | Tint by top-level group or shade by value. |
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

- `colorBy`: `group`, `value`
- `state`: `loading`, `error`, `empty`, `invalid`
- `showData`: `hidden`, `toggle`, `visible`

## Usage

```jsx
import { TreemapChart } from '@gaudi/design-system/charts';

<TreemapChart ariaLabel='Hours read by section' data={[{ name: 'Essays', children: [{ name: 'Engineering', value: 1240 }] }]} />
```

## Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

## Examples

- Playground (Storybook `charts-treemapchart--playground`)
- One level shaded by value (Storybook `charts-treemapchart--flat`)
- Spend by team (Storybook `charts-treemapchart--spend`)

Curated patterns:

- Context map — registry item `@gaudi/treemap-chart-context-map` (uses `Button`, `Select`, `ToggleGroupItem`, `ToggleGroupRoot`, `TreemapChart`)
- Storage by folder — registry item `@gaudi/treemap-chart-storage-folders` (uses `ToggleGroupItem`, `ToggleGroupRoot`, `TreemapChart`)

## Related

`core-field`

## README

Nested rectangles sized by value, tinted by group or shaded on the heat ramp.

[Open the docs](http://localhost:6007/?path=/docs/charts-treemapchart--docs) for the Playground and detailed examples, each with its complete JSX.

### Usage

```jsx
import { TreemapChart } from '@gaudi/design-system/charts';

<TreemapChart ariaLabel='Hours read by section' data={[{ name: 'Essays', children: [{ name: 'Engineering', value: 1240 }] }]} />
```

Import from `@gaudi/design-system/charts` or `@gaudi/design-system/charts/TreemapChart`. Charts are not exported from the root entry, so pages without a chart never load Recharts. In an article, render the same chart through MDX/Chart.

### API

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

### Accessibility

The plot is one tab stop named by ariaLabel. The arrow keys walk the points, Home and End jump to the ends, Enter or Space activates and Escape clears; the active point is drawn and read out politely. Every value is mirrored in a data table, and the SVG is hidden from assistive technology.

Tile labels use measured ellipsis when space is limited; full names and values stay in the readout and data table. SVG tile labels keep left-to-right direction so their text anchors remain inside the tile in RTL interfaces. Captions, controls, details and the data table follow the surrounding direction.

Colours come from the chart palette tokens (`--ds-color-chart-1` … `-8`, the sequential, diverging and heatmap ramps and the chart neutrals), with light and dark values checked by the token tests.

See [source notices](../../../../README.md#third-party-notices).

### Context map example

**Context map** composes TreemapChart with Select, ToggleGroup and Button to inspect an agent’s context window. Prepared parts include instructions, tools, project memory, files, conversation, tool results and available capacity. Tile areas represent shares of the complete window, including unused space. Colours identify categories; labels, keyboard readouts and the data table expose exact values.

Choose an agent to restore its initial snapshot. Add tool result adds one prepared search result. Compact demo replaces conversation and tool results with a prepared summary, retaining files and instructions. Before and After compare the snapshots and report the freed capacity. Compaction is immediate; no background process or model request is implied. Clear context shows zero used tokens and a full available-capacity tile, returning focus to Reset demo; Reset demo restores the current agent’s initial state.

Click a tile or activate it with Enter/Space to inspect its full name, token count and contents. Arrow keys traverse tiles, Escape closes details while the plot has focus, and Close details returns focus to the plot. Changing snapshots clears stale details. The full names and counts also remain available through Show data, including when a narrow tile cannot display its label. Controls wrap at narrow widths; the chart stays within its container and uses the shared light/dark chart tokens and spacing presets.

This is a copyable example, not a public context-management engine. Applications own tokenization, capacity, categories, compaction policy, retained/omitted content, live updates and persistence. All names, counts and summaries are illustrative fixture data.
