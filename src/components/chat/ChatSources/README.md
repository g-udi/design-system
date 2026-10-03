# ChatSources

Where an answer came from: numbered inline citations that open a card with the source, and the list of sources under the reply with the same numbers. One citation can group several sources; its card pages through them in a carousel.

## Usage

```jsx
import { MessageCitation, MessageSources } from '@gaudi/design-system/chat';

<p>
  Readers leave early <MessageCitation index={1} source={sources[0]} /> on long posts
  <MessageCitation index={2} sources={[sources[1], sources[2]]} />.
</p>
<MessageSources sources={sources} />
```

In `MessageMarkdown` and `MessageParts`, `[1]` cites one source and `[1, 3]` groups several behind one pill.

## API

| Prop / part | Contract |
| --- | --- |
| `MessageSources.sources` | `{ title, url?, kind?, site?, excerpt?, quote?, icon? }`; collapsed to a count by default. |
| `MessageCitation` | `index` with `source`, or `sources` for several; the pill reads "2 +1" and the card has a carousel. |
| `MessageCitation.labels` | `trigger`, `carousel`, `position`, `previous` and `next` copy. |
| `MessageSource` | One row of the list. |

## Accessibility

Each citation is a button named "Source 1: title" (", and 2 more" when grouped). The card opens on hover for a mouse without taking focus, and on click, tap, Enter or Space with focus inside; Escape closes it. The carousel pages with the arrow keys, its buttons or a swipe, and announces "2 of 3". Links leave the page with clear names.
