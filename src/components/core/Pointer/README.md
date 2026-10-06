# Pointer

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
