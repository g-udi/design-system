# ChatActivityHistory

> Chat/ChatActivityHistory · chat · `@gaudi/design-system/chat/ChatActivityHistory`

What happened in a conversation, newest last.

## Import

```js
import ChatActivityHistory from '@gaudi/design-system/chat/ChatActivityHistory';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatActivity`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `Activity` | no | Region name. |
| `details` | `boolean` | `true` | no | Example only: shows item details. |
| `items` | `Array<{ id, title, time, detail?, status?, icon? }>` | `[]` | no | History rows. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { ChatActivity } from '@gaudi/design-system/chat';

<ChatActivity items={[{ id: '1', time: '09:12', title: 'Searched the archive', icon: 'Search' }]} />
```

## Accessibility

A labelled region with a heading.

## Examples

- Playground (Storybook `chat-chatactivityhistory--playground`)

## README

What happened in a conversation, newest last: searches, handoffs, files and failures, on a neutral Timeline rail.

### Usage

```jsx
import { ChatActivity } from '@gaudi/design-system/chat';

<ChatActivity items={[{ id: '1', time: '09:12', title: 'Searched the archive', icon: 'Search' }]} />
```

### API

| Prop / part | Contract |
| --- | --- |
| `items` | `{ id, title, time, detail?, status?, icon? }`. |
| `title` | Names the region. |

### Accessibility

A labelled region with a heading. Status icons are paired with the row text.
