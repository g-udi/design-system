# ChatReasoning

> Chat/ChatReasoning · chat · `@gaudi/design-system/chat/ChatReasoning`

The thinking trail before an answer: a shimmering Thinking… label while it streams, a chain of thought of detailed steps with search results and images, folding into Thought for Ns once the answer starts.

## Import

```js
import ChatReasoning from '@gaudi/design-system/chat/ChatReasoning';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatMessageReasoning`, `ChatMessageReasoningImage`, `ChatMessageReasoningResults`, `ChatMessageReasoningStep`, `default`, `useReasoningDisclosure`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `streaming` | `boolean` | `false` | no | Opens the trail with a shimmering Thinking… label; it opens again whenever thinking restarts. |
| `duration` | `number` | `measured` | no | Seconds spent; measured from streaming start to end when omitted. |
| `defaultOpen` | `boolean` | `true` | no | Initial disclosure state. |
| `open / onOpenChange` | `boolean / (open) => void` | — | no | Controlled disclosure; the reader’s choice otherwise wins over the automatic fold. |
| `variant` | `trail \| steps` | `trail` | no | steps drops the quote rule so detailed steps draw their own rail. |
| `thinkingLabel / label / autoCloseDelay` | `string / string / number` | `Thinking… / — / 1000` | no | Streaming label, a fixed label, and the fold delay in ms. |
| `ChatMessageReasoningStep.status` | `pending \| running \| done \| failed \| cancelled` | `done` | no | A step with the shared statuses. |
| `ChatMessageReasoningStep.label / icon / description / meta` | `ReactNode / string / ReactNode / ReactNode` | — | no | A detailed chain-of-thought step: kind icon, title, summary and right-hand meta; children open as details. |
| `ChatMessageReasoningResults.results` | `Array<{ title, url?, site?, icon? }>` | `[]` | no | Search results as link chips with favicons; max limits them with a +n more. |
| `ChatMessageReasoningImage.src / alt / caption` | `string / string / ReactNode` | — | no | A thumbnail the step looked at. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `trail`, `steps`

## Usage

```jsx
import { ChatMessageReasoning, ChatMessageReasoningResults, ChatMessageReasoningStep } from '@gaudi/design-system/chat';

<ChatMessageReasoning streaming={thinking} variant='steps'>
  <ChatMessageReasoningStep status='done' icon='Search' label='Searched the web' meta='4 results'>
    <ChatMessageReasoningResults results={results} />
  </ChatMessageReasoningStep>
  <ChatMessageReasoningStep status='running' icon='BookOpen' label='Reading the sources' />
</ChatMessageReasoning>
```

## Accessibility

The trail and each detailed step are disclosure buttons with aria-expanded; step status is spoken after the label, not left to colour. The shimmer is real text and holds still for reduced motion.

## Notes

- The Agent run and AI message with steps examples on this page combine reasoning, a chain of thought, a tool approval (Chat/ChatTool) and a checkpoint (Chat/ChatMessageList).

## Examples

- Playground (Storybook `chat-chatreasoning--playground`)
- Thinking, then the answer (Storybook `chat-chatreasoning--thinking-then-answer`)
- Agent run (Storybook `chat-chatreasoning--agent-run`)
- AI message with steps (Storybook `chat-chatreasoning--ai-message-with-steps`)

## Related

`blocks-chat`, `chat-chattool`, `chat-chatmessagelist`, `layout-search`

## README

The thinking trail before an answer. While the model thinks, the label shimmers "Thinking…" and the trail stays open; a second after the answer starts it folds into "Thought for 6s", unless the reader opened or closed it. With detailed steps it becomes a chain of thought: search, read, analyse and decide, each with a status, details, search results and image thumbnails.

### Usage

```jsx
import { ChatMessageReasoning, ChatMessageReasoningImage, ChatMessageReasoningResults, ChatMessageReasoningStep } from '@gaudi/design-system/chat';

<ChatMessageReasoning streaming={thinking}>
  <ChatMessageReasoningStep status='done'>Read the draft</ChatMessageReasoningStep>
  <ChatMessageReasoningStep status='running'>Suggest a tighter opening</ChatMessageReasoningStep>
</ChatMessageReasoning>

<ChatMessageReasoning streaming={thinking} variant='steps'>
  <ChatMessageReasoningStep status='done' icon='Search' label='Searched the web' meta='4 results'>
    <ChatMessageReasoningResults results={results} />
  </ChatMessageReasoningStep>
  <ChatMessageReasoningStep status='running' icon='Image' label='Comparing cover images'>
    <ChatMessageReasoningImage src={cover} alt='The current cover: a train window at dusk' caption='Current cover' />
  </ChatMessageReasoningStep>
  <ChatMessageReasoningStep status='pending' icon='Lightbulb' label='Recommend a headline' />
</ChatMessageReasoning>
```

### API

| Prop / part | Contract |
| --- | --- |
| `streaming` | Opens the trail with a shimmering "Thinking…" label; it opens again whenever thinking restarts. |
| `duration` | Seconds spent; measured from the start to the end of `streaming` when omitted. |
| `open` / `defaultOpen` / `onOpenChange` | Disclosure state; the reader's choice wins over the automatic fold. |
| `variant` | `trail` (a quoted trail) or `steps` (detailed steps draw their own rail). |
| `thinkingLabel` / `label` / `autoCloseDelay` | The streaming label, a fixed label, and the fold delay in ms (default 1000). |
| `ChatMessageReasoningStep` | `status` from the shared vocabulary. Children alone make a plain step; `label` makes a detailed one with `icon`, `description`, `meta` and children as details that open from the label (the running step starts open). |
| `ChatMessageReasoningResults` | `results` as link chips with favicons; `max` shows the first few and "+n more". |
| `ChatMessageReasoningImage` | `src`, `alt` and `caption` for an image the step looked at. |
| `useReasoningDisclosure` | The same open-then-fold behaviour for a custom trigger. |

### Accessibility

The trail and every detailed step are disclosure buttons with `aria-expanded`. A step's status is spoken after its label ("Searched the web, Done"), never left to colour or the icon. The shimmer is real text and holds still for readers who reduce motion. Give thumbnails an `alt` that says what the model looked at.
