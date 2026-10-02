# ChatPlanPanel

The assistant’s plan for the current request: steps with status, owners and todos, a count of finished steps and a progress bar. It collapses to that summary.

## Usage

```jsx
import { ChatPlan } from '@gaudi/design-system/chat';

<ChatPlan title='Plan' steps={[
  { id: 'read', title: 'Read the draft', status: 'done' },
  { id: 'draft', title: 'Draft the opening', status: 'running' }
]} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `steps` | `{ id, title, status, description?, owner?, todos? }` with the shared statuses. |
| `title` / `defaultOpen` | Header and initial disclosure. |
| `labels` | Copy for the count and statuses. |

## Accessibility

The header is a disclosure that reads the count ("2 of 4 done"); the progress bar has a label and value text.
