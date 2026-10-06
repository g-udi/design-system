# ChatActivityIndicator

> Chat/ChatActivityIndicator · chat · `@gaudi/design-system/chat/ChatActivityIndicator`

What the assistant is doing: idle, thinking, streaming, tool, done or error.

## Import

```js
import ChatActivityIndicator from '@gaudi/design-system/chat/ChatActivityIndicator';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatActivityIndicator`, `activityStates`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `state` | `idle \| thinking \| streaming \| tool \| done \| error` | `idle` | no | Current activity. |
| `variant` | `inline \| badge` | `inline` | no | Inline mark or corner badge. |
| `showLabel` | `boolean` | `false` | no | Visible label beside the mark. |
| `labels / decorative` | `object / boolean` | — | no | Copy per state, and hiding. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `state`: `idle`, `thinking`, `streaming`, `tool`, `done`, `error`
- `variant`: `inline`, `badge`

## Usage

```jsx
import { ChatActivityIndicator } from '@gaudi/design-system/chat';

<>
<ChatActivityIndicator state='thinking' showLabel />
<ChatActivityIndicator state='done' variant='badge' />
</>
```

## Accessibility

A polite status; motion slows to a fade for reduced motion.

## Examples

- Playground (Storybook `chat-activityindicator--playground`)
- A reply from thinking to done (Storybook `chat-activityindicator--reply-lifecycle`)

## README

What the assistant is doing right now: idle, thinking, streaming, tool, done or error. Busy states move; settled states hold still and show an icon.

### Usage

```jsx
import { ChatActivityIndicator } from '@gaudi/design-system/chat';

<ChatActivityIndicator state='thinking' showLabel />
<ChatActivityIndicator state='done' variant='badge' />
```

### API

| Prop / part | Contract |
| --- | --- |
| `state` | idle, thinking, streaming, tool, done or error (`activityStates`). |
| `variant` | inline, or badge for the corner of a mark or avatar. |
| `showLabel` / `labels` | A visible label, and copy per state. |
| `decorative` | Hides it when nearby text names the state. |

### Accessibility

A polite status region, so each change is announced once. With reduced motion the dots fade slowly instead of moving; the state never depends on motion or colour alone.
