# ChatWelcome

The empty state of a new chat: a greeting, one line on what the assistant can do, and prompts to start from.

## Usage

```jsx
import { ChatWelcome } from '@gaudi/design-system/chat';

<ChatWelcome title='What are we writing today?' description='Ask Gaudi to plan, draft or edit a post.' suggestions={starters} onSelect={send} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `title` / `description` / `icon` | Greeting, description and the mark above them. |
| `suggestions` / `onSelect` | Starter prompts as ChatPromptSuggestions. |
| `children` | Extra content under the prompts. |

## Accessibility

The greeting is a heading, so the empty chat has a clear landmark.
