# ChatActivityHistory

What happened in a conversation, newest last: searches, handoffs, files and failures, on a neutral Timeline rail.

## Usage

```jsx
import { ChatActivity } from '@gaudi/design-system/chat';

<ChatActivity items={[{ id: '1', time: '09:12', title: 'Searched the archive', icon: 'Search' }]} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `items` | `{ id, title, time, detail?, status?, icon? }`. |
| `title` | Names the region. |

## Accessibility

A labelled region with a heading. Status icons are paired with the row text.
