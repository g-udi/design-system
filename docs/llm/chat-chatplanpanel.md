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
| `steps` | `Array<{ id, title, status, description?, owner?, todos? }>` | `[]` | no | Plan steps with the shared statuses. |
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

The header reads the count of finished steps.

## Examples

- Playground (Storybook `chat-chatplanpanel--playground`)
- Plan in progress (Storybook `chat-chatplanpanel--plan-in-progress`)

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
| `steps` | `{ id, title, status, description?, owner?, todos? }` with the shared statuses. |
| `title` / `defaultOpen` | Header and initial disclosure. |
| `labels` | Copy for the count and statuses. |

### Accessibility

The header is a disclosure that reads the count ("2 of 4 done"); the progress bar has a label and value text.
