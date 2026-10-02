# ChatPromptSuggestions

Follow-up prompts as a labelled list of buttons, under a reply or on a welcome screen.

## Usage

```jsx
import { MessageSuggestions } from '@gaudi/design-system/chat';

<MessageSuggestions suggestions={['Write a subtitle', 'Check the links']} onSelect={send} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `suggestions` | Strings or `{ id, label, prompt?, icon? }`. |
| `onSelect(prompt, item)` | Receives the prompt text. |
| `label` | The list name, 'Suggested prompts' by default. |

## Accessibility

Suggestions are real buttons in a labelled list; nothing renders when there are none.
