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
| `title` / `description` / `icon` | Greeting, description and the mark above them; `icon` is a registry icon name or an element such as a product mark. |
| `suggestions` / `onSelect` | Starter prompts as ChatPromptSuggestions; `suggestionsVariant='cards'` shows them as a two-column grid of rows. |
| `children` | Extra content under the prompts. |

## Accessibility

The greeting is a heading, so the empty chat has a clear landmark.
