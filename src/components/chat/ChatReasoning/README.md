# ChatReasoning

The thinking trail before an answer. While the model thinks, the label shimmers "Thinking…" and the trail stays open; a second after the answer starts it folds into "Thought for 6s", unless the reader opened or closed it. With detailed steps it becomes a chain of thought: search, read, analyse and decide, each with a status, details, search results and image thumbnails.

## Usage

```jsx
import { MessageReasoning, MessageReasoningImage, MessageReasoningResults, MessageReasoningStep } from '@gaudi/design-system/chat';

<MessageReasoning streaming={thinking}>
  <MessageReasoningStep status='done'>Read the draft</MessageReasoningStep>
  <MessageReasoningStep status='running'>Suggest a tighter opening</MessageReasoningStep>
</MessageReasoning>

<MessageReasoning streaming={thinking} variant='steps'>
  <MessageReasoningStep status='done' icon='Search' label='Searched the web' meta='4 results'>
    <MessageReasoningResults results={results} />
  </MessageReasoningStep>
  <MessageReasoningStep status='running' icon='Image' label='Comparing cover images'>
    <MessageReasoningImage src={cover} alt='The current cover: a train window at dusk' caption='Current cover' />
  </MessageReasoningStep>
  <MessageReasoningStep status='pending' icon='Lightbulb' label='Recommend a headline' />
</MessageReasoning>
```

## API

| Prop / part | Contract |
| --- | --- |
| `streaming` | Opens the trail with a shimmering "Thinking…" label; it opens again whenever thinking restarts. |
| `duration` | Seconds spent; measured from the start to the end of `streaming` when omitted. |
| `open` / `defaultOpen` / `onOpenChange` | Disclosure state; the reader's choice wins over the automatic fold. |
| `variant` | `trail` (a quoted trail) or `steps` (detailed steps draw their own rail). |
| `thinkingLabel` / `label` / `autoCloseDelay` | The streaming label, a fixed label, and the fold delay in ms (default 1000). |
| `MessageReasoningStep` | `status` from the shared vocabulary. Children alone make a plain step; `label` makes a detailed one with `icon`, `description`, `meta` and children as details that open from the label (the running step starts open). |
| `MessageReasoningResults` | `results` as link chips with favicons; `max` shows the first few and "+n more". |
| `MessageReasoningImage` | `src`, `alt` and `caption` for an image the step looked at. |
| `useReasoningDisclosure` | The same open-then-fold behaviour for a custom trigger. |

## Accessibility

The trail and every detailed step are disclosure buttons with `aria-expanded`. A step's status is spoken after its label ("Searched the web, Done"), never left to colour or the icon. The shimmer is real text and holds still for readers who reduce motion. Give thumbnails an `alt` that says what the model looked at.

## Attribution

Reasoning, Chain of Thought and Shimmer behaviour is adapted from [AI SDK Elements](https://elements.ai-sdk.dev/components/chain-of-thought) (Apache-2.0, Copyright 2023 Vercel, Inc.).
