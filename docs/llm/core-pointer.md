# Pointer

> Core/Pointer · core · `@gaudi/design-system/core/Pointer`

A pointer effect scoped to its container, with direct, spring and lazy tracking, hover feedback, and native input fallbacks.

## Import

```js
import { Pointer } from '@gaudi/design-system/core/Pointer';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Pointer`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `dot \| ring \| frame \| label` | `frame` | no | Follower appearance. Ring and frame keep a precise dot at the actual pointer; label places a hint beside it. |
| `tracking` | `direct \| spring \| lazy` | `lazy` | no | Immediate movement, a responsive spring, or a slower trailing frame. |
| `tone` | `neutral \| accent` | `neutral` | no | Theme-aware foreground or accent color. |
| `label` | `string` | `Explore` | no | Default label for the label variant. A descendant data-pointer-label overrides it while hovered. |
| `hideCursor` | `boolean` | `true` | no | Hides the native cursor only while the effect is active inside this container. |
| `disabled` | `boolean` | `false` | no | Turns off the decorative effect. Descendant controls stay usable. |
| `data-pointer-native` | `HTML attribute on descendants` | — | no | Opt any subtree into the native cursor, for example selectable article text. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `dot`, `ring`, `frame`, `label`
- `tracking`: `direct`, `spring`, `lazy`
- `tone`: `neutral`, `accent`

## Usage

```jsx
import { Pointer, Button } from '@gaudi/design-system';

<Pointer variant='frame' tracking='lazy' className='min-h-80 p-8'>
  <Button>Explore work</Button>
</Pointer>
```

## Accessibility

The overlay is aria-hidden and never captures pointer events. Touch, pen, reduced motion, editable fields, keyboard use, and disabled effects retain the native cursor. Give every action its normal visible label; pointer text is supplementary. No global cursor styles are changed.

## Examples

- Playground (Storybook `core-pointer--playground`)
- Direct, spring and lazy (Storybook `core-pointer--tracking`)
- Contextual labels (Storybook `core-pointer--labels`)
- Inputs and native fallbacks (Storybook `core-pointer--native-fallbacks`)

## README

A decorative pointer scoped to a container. It supplies direct, spring, and lazy tracking with dot, ring, corner-frame, and contextual-label variants.

```jsx
import { Pointer, Button } from '@gaudi/design-system';

<Pointer variant='frame' tracking='lazy' className='min-h-80 p-8'>
  <Button>Explore work</Button>
</Pointer>
```

Also available from `@gaudi/design-system/core/Pointer`. Load Gaudi's stylesheet once. `tone` is `neutral` or `accent`; `hideCursor={false}` keeps the native cursor beside the effect. `disabled` turns off the decoration without disabling the content. The forwarded ref and DOM props belong to the container. A cancelled pointer enter/move handler prevents that event from moving the follower.

For `variant='label'`, supply a default `label` and optional `data-pointer-label='View project'` on individual targets. Keep a visible accessible label on each action; the pointer label is only a decoration. Set `data-pointer-native` on selectable text or any region that should retain its native cursor. Inputs, textareas, selects, and editable content do this automatically.

The follower appears only after a real mouse enters. Touch, pen, reduced motion, window blur, scrolling, and keyboard use hide it and restore the native cursor. The overlay is clipped to its container, is hidden from assistive technology, and never intercepts clicks. Springs settle when movement stops and are stopped on exit; listeners are cleaned up on unmount. Nested followers have independent scopes.

The lazy frame revisits the dot-and-corner-frame behavior of an earlier website cursor by the same author. The motion references are [Asterisk](https://www.withasterisk.com/) and [Skiper UI's mouse-follow examples](https://skiper-ui.com/v1/skiper61). Gaudi uses its existing Motion dependency, shared hooks, icons, and tokens; no Skiper or Asterisk source or remote assets are included.
