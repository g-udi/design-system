# Bubble

The surface around a message. Seven variants cover who is speaking and what kind of message it is; reactions pin above or below on the sender side.

## Usage

```jsx
import { Bubble, BubbleContent, BubbleReactions } from '@gaudi/design-system/chat';

<Bubble variant='tinted' align='end'>
  <BubbleContent>Shipped to 4,180 readers.</BubbleContent>
  <BubbleReactions align='start'>🎉 3</BubbleReactions>
</Bubble>
```

## API

| Prop / part | Contract |
| --- | --- |
| `variant` | default, secondary, muted, tinted, outline, ghost or destructive. |
| `align` | start or end, matching the message. |
| `BubbleContent` | The text, or a button or link with `asChild`. |
| `BubbleReactions` | Reactions pinned to the bubble edge. |
| `BubbleGroup` | Stacks consecutive bubbles with tighter spacing. |

## Accessibility

Label reactions with `role="img"` and an `aria-label` such as "3 party popper reactions". Bubbles that act as quick replies must be real buttons through `asChild`.
