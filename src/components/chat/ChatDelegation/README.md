# ChatDelegation

Work the assistant handed to another agent: who took it, the brief, its status and that agent’s own activity.

## Usage

```jsx
import { MessageDelegation, MessageTool } from '@gaudi/design-system/chat';

<MessageDelegation agent={{ name: 'Research agent' }} status='running' instructions={brief}>
  <MessageTool name='web_search' status='done' />
</MessageDelegation>
```

## API

| Prop / part | Contract |
| --- | --- |
| `agent` | `{ name }` of the agent that took the work. |
| `status` | The shared statuses. |
| `instructions` / `error` | The brief, and an error as an alert. |
| `children` | The agent’s own activity, usually tool calls. |

## Accessibility

The card names the agent and its status in text; the status does not rely on colour.
