# ChatSources

Where an answer came from: numbered inline citations that open a card with the source, and the list of sources under the reply with the same numbers. One citation can group several sources; its card pages through them in a carousel.

## Usage

```jsx
import { ChatMessageCitation, ChatMessageSources } from '@gaudi/design-system/chat';

<p>
  Readers leave early <ChatMessageCitation index={1} source={sources[0]} /> on long posts
  <ChatMessageCitation index={2} sources={[sources[1], sources[2]]} />.
</p>
<ChatMessageSources sources={sources} />
```

In `ChatMessageMarkdown` and `ChatMessageParts`, `[1]` cites one source and `[1, 3]` groups several behind one pill.

## API

| Prop / part | Contract |
| --- | --- |
| `ChatMessageSources.sources` | `{ title, url?, kind?, site?, excerpt?, quote?, icon? }`; collapsed to a count by default. |
| `ChatMessageCitation` | `index` with `source`, or `sources` for several; the pill reads "2 +1" and the card has a carousel. |
| `ChatMessageCitation.labels` | `trigger`, `carousel`, `position`, `previous` and `next` copy. |
| `ChatMessageSource` | One row of the list. |

## Accessibility

Each citation is a button named "Source 1: title" (", and 2 more" when grouped). The card opens on hover for a mouse without taking focus, and on click, tap, Enter or Space with focus inside; Escape closes it. The carousel pages with the arrow keys, its buttons or a swipe, and announces "2 of 3". Links leave the page with clear names.

## Answer linked to evidence

`ChatCitedAnswer` connects a finished answer to prepared source passages. Citation buttons and source chips highlight every segment citing that source on hover or focus. Activation opens one inline source region. Existing `ChatMessageCitation` popovers remain useful for lightweight citations and grouped sources.

```jsx
import { ChatCitedAnswer } from '@gaudi/design-system/chat/ChatSources';

<ChatCitedAnswer
  segments={[{ id: 'claim', text: 'Lead with a practical example. ', sourceIds: ['notes'] }]}
  sources={[{
    id: 'notes', title: 'Reader notes', site: 'Editorial research', kind: 'document',
    quote: 'Readers wanted the practical example first.', highlights: ['practical example']
  }]}
/>
```

- `segments`: `{ id, text, sourceIds?, paragraph? }[]` in reading order. IDs are stable; `paragraph: true` starts a new paragraph. Supplied whitespace is preserved. Unknown source IDs are skipped and repeated IDs within a segment produce one marker.
- `sources`: existing source fields plus required unique, nonempty string `id`, optional display-ready `date`, and `highlights: string[]`. Numbers follow source order. Highlights match exact supplied quote phrases; no inference, retrieval, or confidence scoring occurs. A source without a URL has no open-source action; a source without a quote/excerpt has no quote or copy action.
- `openSourceId`, `defaultOpenSourceId`, `onOpenSourceChange(id | null)`: controlled or uncontrolled disclosure. Controlled values remain authoritative. The host owns source mapping, extraction, links, and persistence.
- `labels`: `answer`, `sources`, `preview`, `close`, `copy`, `copied`, `copyFailed`, `open`, `hint`, `trigger(number, title)`, and `selected(number, title, count)` override the accessible and visible copy.
- Source chips wrap within their container and use the shared single-selection ToggleGroup keyboard navigation. Tab visits inline citations; Enter/Space toggles a source. Escape or Close returns focus to its source chip. Opening does not steal focus or scroll. Quote copying uses the shared clipboard hook and announces success or failure.
- The example **Answer linked to evidence** uses original illustrative editorial notes, explicitly marked as a local fixture; its example.com links are placeholders. It adds claim-to-evidence inspection alongside the existing **Cited answer** schema composition.
