# ChatAgentFindings

> Chat/ChatAgentFindings · chat · `@gaudi/design-system/chat/ChatAgentFindings`

Filter prepared findings by agent and severity, inspect evidence and request review changes.

## Import

```js
import ChatAgentFindings from '@gaudi/design-system/chat/ChatAgentFindings';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatAgentFindings`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `agents` | `Agent[]` | `[]` | no | Prepared rows: { id, name, icon?, detail?, value?, max?, statusLabel?, tone? }. Progress appears only with a finite nonnegative value and finite positive max; zero progress is preserved. Progress values and status text come from the host. |
| `findings` | `Finding[]` | `[]` | no | Ordered findings: { id, agent, severity, title, location?, time?, evidence?, recommendation? }. Agent and severity refer to supplied IDs; no severity is inferred. |
| `severities` | `Severity[]` | `[]` | no | Filter options: { id, label, tone? }. IDs are case-sensitive; __all is reserved for the all-severities option. |
| `reviewedIds` | `string[]` | `[]` | no | Controlled list of reviewed finding IDs. |
| `onReviewedChange` | `(id, reviewed) => void` | — | no | Request a review change. Omit for display-only review state; persistence belongs to the host. |
| `readOnly` | `boolean` | `false` | no | Disable review actions while leaving filtering and evidence inspection available. |
| `summary / emptyState / footer` | `ReactNode` | — | no | Prepared progress summary, empty content and footer controls/status. Filters and evidence disclosure are local UI state. |
| `title / description` | `ReactNode` | — | no | Panel heading and supporting text. |
| `className` | `string` | — | no | Additional root classes. Panels fill available width; the consuming layout chooses any maximum width. |

## Usage

```jsx
import { ChatAgentFindings } from '@gaudi/design-system/chat/ChatAgentFindings';

<ChatAgentFindings
  agents={[{ id: 'reviewer', name: 'Reviewer', statusLabel: 'Done' }]}
  severities={[{ id: 'warning', label: 'Warning', tone: 'warning-light' }]}
  findings={[{ id: 'retry', agent: 'reviewer', severity: 'warning', title: 'Retry creates a duplicate', evidence: 'The same request created two records.' }]}
/>
```

## Accessibility

Native buttons, semantic headings and Gaudi disclosures preserve keyboard and focus behavior. Host callbacks own persistence and services.

## Examples

Curated patterns:

- Agent findings — registry item `@gaudi/chat-delegation-agent-findings` (uses `Button`, `ChatAgentFindings`, `Empty`, `EmptyDescription`, `EmptyHeader`, `EmptyTitle`, `ToggleGroupItem`, `ToggleGroupRoot`)

## Related

`core-progress`

## README

Filter prepared findings by agent and severity, inspect evidence and request review changes.

### Usage

```jsx
import { ChatAgentFindings } from '@gaudi/design-system/chat/ChatAgentFindings';

<ChatAgentFindings
  agents={[{ id: 'reviewer', name: 'Reviewer', statusLabel: 'Done' }]}
  severities={[{ id: 'warning', label: 'Warning', tone: 'warning-light' }]}
  findings={[{ id: 'retry', agent: 'reviewer', severity: 'warning', title: 'Retry creates a duplicate', evidence: 'The same request created two records.' }]}
/>
```

### API

| Prop | Contract |
| --- | --- |
| `agents` | Prepared rows: { id, name, icon?, detail?, value?, max?, statusLabel?, tone? }. Progress appears only with a finite nonnegative `value` and finite positive `max`; zero progress is preserved. Progress values and status text come from the host. |
| `findings` | Ordered findings: { id, agent, severity, title, location?, time?, evidence?, recommendation? }. Agent and severity refer to supplied IDs; no severity is inferred. |
| `severities` | Filter options: { id, label, tone? }. IDs are case-sensitive; __all is reserved for the all-severities option. |
| `reviewedIds` | Controlled list of reviewed finding IDs. |
| `onReviewedChange` | `(findingId, reviewed) => void` requests a review change. Omit for display-only review state; persistence belongs to the host. |
| `readOnly` | Disable review actions while leaving filtering and evidence inspection available. |
| `summary / emptyState / footer` | Prepared progress summary, empty content and footer controls/status. Filters and evidence disclosure are local UI state. |
| `title / description` | Panel heading and supporting text. |
| `className` | Additional root classes. Panels fill available width; the consuming layout chooses any maximum width. |

### Ownership and accessibility

Gaudi owns presentation, responsive layout and local inspection state. The application supplies stable IDs, ordering, labels, tones, values and callbacks. Omit mutation callbacks for display-only use. No services, timers, persistence or domain decisions run inside the component.

The panel fills its container and wraps controls on narrow screens. Lists keep their own bounded scrolling. Headings use unique instance IDs; native controls and Gaudi disclosures provide keyboard operation.

### Example

The [copyable demo](stories/fixtures/agent-findings/chat-delegation-agent-findings.jsx) retains its local simulation, failure/empty states and reset controls. Its preview URL and Storybook story ID are preserved. It composes the public component instead of containing another implementation.

Interaction inspiration: [AffectUI](https://www.affectui.com/components/agent-findings). Implemented independently using Gaudi primitives.
