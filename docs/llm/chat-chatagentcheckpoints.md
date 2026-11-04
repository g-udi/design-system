# ChatAgentCheckpoints

> Chat/ChatAgentCheckpoints · chat · `@gaudi/design-system/chat/ChatAgentCheckpoints`

Inspect saved attempts and checkpoints, and request a switch or restore without changing workspace state.

## Import

```js
import ChatAgentCheckpoints from '@gaudi/design-system/chat/ChatAgentCheckpoints';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatAgentCheckpoints`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `attempts` | `Attempt[]` | `[]` | no | Ordered { id, label, origin?, disabled?, checkpoints: Checkpoint[] }. Each checkpoint accepts { id, title, detail?, time?, meta?, icon?, statusLabel?, tone?, running?, restoreDisabled? }. IDs are stable, globally unique for checkpoints. Running selects the activity indicator; restoreDisabled independently controls restore availability. |
| `currentAttemptId / currentId` | `string \| number` | — | no | Controlled current attempt and checkpoint. IDs may be zero. |
| `activeIds` | `Array<string \| number>` | `[]` | no | Prepared checkpoint IDs to emphasize as the active path. The component does not traverse or modify a run graph. |
| `onSelectAttempt / onRestore` | `(id) => void` | — | no | Requests to switch an attempt or restore a checkpoint. Omit either callback to hide its action. |
| `readOnly` | `boolean` | `false` | no | Disable switching and restore requests while keeping history readable. |
| `summary / emptyState / footer` | `ReactNode` | — | no | Prepared summary, empty-state content and footer actions/status. |
| `title / description` | `ReactNode` | — | no | Panel heading and supporting text. |
| `className` | `string` | — | no | Additional root classes. Panels fill available width; the consuming layout chooses any maximum width. |

## Usage

```jsx
import { ChatAgentCheckpoints } from '@gaudi/design-system/chat/ChatAgentCheckpoints';

<ChatAgentCheckpoints
  attempts={[{ id: 'first', label: 'Attempt 1', checkpoints: [{ id: 'saved', title: 'Prepared changes', statusLabel: 'Saved' }] }]}
  currentAttemptId='first' currentId='saved' activeIds={['saved']}
/>
```

## Accessibility

Native buttons, semantic headings and Gaudi disclosures preserve keyboard and focus behavior. Host callbacks own persistence and services.

## Examples

Curated patterns:

- Agent checkpoints — registry item `@gaudi/message-scroller-agent-checkpoints` (uses `Button`, `ChatAgentCheckpoints`, `RegistryIcon`, `ToggleGroupItem`, `ToggleGroupRoot`)

## README

Inspect saved attempts and checkpoints, and request a switch or restore without changing workspace state.

### Usage

```jsx
import { ChatAgentCheckpoints } from '@gaudi/design-system/chat/ChatAgentCheckpoints';

<ChatAgentCheckpoints
  attempts={[{ id: 'first', label: 'Attempt 1', checkpoints: [{ id: 'saved', title: 'Prepared changes', statusLabel: 'Saved' }] }]}
  currentAttemptId='first' currentId='saved' activeIds={['saved']}
/>
```

### API

| Prop | Contract |
| --- | --- |
| `attempts` | Ordered { id, label, origin?, disabled?, checkpoints: Checkpoint[] }. IDs are stable, globally unique for checkpoints. |
| `currentAttemptId / currentId` | Controlled current attempt and checkpoint. IDs may be zero. |
| `activeIds` | Prepared checkpoint IDs to emphasize as the active path. The component does not traverse or modify a run graph. |
| `onSelectAttempt / onRestore` | `(attemptId) => void` requests an attempt switch; `(checkpointId) => void` requests a restore. Omit either callback to hide its action. |
| `readOnly` | Disable switching and restore requests while keeping history readable. |
| `summary / emptyState / footer` | Prepared summary, empty-state content and footer actions/status. |
| `title / description` | Panel heading and supporting text. |
| `className` | Additional root classes. Panels fill available width; the consuming layout chooses any maximum width. |

Checkpoints accept `{ id, title, detail?, time?, meta?, icon?, statusLabel?, tone?, running?, restoreDisabled? }`. `running` selects the shared activity indicator. The application supplies availability through `restoreDisabled`; running status alone does not decide restore policy.

### Ownership and accessibility

Gaudi owns presentation, responsive layout and local inspection state. The application supplies stable IDs, ordering, labels, tones, values and callbacks. Omit mutation callbacks for display-only use. No services, timers, persistence or domain decisions run inside the component.

The panel fills its container and wraps controls on narrow screens. Lists keep their own bounded scrolling. Headings use unique instance IDs; native controls and Gaudi disclosures provide keyboard operation.

### Example

The [copyable demo](stories/fixtures/agent-checkpoints/message-scroller-agent-checkpoints.jsx) retains its local simulation, failure/empty states and reset controls. Its preview URL and Storybook story ID are preserved. It composes the public component instead of containing another implementation.

Interaction inspiration: [AffectUI](https://www.affectui.com/components/agent-checkpoints). Implemented independently using Gaudi primitives.
