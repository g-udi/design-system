# ChatActivityIndicator

> Chat/ChatActivityIndicator · chat · `@gaudi/design-system/chat/ChatActivityIndicator`

What the assistant is doing: idle, thinking, streaming, tool, done or error.

## Import

```js
import ChatActivityIndicator from '@gaudi/design-system/chat/ChatActivityIndicator';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatActivityIndicator`, `activityStates`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `state` | `idle \| thinking \| streaming \| tool \| done \| error` | `idle` | no | Current activity. |
| `variant` | `inline \| badge \| compact` | `inline` | no | Inline mark, corner badge, or neutral thinking chip with a ray spinner and shimmering label. |
| `showLabel` | `boolean` | `compact: true; otherwise false` | no | Visible label beside the mark. Compact label changes enter gently; reduced motion switches instantly. |
| `labels` | `object` | — | no | Copy per state, and hiding. |
| `decorative` | `boolean` | — | no | Copy per state, and hiding. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `state`: `idle`, `thinking`, `streaming`, `tool`, `done`, `error`
- `variant`: `inline`, `badge`, `compact`

## Usage

```jsx
import { ChatActivityIndicator } from '@gaudi/design-system/chat';

<>
<ChatActivityIndicator state='thinking' showLabel />
<ChatActivityIndicator state='done' variant='badge' />
<ChatActivityIndicator state='thinking' variant='compact' />
</>
```

## Accessibility

A polite status; motion slows to a fade for reduced motion.

## Examples

Curated patterns:

- Playground — registry item `@gaudi/activity-indicator-playground` (uses `ChatActivityIndicator`)
- A reply from thinking to done — registry item `@gaudi/activity-indicator-reply-lifecycle` (uses `Button`, `ChatActivityIndicator`)

## README

What the assistant is doing right now: idle, thinking, streaming, tool, done or error. Busy states move; settled states hold still and show an icon.

### Usage

```jsx
import { ChatActivityIndicator } from '@gaudi/design-system/chat';

<ChatActivityIndicator state='thinking' showLabel />
<ChatActivityIndicator state='done' variant='badge' />
<ChatActivityIndicator state='thinking' variant='compact' labels={{ thinking: 'Reading sources' }} />
```

### API

| Prop / part | Contract |
| --- | --- |
| `state` | idle, thinking, streaming, tool, done or error (`activityStates`). |
| `variant` | inline, badge for the corner of a mark or avatar, or compact for a neutral thinking chip. |
| `showLabel` / `labels` | Visible by default for compact; hidden by default otherwise. Supply copy per state through labels. |
| `decorative` | Hides it when nearby text names the state. |

The compact variant reuses Core Loader’s eight-ray spinner and Skeleton’s Shimmer. Labels enter gently when they change; done and error show static icons. Long labels wrap within the available width. The host owns phase progression and completion; no timers or invented activity run inside the component. See the Mini thinking example under ChatReasoning for a prepared reply.

### Accessibility

A polite status region, so each change is announced once. With reduced motion the dots fade slowly instead of moving; the state never depends on motion or colour alone. Compact stops its spinner, shimmer and label travel entirely under reduced motion. Its icon is decorative so the live region announces each label only once.
