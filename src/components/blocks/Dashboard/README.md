# Dashboard

Full dashboards for blogs and applications, composed from Stat Cards, Charts, DataTable, FilterBar, Tabs, Progress and the other Core parts. Dashboard adds only the two pieces those owners don't cover: a grid that reflows by its own width, and a period toolbar.

## Usage

```jsx
import { DashboardGrid, DashboardPanel, DashboardToolbar, dashboardSpan } from '@gaudi/design-system/blocks/Dashboard';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { AreaChart } from '@gaudi/design-system/charts';
import DataTable from '@gaudi/design-system/core/DataTable';

<DashboardToolbar defaultPeriod='30d' defaultCompare onChange={(period) => load(period)} />
<DashboardGrid label='Shop revenue'>
  <StatCard label='Revenue' value='$184,950' delta='+11.6%' className={dashboardSpan(3)} />
  <DashboardPanel title='Revenue by product line' span={8}>
    <AreaChart framed={false} data={revenue} stacked series={series} />
  </DashboardPanel>
  <DashboardPanel title='Order queue' span={12}>
    <DataTable caption='Order queue' rows={orders} columns={columns} sortable searchable exportable />
  </DashboardPanel>
</DashboardGrid>
```

## API

| Prop / export | Contract |
| --- | --- |
| `DashboardGrid` | A container-query grid: one column when narrow, six from 42rem and twelve from 64rem of its own width, so it fits a page, a split view or a sidebar. `label` names the region. |
| `DashboardPanel` | A titled panel on the Core Card. `span` (of twelve), `spanMd` (of six) and `rowSpan` place it; `title`, `description`, `action`, `toolbar` and `footer` fill it. `scroll` (`x`, `y`, `both`) with `scrollLabel` and `maxHeight` makes the body a focusable scroll region. |
| `dashboardSpan(span, spanMd, rowSpan)` | Placement classes for any grid child, such as a StatCard. |
| `DashboardToolbar` | Period presets, a custom range from the Calendar, a compare switch and a slot for actions. `period`, `range` and `compare` are each controlled or uncontrolled; `onChange` receives `{ period, from, to, days, previous, compare }`. |
| `resolveDashboardPeriod(period, { today, range, periods })` | The dates a period covers and the equally long period before it. |
| `DEFAULT_DASHBOARD_PERIODS` / `DEFAULT_DASHBOARD_LABELS` | The 7d, 30d, 90d and 12m presets and the English copy. |

Charts inside a panel usually pass `framed={false}` so the panel supplies the border and title. Tables keep their own scroll region; give a panel `scroll` only for custom content such as a timesheet.

## Accessibility

The grid and panels are named regions, and panel titles are headings. A scrolling panel body is focusable so keyboard users can scroll it. The presets are a single-choice group, the custom range opens in a popover, and the toolbar announces the active range, with its comparison, politely when it changes.
