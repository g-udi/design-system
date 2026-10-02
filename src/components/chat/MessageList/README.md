# MessageList

The conversation itself: `MessageScroller` keeps a long thread anchored while new turns arrive, and `MessageParts` renders each assistant turn from its parts (text, reasoning, tools, sources, files, data, errors and suggestions).

## Usage

```jsx
import { MessageParts, MessageScroller, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@gaudi/design-system/chat';

<MessageScrollerProvider autoScroll>
  <MessageScroller>
    <MessageScrollerViewport aria-label='Conversation'>
      <MessageScrollerContent>
        {turns.map((turn) => (
          <MessageScrollerItem key={turn.id} scrollAnchor={turn.role === 'user'}>
            <MessageParts parts={turn.parts} streaming={turn.streaming} />
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
  </MessageScroller>
</MessageScrollerProvider>
```

## API

| Prop / part | Contract |
| --- | --- |
| `MessageScroller*` | Scroll container with anchoring, auto-scroll to the live edge, load-earlier without a jump, and `MessageScrollerButton` to jump to the latest. |
| `MessageScrollerItem.scrollAnchor` | Lifts a sent message near the top while a slice of the previous turn stays visible. |
| `MessageParts.parts` | The parts of one assistant turn; unknown types are skipped so the host can render its own. |
| `MessageParts.streaming` | Marks the turn as arriving: `aria-busy`, a live code fence and an open thinking trail. |
| `MessageMarkdown` | Runtime markdown for reply text, with code through CodeBlock. |

## Parts model

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
import { Message, MessageContent, MessageFeedback, MessageParts } from '@gaudi/design-system/chat';

<Message>
  <MessageContent>
    <MessageParts parts={turn.parts} streaming={turn.streaming} onRetry={retry} onToolRetry={retryTool} />
    {turn.streaming ? null : <MessageFeedback copyText={turn.text} onRegenerate={regenerate} />}
  </MessageContent>
</Message>
```


## Accessibility

The thread scrolls inside a labelled region and never moves the page. While a reply streams, MessageParts marks it `aria-busy`; announce the start and the end once in a polite status, never every token.
