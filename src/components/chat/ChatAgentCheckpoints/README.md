# ChatAgentCheckpoints

Inspect saved attempts and checkpoints, and request a switch or restore without changing workspace state.

## Usage

```jsx
import { ChatAgentCheckpoints } from '@gaudi/design-system/chat/ChatAgentCheckpoints';

<ChatAgentCheckpoints
  attempts={[{ id: 'first', label: 'Attempt 1', checkpoints: [{ id: 'saved', title: 'Prepared changes', statusLabel: 'Saved' }] }]}
  currentAttemptId='first' currentId='saved' activeIds={['saved']}
/>
```

## API

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

## Ownership and accessibility

Gaudi owns presentation, responsive layout and local inspection state. The application supplies stable IDs, ordering, labels, tones, values and callbacks. Omit mutation callbacks for display-only use. No services, timers, persistence or domain decisions run inside the component.

The panel fills its container and wraps controls on narrow screens. Lists keep their own bounded scrolling. Headings use unique instance IDs; native controls and Gaudi disclosures provide keyboard operation.

## Example

The [copyable demo](stories/fixtures/agent-checkpoints/message-scroller-agent-checkpoints.jsx) retains its local simulation, failure/empty states and reset controls. Its preview URL and Storybook story ID are preserved. It composes the public component instead of containing another implementation.

Interaction inspiration: [AffectUI](https://www.affectui.com/components/agent-checkpoints). Implemented independently using Gaudi primitives.
