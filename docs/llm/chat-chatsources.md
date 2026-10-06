# ChatSources

> Chat/ChatSources · chat · `@gaudi/design-system/chat/ChatSources`

Numbered citations that open a hover card (with a carousel when one marker cites several sources) and the list of sources under a reply.

## Import

```js
import ChatSources from '@gaudi/design-system/chat/ChatSources';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatMessageCitation`, `ChatMessageSource`, `ChatMessageSources`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `n sources` | no | Toggle label for the list. |
| `defaultOpen` | `boolean` | `false` | no | Initial disclosure. |
| `sources` | `Array<{ title, url?, kind?, site?, excerpt?, quote?, icon? }>` | `[]` | no | Sources in citation order. |
| `ChatMessageCitation.index / source / sources` | `number / source / source[]` | — | no | Inline numbered pill; several sources page through a carousel in the card. |
| `ChatMessageCitation.labels` | `{ trigger, carousel, position, previous, next }` | `English copy` | no | Names for the pill, the carousel and its controls. |
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

- See Cited answer on this page for grouped citations [1, 3] beside a SchemaDisplay tool result.

## Examples

- Playground (Storybook `chat-chatsources--playground`)
- Cited answer (Storybook `chat-chatsources--cited-answer`)

Curated patterns:

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
