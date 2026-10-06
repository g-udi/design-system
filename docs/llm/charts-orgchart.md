# OrgChart

> Charts/OrgChart · charts · `@gaudi/design-system/charts/OrgChart`

A connected organization hierarchy with person cards, expandable reporting lines, and contained scrolling.

## Import

```js
import { OrgChart } from '@gaudi/design-system/charts/OrgChart';
// also: import { … } from '@gaudi/design-system/charts';
```

Exports: `OrgChart`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `OrgNode \| null` | — | no | Root { id, name, role?, department?, avatar?, children? }. IDs must be unique; children form an acyclic tree. |
| `label` | `string` | `Organization chart` | no | Accessible name of the scrolling region. |
| `collapsedIds / defaultCollapsedIds / onCollapsedIdsChange` | `string[] / function` | `[]` | no | Controlled or initial collapsed branches; callback receives the next IDs. |
| `onNodeClick` | `(node) => void` | — | no | Makes person cards keyboard-accessible buttons. The host owns details or selection. |
| `renderNode` | `(node) => ReactNode` | `Person avatar and text` | no | Custom card content. Keep it non-interactive when onNodeClick wraps it in a button. |
| `disabled` | `boolean` | `false` | no | Disables person and branch actions; scrolling remains available. |
| `labels` | `object` | `English labels` | no | Override empty and expand(node), collapse(node), reports(count) text. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { OrgChart } from '@gaudi/design-system/charts/OrgChart';

const team = { id: 'lead', name: 'Bram Ellery', role: 'Engineering Lead', children: [{ id: 'dev', name: 'Sam Rivera', role: 'Engineer' }] };
<OrgChart label='Engineering organization' data={team} />
```

## Accessibility

Nested lists convey reporting relationships. Branch buttons expose expanded state, retain focus when toggled, and work with Enter or Space. The labelled scroll region is keyboard focusable. Avatars are decorative because names are visible.

## Examples

- Playground (Storybook `charts-orgchart--playground`)
- Collapsed departments (Storybook `charts-orgchart--department-overview`)
- Empty (Storybook `charts-orgchart--empty`)

## README

A connected reporting hierarchy with collapsible branches. Import from `@gaudi/design-system/charts/OrgChart` or `@gaudi/design-system/charts` and load Gaudi's global stylesheet.

```jsx
import { OrgChart } from '@gaudi/design-system/charts/OrgChart';

const team = {
  id: 'lead', name: 'Bram Ellery', role: 'Engineering Lead',
  children: [{ id: 'dev', name: 'Sam Rivera', role: 'Engineer' }]
};

<OrgChart label='Engineering organization' data={team} />
```

Nodes accept `id`, `name`, `role`, `department`, `avatar`, and `children`. Supply a finite, acyclic tree with unique stable IDs. A null root displays the empty state. Use `defaultCollapsedIds` for the initial overview or `collapsedIds` with `onCollapsedIdsChange` for host-owned expansion. `onNodeClick(node)` makes person cards buttons; the application supplies the detail view. `renderNode(node)` customizes their contents; avoid interactive children when the card is itself a button. `disabled` disables both card and branch actions.

Nested lists preserve reporting relationships for assistive technology. Expand/collapse buttons retain focus and expose `aria-expanded`. The named region contains horizontal scrolling on small screens and is keyboard focusable. Person names remain visible beside decorative avatars. Override `labels.empty`, `labels.expand(node)`, `labels.collapse(node)` and `labels.reports(count)` to localize it.

Use Tree for a compact navigable outline; use Flow for an editable graph with pan, zoom, and arbitrary connections. OrgChart deliberately presents a reporting tree without a canvas dependency.
