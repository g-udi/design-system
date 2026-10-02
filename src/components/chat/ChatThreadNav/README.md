# ChatThreadNav

Steps through the prompts in a long thread: previous, next, and a menu of every prompt.

## Usage

```jsx
import { ChatThreadNav } from '@gaudi/design-system/chat';

<ChatThreadNav turns={prompts} current={currentId} onNavigate={scrollToTurn} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `turns` | `{ id, label }` in thread order. |
| `current` | The id in view. |
| `onNavigate(id)` | Scroll the thread to that turn, for example with `useMessageScroller().scrollToMessage`. |

## Accessibility

A labelled group; the menu button reads its position ("2 of 4") and the ends disable.
