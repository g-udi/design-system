# ChatActivityIndicator

What the assistant is doing right now: idle, thinking, streaming, tool, done or error. Busy states move; settled states hold still and show an icon.

## Usage

```jsx
import { ChatActivityIndicator } from '@gaudi/design-system/chat';

<ChatActivityIndicator state='thinking' showLabel />
<ChatActivityIndicator state='done' variant='badge' />
```

## API

| Prop / part | Contract |
| --- | --- |
| `state` | idle, thinking, streaming, tool, done or error (`activityStates`). |
| `variant` | inline, or badge for the corner of a mark or avatar. |
| `showLabel` / `labels` | A visible label, and copy per state. |
| `decorative` | Hides it when nearby text names the state. |

## Accessibility

A polite status region, so each change is announced once. With reduced motion the dots fade slowly instead of moving; the state never depends on motion or colour alone.
