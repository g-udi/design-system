# ChatSources

> Chat/ChatSources · chat · `@gaudi/design-system/chat/ChatSources`

Numbered citations that open a hover card (with a carousel when one marker cites several sources) and the list of sources under a reply.

## Import

```js
import ChatSources from '@gaudi/design-system/chat/ChatSources';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatCitedAnswer`, `ChatMessageCitation`, `ChatMessageSource`, `ChatMessageSources`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `n sources` | no | Toggle label for the list. |
| `defaultOpen` | `boolean` | `false` | no | Initial disclosure. |
| `sources` | `Array<{ title, url?, kind?, site?, excerpt?, quote?, icon? }>` | `[]` | no | Sources in citation order. |
| `ChatMessageCitation.index` | `number` | — | no | Inline numbered pill; several sources page through a carousel in the card. |
| `source` | `source` | — | no | Inline numbered pill; several sources page through a carousel in the card. |
| `sources` | `source[]` | — | no | Inline numbered pill; several sources page through a carousel in the card. |
| `ChatMessageCitation.labels` | `{ trigger, carousel, position, previous, next }` | `English copy` | no | Names for the pill, the carousel and its controls. |
| `ChatCitedAnswer.segments` | `segments[]` | `[]` | no | Stable segment IDs, text, sourceIds and optional paragraph breaks; sources add required IDs, prepared date and exact quote highlights. |
| `sources` | `sources[]` | `[]` | no | Stable segment IDs, text, sourceIds and optional paragraph breaks; sources add required IDs, prepared date and exact quote highlights. |
| `ChatCitedAnswer.openSourceId` | `string \| null` | `uncontrolled` | no | One inline source passage, controlled or uncontrolled. |
| `defaultOpenSourceId` | `string \| null` | `null` | no | One inline source passage, controlled or uncontrolled. |
| `onOpenSourceChange` | `callback` | — | no | One inline source passage, controlled or uncontrolled. |
| `ChatCitedAnswer.labels` | `object` | `English copy` | no | Answer, sources, preview, close, copy, copied, copyFailed, open, hint, trigger and selected labels. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { ChatMessageCitation, ChatMessageSources } from '@gaudi/design-system/chat';

<>
<p>
  Readers leave early <ChatMessageCitation index={1} source={sources[0]} /> on long posts
  <ChatMessageCitation index={2} sources={[sources[1], sources[2]]} />.
</p>
<ChatMessageSources sources={sources} />
</>
```

## Accessibility

Citations are buttons named “Source n: title”. The card opens on hover without taking focus, and on click, tap, Enter or Space with focus inside; arrow keys and buttons page the carousel and the position is announced.

## Notes

- Answer linked to evidence uses ChatCitedAnswer to connect passages to sources, with hover/focus emphasis, an inline quote disclosure, copy feedback and Escape focus return. Prepared source content and retrieval remain application-owned.
- See Cited answer on this page for grouped citations [1, 3] beside a SchemaDisplay tool result.

## Examples

- Playground (Storybook `chat-chatsources--playground`)
- Cited answer (Storybook `chat-chatsources--cited-answer`)

Curated patterns:

- Answer linked to evidence — registry item `@gaudi/chat-sources-linked-answer` (uses `ChatAgentMark`, `ChatCitedAnswer`, `ChatMessage`, `ChatMessageContent`, `ChatMessageHeader`)
- Research with citations — registry item `@gaudi/chat-sources-research-citations` (uses `Avatar`, `ChatAgentMark`, `ChatBubble`, `ChatBubbleContent`, `ChatMessage`, `ChatMessageAvatar`, `ChatMessageContent`, `ChatMessageFeedback`, `ChatMessageHeader`, `ChatMessageParts`)

## Related

`core-schemadisplay`

## README

Where an answer came from: numbered inline citations that open a card with the source, and the list of sources under the reply with the same numbers. One citation can group several sources; its card pages through them in a carousel.

### Usage

```jsx
import { ChatMessageCitation, ChatMessageSources } from '@gaudi/design-system/chat';

<p>
  Readers leave early <ChatMessageCitation index={1} source={sources[0]} /> on long posts
  <ChatMessageCitation index={2} sources={[sources[1], sources[2]]} />.
</p>
<ChatMessageSources sources={sources} />
```

In `ChatMessageMarkdown` and `ChatMessageParts`, `[1]` cites one source and `[1, 3]` groups several behind one pill.

### API

| Prop / part | Contract |
| --- | --- |
| `ChatMessageSources.sources` | `{ title, url?, kind?, site?, excerpt?, quote?, icon? }`; collapsed to a count by default. |
| `ChatMessageCitation` | `index` with `source`, or `sources` for several; the pill reads "2 +1" and the card has a carousel. |
| `ChatMessageCitation.labels` | `trigger`, `carousel`, `position`, `previous` and `next` copy. |
| `ChatMessageSource` | One row of the list. |

### Accessibility

Each citation is a button named "Source 1: title" (", and 2 more" when grouped). The card opens on hover for a mouse without taking focus, and on click, tap, Enter or Space with focus inside; Escape closes it. The carousel pages with the arrow keys, its buttons or a swipe, and announces "2 of 3". Links leave the page with clear names.

### Answer linked to evidence

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
