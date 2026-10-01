# Message

Parts for chat and conversation views. `Message` lays out one turn (avatar, header, content, footer), `Bubble` is the surface around the text, and `MessageScroller` keeps a long thread anchored while new turns arrive.

## Usage

```jsx
import { Avatar, Bubble, BubbleContent, Message, MessageAvatar, MessageContent, MessageFooter } from '@gaudi/design-system';

<Message align='end'>
  <MessageAvatar><Avatar src={me.src} name={me.name} size='sm' alt='' /></MessageAvatar>
  <MessageContent>
    <Bubble align='end'><BubbleContent>Moving the legend under the axis.</BubbleContent></Bubble>
    <MessageFooter>Read 10:42</MessageFooter>
  </MessageContent>
</Message>
```

## Parts

| Part | Contract |
| --- | --- |
| `Message` / `MessageGroup` | One turn, `align` start or end; a group runs several turns under one avatar. |
| `MessageAvatar`, `MessageHeader`, `MessageContent`, `MessageFooter` | Avatar column, name and time, the content stack, and status such as read or edited. |
| `Bubble` / `BubbleGroup` | `variant` default, secondary, muted, tinted, outline, ghost or destructive; `align` matches the message. |
| `BubbleContent`, `BubbleReactions` | The text (or a button or link with `asChild`) and reactions pinned above or below. |
| `MessageScroller*` | Scroll container with anchoring, auto-scroll to the live edge and a jump button. |

## Assistant replies

An assistant turn is a list of parts, shaped like common AI SDK message parts but with no dependency on any SDK. `MessageParts` renders them in order:

| Part | Renders as |
| --- | --- |
| `{ type: 'text', text }` | `MessageMarkdown` |
| `{ type: 'reasoning', text?, steps?, duration? }` | `MessageReasoning`: open while thinking, folds away a second after the answer starts unless the reader toggled it |
| `{ type: 'tool', name, status, input?, output?, error?, parts? }` | `MessageTool`: statuses pending, running, done, failed or cancelled; input and output in `MessageData` (a list or table, with a JSON view); nested calls as `parts`; a failed call opens with its error and a retry |
| `{ type: 'delegation', agent, status, instructions?, parts? }` | `MessageDelegation`: work handed to another agent |
| `{ type: 'source', title, url?, kind?, site?, excerpt? }` | Gathered into one `MessageSources` list; the text cites them as `[1]`, `[2]`… through `MessageCitation` |
| `{ type: 'file', name, size?, href? }`, `{ type: 'data', label?, value }` | `MessageFile` and `MessageData` |
| `{ type: 'error', title?, text? }`, `{ type: 'suggestions', items }` | `MessageError` with retry, and `MessageSuggestions` |

Add `MessageFeedback` under a finished reply for copy, rating and regenerate.

### Markdown

Replies arrive as plain markdown, a few tokens at a time, so `MessageMarkdown` renders them at runtime instead of compiling them like MDX articles. It adds no markdown dependency:

- Code fences go through the CodeBlock `markdownFences` helper and `CodeBlock`; an unclosed fence keeps streaming.
- The text between fences uses a small grammar: headings (shifted below the conversation heading), paragraphs, ordered, unordered and task lists, quotes, rules, pipe tables, bold, italic, strikethrough, inline code, links, bare URLs and numbered citations.
- Links render through the core `Link`.
- Unfinished markup while streaming stays as typed until its closing marker arrives.

Raw HTML is never interpreted.

```jsx
import { Message, MessageContent, MessageFeedback, MessageParts } from '@gaudi/design-system';

<Message>
  <MessageContent>
    <MessageParts parts={turn.parts} streaming={turn.streaming} onRetry={retry} onToolRetry={retryTool} />
    {turn.streaming ? null : <MessageFeedback copyText={turn.text} onRegenerate={regenerate} />}
  </MessageContent>
</Message>
```

## Accessibility

Side alone is lost when a thread is read aloud: name the sender in a header or visually hidden text, and label reactions and icon-only actions. While a reply streams, MessageParts marks it `aria-busy`; announce the start and the end once in a polite status, never every token. Thinking and tool cards are disclosure buttons, citations open on click or Enter, and feedback actions confirm in a status message.
