# ChatThreadNav

> Chat/ChatThreadNav · chat · `@gaudi/design-system/chat/ChatThreadNav`

Previous, next and a menu of every prompt in a long thread.

## Import

```js
import ChatThreadNav from '@gaudi/design-system/chat/ChatThreadNav';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatThreadNav`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `start` | `string` | `t2` | no | Example only: the turn in view at first. |
| `turns` | `Array<{ id, label }>` | `[]` | no | Prompts in thread order. |
| `current / onNavigate` | `string / (id) => void` | — | no | The turn in view and navigation. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { ChatThreadNav } from '@gaudi/design-system/chat';

<ChatThreadNav turns={prompts} current={currentId} onNavigate={scrollToTurn} />
```

## Accessibility

A labelled group; the menu button reads its position.

## Examples

- Playground (Storybook `chat-chatthreadnav--playground`)

## README

Steps through the prompts in a long thread: previous, next, and a menu of every prompt.

### Usage

```jsx
import { ChatThreadNav } from '@gaudi/design-system/chat';

<ChatThreadNav turns={prompts} current={currentId} onNavigate={scrollToTurn} />
```

### API

| Prop / part | Contract |
| --- | --- |
| `turns` | `{ id, label }` in thread order. |
| `current` | The id in view. |
| `onNavigate(id)` | Scroll the thread to that turn, for example with `useMessageScroller().scrollToMessage`. |

### Accessibility

A labelled group; the menu button reads its position ("2 of 4") and the ends disable.
