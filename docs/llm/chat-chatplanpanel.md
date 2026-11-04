# ChatPlanPanel

> Chat/ChatPlanPanel · chat · `@gaudi/design-system/chat/ChatPlanPanel`

The assistant’s plan for the current request, with progress.

## Import

```js
import ChatPlanPanel from '@gaudi/design-system/chat/ChatPlanPanel';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatPlan`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `Plan` | no | Header. |
| `defaultOpen` | `boolean` | `true` | no | Initial disclosure. |
| `steps` | `Array<{ id, title, status, description?, owner?, todos?, notes? }>` | `[]` | no | Plan steps with the shared statuses; notes are prepared { id, text, label? } entries. |
| `labels` | `object` | — | no | Progress and status copy, owner and current-step labels, and notes list name. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { ChatPlan } from '@gaudi/design-system/chat';

<ChatPlan title='Plan' steps={[
  { id: 'read', title: 'Read the draft', status: 'done' },
  { id: 'draft', title: 'Draft the opening', status: 'running' }
]} />
```

## Accessibility

The header reads the count of finished steps. Steps and notes form named lists; the first running step, or first awaiting step when none is running, exposes aria-current="step".

## Examples

- Playground (Storybook `chat-chatplanpanel--playground`)
- Plan in progress (Storybook `chat-chatplanpanel--plan-in-progress`)

Curated patterns:

- Agent steering — registry item `@gaudi/plan-agent-steering` (uses `Badge`, `Button`, `ChatAgentMark`, `ChatPlan`, `ChatPromptQueue`, `RegistryIcon`, `Textarea`)

## Related

`core-progress`

## README

The assistant’s plan for the current request: steps with status, owners and todos, a count of finished steps and a progress bar. It collapses to that summary.

### Usage

```jsx
import { ChatPlan } from '@gaudi/design-system/chat';

<ChatPlan title='Plan' steps={[
  { id: 'read', title: 'Read the draft', status: 'done' },
  { id: 'draft', title: 'Draft the opening', status: 'running' }
]} />
```

### API

| Prop / part | Contract |
| --- | --- |
| `steps` | `{ id, title, status, description?, owner?, todos?, notes? }` with the shared statuses. |
| `steps[].notes` | Prepared `{ id, text, label? }` notes attached to that step; stable IDs identify notes and labels describe their provenance. |
| `title` / `defaultOpen` | Header and initial disclosure. |
| `labels` | `progress(done, total)` formats the count; `status` supplies status copy, `owner` and `now` label the owner and current step, and `notes` names each step’s note list. |

### Accessibility

The header is a disclosure that reads the count ("2 of 4 done"); the progress bar has a label and value text. Steps form a named list, the first running step (or first awaiting step when none is running) exposes `aria-current="step"`, and notes form a nested list named by `labels.notes` (default: “Step notes”). The progress count is directionally isolated for mixed-direction text.

### Agent steering example

The **Agent steering** example composes ChatPlan, ChatPromptQueue, ChatAgentMark, Textarea, Button and Badge. Queue an instruction for the next step, edit or remove a queued note, or apply it immediately to the active step. Notes retain their IDs when moved from the queue into the plan, with a prepared label recording when they were applied. Earlier instructions stay visible after the run finishes.

Enter queues, Ctrl/Cmd+Enter applies immediately, Shift+Enter inserts a newline, and Escape clears the draft. These shortcuts ignore IME composition. Pause prevents advancing and applying immediately while still allowing queued edits. At the final step there is no next-step queue; apply or clear a draft before finishing. Focus returns to the composer when a queued action removes its button. Reset restores the fictional starting state.

The example uses a fluid single column up to 42rem; action groups wrap on small containers. Updates are announced politely. The example owns its local state and scheduling rules; applications decide when notes are acknowledged, what a step does and how to persist a run. ChatPlan only displays supplied notes and does not orchestrate an agent or infer instruction labels.
