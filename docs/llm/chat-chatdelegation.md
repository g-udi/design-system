# ChatDelegation

> Chat/ChatDelegation · chat · `@gaudi/design-system/chat/ChatDelegation`

Work handed to another agent: who took it, the brief, its status and its activity.

## Import

```js
import ChatDelegation from '@gaudi/design-system/chat/ChatDelegation';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatMessageDelegation`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `status` | `pending \| running \| done \| failed` | `running` | no | Delegation status. |
| `instructions` | `string` | — | no | The brief. |
| `agent` | `{ name }` | — | no | The agent that took the work. |
| `error` | `string` | — | no | Shown as an alert. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `status`: `pending`, `running`, `done`, `failed`

## Usage

```jsx
import { ChatMessageDelegation, ChatMessageTool } from '@gaudi/design-system/chat';

<ChatMessageDelegation agent={{ name: 'Research agent' }} status='running' instructions={brief}>
  <ChatMessageTool name='web_search' status='done' />
</ChatMessageDelegation>
```

## Accessibility

The status is named in text, not colour alone.

## Examples

- Playground (Storybook `chat-chatdelegation--playground`)

Curated patterns:

- Handing work to another agent — registry item `@gaudi/chat-delegation-agent-handoff` (uses `Button`, `ChatAgentMark`, `ChatMessage`, `ChatMessageAvatar`, `ChatMessageContent`, `ChatMessageHeader`, `ChatMessageParts`, `RegistryIcon`)

## README

Work the assistant handed to another agent: who took it, the brief, its status and that agent’s own activity.

### Usage

```jsx
import { ChatMessageDelegation, ChatMessageTool } from '@gaudi/design-system/chat';

<ChatMessageDelegation agent={{ name: 'Research agent' }} status='running' instructions={brief}>
  <ChatMessageTool name='web_search' status='done' />
</ChatMessageDelegation>
```

### API

| Prop / part | Contract |
| --- | --- |
| `agent` | `{ name }` of the agent that took the work. |
| `status` | The shared statuses. |
| `instructions` / `error` | The brief, and an error as an alert. |
| `children` | The agent’s own activity, usually tool calls. |

### Accessibility

The card names the agent and its status in text; the status does not rely on colour.
