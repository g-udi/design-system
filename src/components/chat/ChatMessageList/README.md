# ChatMessageList

The conversation itself: `ChatMessageScroller` keeps a long thread anchored while new turns arrive, and `ChatMessageParts` renders each assistant turn from its parts (text, reasoning, tools, sources, files, data, errors and suggestions).

## Usage

```jsx
import { ChatMessageParts, ChatMessageScroller, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport } from '@gaudi/design-system/chat';

<ChatMessageScrollerProvider autoScroll>
  <ChatMessageScroller>
    <ChatMessageScrollerViewport aria-label='Conversation'>
      <ChatMessageScrollerContent>
        {turns.map((turn) => (
          <ChatMessageScrollerItem key={turn.id} scrollAnchor={turn.role === 'user'}>
            <ChatMessageParts parts={turn.parts} streaming={turn.streaming} />
          </ChatMessageScrollerItem>
        ))}
      </ChatMessageScrollerContent>
    </ChatMessageScrollerViewport>
  </ChatMessageScroller>
</ChatMessageScrollerProvider>
```

## API

| Prop / part | Contract |
| --- | --- |
| `ChatMessageScroller*` | Scroll container with anchoring, auto-scroll to the live edge, load-earlier without a jump, and `ChatMessageScrollerButton` to jump to the latest. |
| `ChatMessageScrollerItem.scrollAnchor` | Lifts a sent message near the top while a slice of the previous turn stays visible. |
| `ChatMessageParts.parts` | The parts of one assistant turn; unknown types are skipped so the host can render its own. |
| `ChatMessageParts.streaming` | Marks the turn as arriving: `aria-busy`, a live code fence and an open thinking trail. |
| `ChatMessageMarkdown` | Runtime markdown for reply text, with code through CodeBlock. |
| `ChatMessageCheckpoint` | A restore point between turns: `label`, `time` (string or Date), `onRestore` (confirmed in an alert dialog unless `confirm={false}`) and `restored`. |

## Parts model

An assistant turn is a list of parts, shaped like common AI SDK message parts but with no dependency on any SDK. `ChatMessageParts` renders them in order:

| Part | Renders as |
| --- | --- |
| `{ type: 'text', text }` | `ChatMessageMarkdown` |
| `{ type: 'reasoning', text?, steps?, duration? }` | `ChatMessageReasoning`: open while thinking, folds away a second after the answer starts unless the reader toggled it. Steps with a `label` (and `icon`, `description`, `text`, `results`, `images`) read as a chain of thought |
| `{ type: 'tool', name, status, input?, output?, error?, parts? }` | `ChatMessageTool`: statuses pending, running, done, failed or cancelled; input and output in `ChatMessageData` (a list or table, with a JSON view); nested calls as `parts`; a failed call opens with its error and a retry |
| `{ type: 'approval', name, description?, input?, state?, allowAlways?, output? }` | `ChatMessageToolApproval`: a tool waiting on the person; `onToolApproval(part, { approved, always })` answers it |
| `{ type: 'delegation', agent, status, instructions?, parts? }` | `ChatMessageDelegation`: work handed to another agent |
| `{ type: 'source', title, url?, kind?, site?, excerpt? }` | Gathered into one `ChatMessageSources` list; the text cites them as `[1]`, `[2]`… (or `[1, 3]` for several behind one pill) through `ChatMessageCitation` |
| `{ type: 'file', name, mediaType?, fileType?, previewUrl?, kind?, size?, description?, href? }`, `{ type: 'data', label?, value }` | Core `Attachment` with shared file media, and `ChatMessageData` |
| `{ type: 'error', title?, text? }`, `{ type: 'suggestions', items }` | Core `Alert` with retry, and labelled Core Button follow-ups (`onSuggestion(prompt, item)`) |

Add `ChatMessageFeedback` under a finished reply for copy, rating and regenerate.

### Delivered files

File parts reuse Core `AttachmentMedia`: supply `mediaType` (or `fileType`) for the MIME type, `previewUrl` for an explicit image or poster thumbnail, and `kind: 'link'` for a link icon. Without a preview, the shared media renderer chooses the file-type icon; failed thumbnails fall back to that icon. The file name remains visible beside the decorative media.

`onFileAction(action, part)` receives the original part for preview and host-managed download actions. An explicit `href` provides the download link instead. The host owns file retrieval and preview dialogs. When adapting upload metadata, preserve its MIME type before setting the part discriminator:

```jsx
<ChatMessageParts
  parts={files.map((file) => ({ ...file, type: 'file', mediaType: file.type }))}
  onFileAction={(action, file) => handleFileAction(action, file)}
/>
```

See **Chat / ChatMessage / Mixed attachments** for images, audio, video, documents, code, spreadsheets and links in a delivered reply.

### Checkpoints

A checkpoint sits between turns, outside `ChatMessageParts`, so the host decides where restore points fall and what restoring undoes.

```jsx
import { ChatMessageCheckpoint } from '@gaudi/design-system/chat';

<ChatMessageCheckpoint label='Before rewriting the intro' time={checkpoint.createdAt} onRestore={() => restore(checkpoint.id)} />
```

### Markdown

Replies arrive as plain markdown, a few tokens at a time, so `ChatMessageMarkdown` renders them at runtime instead of compiling them like MDX articles. It adds no markdown dependency:

- Code fences go through the CodeBlock `markdownFences` helper and `CodeBlock`; an unclosed fence keeps streaming.
- The text between fences uses a small grammar: headings (shifted below the conversation heading), paragraphs, ordered, unordered and task lists, quotes, rules, pipe tables, bold, italic, strikethrough, inline code, links, bare URLs and numbered citations.
- Links render through the core `Link`.
- Unfinished markup while streaming stays as typed until its closing marker arrives.

Raw HTML is never interpreted.

```jsx
import { ChatMessage, ChatMessageContent, ChatMessageFeedback, ChatMessageParts } from '@gaudi/design-system/chat';

<ChatMessage>
  <ChatMessageContent>
    <ChatMessageParts parts={turn.parts} streaming={turn.streaming} onRetry={retry} onToolRetry={retryTool} />
    {turn.streaming ? null : <ChatMessageFeedback copyText={turn.text} onRegenerate={regenerate} />}
  </ChatMessageContent>
</ChatMessage>
```

## Accessibility

The thread scrolls inside a labelled region and never moves the page. While a reply streams, ChatMessageParts marks it `aria-busy`; announce the start and the end once in a polite status, never every token. A checkpoint is a group named by its label and time; its restore button is described by them, and the confirmation is an alert dialog that returns focus to the button.

Follow-up suggestions belong to `ChatMessageParts` as `{ type: 'suggestions', items }`, where items are strings or `{ id, label, prompt?, icon? }`. The renderer is private. Welcome prompts use Core Button directly alongside ChatPersona, EmptyState and ChatPromptComposer; see **Blocks / Chat / Welcome**. `ChatMessageSuggestions` is no longer a standalone package export.
