# Dashboard

> Blocks/Dashboard · blocks · `@gaudi/design-system/blocks/Dashboard`

Full dashboards composed from Stat Cards, Charts, DataTable and Core parts, on a grid that reflows by its own width, with a period toolbar for presets, a custom range and comparison.

## Import

```js
import Dashboard from '@gaudi/design-system/blocks/Dashboard';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `DEFAULT_DASHBOARD_LABELS`, `DEFAULT_DASHBOARD_PERIODS`, `DashboardGrid`, `DashboardPanel`, `DashboardToolbar`, `dashboardSpan`, `default`, `resolveDashboardPeriod`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `DashboardGrid.label` | `string` | — | no | Names the dashboard region. |
| `DashboardPanel.span / spanMd / rowSpan` | `number` | `12 / derived / —` | no | Columns of twelve on wide containers, of six on medium ones, and rows to span. |
| `DashboardPanel.title / description / action / toolbar / footer` | `ReactNode` | — | no | Panel heading, help, header action, controls row and footer. |
| `DashboardPanel.scroll` | `x \| y \| both` | — | no | A labelled, focusable scroll region for wide tables and long lists. |
| `scrollLabel` | `string` | — | no | A labelled, focusable scroll region for wide tables and long lists. |
| `maxHeight` | `CSS length` | — | no | A labelled, focusable scroll region for wide tables and long lists. |
| `dashboardSpan(span, spanMd, rowSpan)` | `function` | — | no | Grid placement classes for any child, such as a StatCard. |
| `DashboardToolbar.period / defaultPeriod / onPeriodChange` | `string / function` | `30d` | no | Active preset, or custom. |
| `DashboardToolbar.range / defaultRange / onRangeChange` | `{ from, to } / function` | — | no | Custom date range from the calendar. |
| `DashboardToolbar.compare / defaultCompare / onCompareChange` | `boolean / function` | `false` | no | Compare with the previous period. |
| `DashboardToolbar.onChange` | `(period) => void` | — | no | Resolved { period, from, to, days, previous, compare } on every change. |
| `DashboardToolbar.periods` | `Period[]` | `DEFAULT_DASHBOARD_PERIODS` | no | Presets, optional controls, the end date and copy. |
| `allowCustom` | `boolean` | `true` | no | Presets, optional controls, the end date and copy. |
| `showCompare` | `boolean` | `true` | no | Presets, optional controls, the end date and copy. |
| `today` | `Date` | `now` | no | Presets, optional controls, the end date and copy. |
| `labels` | `object` | `English` | no | Presets, optional controls, the end date and copy. |
| `resolveDashboardPeriod(period, options)` | `function` | — | no | The dates a period covers and the equally long period before it. |

## Usage

```jsx
import { DashboardGrid, DashboardPanel } from '@gaudi/design-system/blocks/Dashboard';

<DashboardGrid label='Overview'>
  <DashboardPanel title='Traffic' span={8}>{trafficChart}</DashboardPanel>
  <DashboardPanel title='Sources' span={4}>{sourceList}</DashboardPanel>
</DashboardGrid>
```

## Accessibility

The grid and each panel are named regions; panel titles are headings. Scrolling panel bodies take focus so the keyboard can scroll them. The toolbar presets are a single-choice group, the calendar opens in a popover, and the active range is announced politely.

## Examples

- Playground (Storybook `blocks-dashboard--playground`)
- Period toolbar with a custom range (Storybook `blocks-dashboard--period-toolbar`)

Curated patterns:

- AI agents · Conversation analytics — registry item `@gaudi/dashboard-agent-analytics` (uses `Badge`, `ChatAgentMark`, `ComposedChart`, `DashboardGrid`, `DashboardPanel`, `DashboardToolbar`, `DonutChart`, `ProgressRoot`, `StatDelta`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`)
- Commerce · Revenue — registry item `@gaudi/dashboard-commerce-revenue` (uses `AreaChart`, `Badge`, `BarChart`, `DashboardGrid`, `DashboardPanel`, `DashboardToolbar`, `DataTable`, `Dialog`, `ProgressRoot`, `Sparkline`, `StatCard`, `dashboardSpan`)
- Creators · Payouts — registry item `@gaudi/dashboard-creator-payouts` (uses `Badge`, `Button`, `ComposedChart`, `DashboardGrid`, `DashboardPanel`, `DataTable`, `Progress`, `ProgressRing`, `RegistryIcon`, `SwitchRoot`)
- Project · Delivery timesheet — registry item `@gaudi/dashboard-delivery-timesheet` (uses `Avatar`, `AvatarGroup`, `Badge`, `BreadcrumbTrail`, `Button`, `DashboardGrid`, `DashboardPanel`, `ProgressRing`, `RegistryIcon`, `StatCard`, `TableBodyPrimitive`, `TableCaption`, `TableCellPrimitive`, `TableFooter`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `dashboardSpan`)
- Security · Edge telemetry — registry item `@gaudi/dashboard-edge-security` (uses `Badge`, `BarChart`, `Button`, `DashboardGrid`, `DashboardPanel`, `Progress`, `RegistryIcon`, `SankeyChart`, `Sparkline`, `StatCard`, `ToggleGroupItem`, `ToggleGroupRoot`, `dashboardSpan`)
- Field teams · Coverage — registry item `@gaudi/dashboard-field-coverage` (uses `Avatar`, `Badge`, `Button`, `ComposedChart`, `DashboardGrid`, `DashboardPanel`, `DataTable`, `ProgressRoot`, `RegistryIcon`, `StatCard`, `StatMeter`, `dashboardSpan`)
- Content · Newsletter analytics — registry item `@gaudi/dashboard-newsletter-analytics` (uses `AreaChart`, `Badge`, `ChatActivity`, `DashboardGrid`, `DashboardPanel`, `DashboardToolbar`, `DataTable`, `FunnelChart`, `HeatmapChart`, `StatCard`, `dashboardSpan`)
- Operations · Capacity and exceptions — registry item `@gaudi/dashboard-operations-capacity` (uses `Badge`, `Button`, `DashboardGrid`, `DashboardPanel`, `DashboardToolbar`, `DataTable`, `FilterBar`, `GaugeChart`, `RegistryIcon`, `Sparkline`, `StackedBarList`, `StatCard`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `dashboardSpan`)

## Related

`core-datatable`

## README

Full dashboards for blogs and applications, composed from Stat Cards, Charts, DataTable, FilterBar, Tabs, Progress and the other Core parts. Dashboard adds only the two pieces those owners don't cover: a grid that reflows by its own width, and a period toolbar.

### Usage

```jsx
import { DashboardGrid, DashboardPanel, DashboardToolbar, dashboardSpan } from '@gaudi/design-system/blocks/Dashboard';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { AreaChart } from '@gaudi/design-system/charts';
import DataTable from '@gaudi/design-system/core/DataTable';

<DashboardToolbar defaultPeriod='30d' defaultCompare onChange={(period) => load(period)} />
<DashboardGrid label='Shop revenue'>
  <StatCard label='Revenue' value='$184,950' delta='+11.6%' deltaDirection='up' deltaTone='success' className={dashboardSpan(3)} />
  <DashboardPanel title='Revenue by product line' span={8}>
    <AreaChart framed={false} data={revenue} stacked series={series} />
  </DashboardPanel>
  <DashboardPanel title='Order queue' span={12}>
    <DataTable caption='Order queue' rows={orders} columns={columns} sortable searchable exportable />
  </DashboardPanel>
</DashboardGrid>
```

### API

| Prop / export | Contract |
| --- | --- |
| `DashboardGrid` | A container-query grid: one column when narrow, six from 42rem and twelve from 64rem of its own width, so it fits a page, a split view or a sidebar. `label` names the region. |
| `DashboardPanel` | A titled panel on the Core Card. `span` (of twelve), `spanMd` (of six) and `rowSpan` place it; `title`, `description`, `action`, `toolbar` and `footer` fill it. `scroll` (`x`, `y`, `both`) with `scrollLabel` and `maxHeight` makes the body a focusable scroll region. |
| `dashboardSpan(span, spanMd, rowSpan)` | Placement classes for any grid child, such as a StatCard. |
| `DashboardToolbar` | Period presets, a custom range from the Calendar, a compare switch and a slot for actions. `period`, `range` and `compare` are each controlled or uncontrolled; `onChange` receives `{ period, from, to, days, previous, compare }`. |
| `resolveDashboardPeriod(period, { today, range, periods })` | The dates a period covers and the equally long period before it. |
| `DEFAULT_DASHBOARD_PERIODS` / `DEFAULT_DASHBOARD_LABELS` | The 7d, 30d, 90d and 12m presets and the English copy. |

Charts inside a panel usually pass `framed={false}` so the panel supplies the border and title. Tables keep their own scroll region; give a panel `scroll` only for custom content such as a timesheet.

### Accessibility

The grid and panels are named regions, and panel titles are headings. A scrolling panel body is focusable so keyboard users can scroll it. The presets are a single-choice group, the custom range opens in a popover, and the toolbar announces the active range, with its comparison, politely when it changes.
