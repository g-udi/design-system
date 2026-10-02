# ChatInput

The composer for a chat: `PromptComposer` (a multi-line prompt on the core InputGroup with mentions, commands, attachments and send or stop), `PromptQueue` for messages waiting while a reply streams, and `ChatModelSelect` for the model and effort.

## Usage

```jsx
import { ChatEffortSlider, ChatModelSelect, PromptComposer, PromptQueue } from '@gaudi/design-system/chat';

<PromptQueue items={queue} onEdit={edit} onRemove={remove} onSendNow={sendNow} onMove={move} />
<PromptComposer
  status={streaming ? 'streaming' : 'ready'}
  mentions={people}
  commands={commands}
  onSubmit={(text, { queued }) => (queued ? enqueue(text) : send(text))}
  onStop={stop}
  toolbar={<ChatModelSelect models={models} value={model} onValueChange={setModel}><ChatEffortSlider value={effort} onValueChange={setEffort} compact /></ChatModelSelect>}
/>
```

## API

| Prop / part | Contract |
| --- | --- |
| `PromptComposer` | `@` anywhere or `/` at the start opens `mentions` or `commands`; Enter sends and Shift+Enter adds a line; `status` streaming shows Stop and reports `{ queued: true }`; `toolbar`, `footer`, `attachments` and `onAttach` fill the frame. |
| `PromptQueue` | Waiting messages `{ id, text }`: edit in place, send now, remove, or move with Alt+Arrow. |
| `ChatModelSelect` | `models` `{ value, label, description?, badge? }` with `value` / `onValueChange`; `children` add a footer such as a ChatEffortSlider. |
| `findPromptTrigger(text, caret)` | The mention or command being typed at the caret, or null. |

## Accessibility

The prompt is a labelled combobox; suggestions are a listbox with the active option announced. Icon buttons (attach, send, stop, add to queue) have names, and every queue action names the message it acts on.
