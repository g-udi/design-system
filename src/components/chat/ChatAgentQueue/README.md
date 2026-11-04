# ChatAgentQueue

Inspect waiting work, worker assignments and recent results, and request host-defined job actions.

## Usage

```jsx
import { ChatAgentQueue } from '@gaudi/design-system/chat/ChatAgentQueue';

<ChatAgentQueue
  waiting={[{ id: 'review', name: 'Review the draft', kind: 'Review task', meta: 'Waiting' }]}
  workers={[{ id: 'editor', name: 'Editor', statusLabel: 'Idle' }]}
/>
```

## API

| Prop | Contract |
| --- | --- |
| `waiting / recent` | Prepared ordered jobs: { id, name, icon?, kind?, meta?, detail?, description?, error?, progress?, priority?, actions?: { id, label, disabled? }[] }. No sorting, truncation or action policy is inferred. |
| `workers` | Prepared { id, name, icon?, statusLabel?, tone?, description?, job?: Job }. The host assigns jobs to workers. |
| `summary` | Prepared summary cells; zero and supplied formatting are preserved. |
| `onJobAction` | `(jobId, actionId) => void` requests a job action. Only supplied actions render; no callback means no mutation controls. |
| `onInspectJob` | `(jobId) => void` runs when opening a job, for example to pause a demo. |
| `actionFocusRef` | Focus destination after a job action may remove its trigger. Defaults to the panel. |
| `toolbar / notice / children / footer` | Host controls, status, optional chart/content and footer. Charts remain optional composition; no chart dependency is imported. |
| `workersDescription / resultsDescription` | Prepared explanations below worker and result groups. |
| `title / description` | Panel heading and supporting text. |
| `className` | Additional root classes. Panels fill available width; the consuming layout chooses any maximum width. |

Opening a job calls `onInspectJob`. Escape or Close returns focus to its trigger. Activating a supplied action closes the disclosure and focuses `actionFocusRef` or the panel, so a removed job does not strand focus. Job actions must be authorized and applied by the host; the panel never changes queue order, creates retries, assigns workers, or trims history.

## Ownership and accessibility

Gaudi owns presentation, responsive layout and local inspection state. The application supplies stable IDs, ordering, labels, tones, values and callbacks. Omit mutation callbacks for display-only use. No services, timers, persistence or domain decisions run inside the component.

The panel fills its container and wraps controls on narrow screens. Lists keep their own bounded scrolling. Headings use unique instance IDs; native controls and Gaudi disclosures provide keyboard operation.

## Example

The [copyable demo](stories/fixtures/agent-queue/chat-delegation-agent-queue.jsx) retains its local simulation, failure/empty states and reset controls. Its preview URL and Storybook story ID are preserved. It composes the public component instead of containing another implementation.

Interaction inspiration: [AffectUI](https://www.affectui.com/components/agent-queue). Implemented independently using Gaudi primitives.
