# ChatReasoning

The thinking trail before an answer. It stays open while the model thinks, then folds into "Thought for 6s" a second after the answer starts, unless the reader opened or closed it.

## Usage

```jsx
import { MessageReasoning, MessageReasoningStep } from '@gaudi/design-system/chat';

<MessageReasoning streaming={thinking} duration={seconds}>
  <MessageReasoningStep status='done'>Read the draft</MessageReasoningStep>
  <MessageReasoningStep status='running'>Suggest a tighter opening</MessageReasoningStep>
</MessageReasoning>
```

## API

| Prop / part | Contract |
| --- | --- |
| `streaming` | Open with a breathing "Thinking" label. |
| `duration` | Seconds spent, shown once thinking ends. |
| `open` / `defaultOpen` / `onOpenChange` | Disclosure state; the reader’s choice wins over the automatic fold. |
| `MessageReasoningStep.status` | A step with the shared statuses. |
| `useReasoningDisclosure` | The same open-then-fold behaviour for a custom trigger. |

## Accessibility

The trigger is a disclosure button with `aria-expanded`. The breathing label holds still for readers who reduce motion.
