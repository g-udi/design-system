# Loader

A named loading status with eleven CSS animation variants. `Loader` replaces `Spinner`, and the Storybook owner is `Core/Loader`.

```jsx
import { Loader } from '@gaudi/design-system/core/Loader';

<Loader variant='three-dots' size='md' label='Loading articles' />
```

- `variant`: `arc` (default), `dual-arc`, `bar`, `beat`, `bounce`, `circle-dots`, `clip`, `puff`, `three-dots`, `triangle`, or `two-dots`. These indicate an unknown wait; use `Progress` for measured completion.
- `size`: `xs` 12px, `sm` 16px, `md` 20px (default), or `lg` 32px. The bar is three times as wide as it is tall. Other variants are square. Intrinsic dimensions stay fixed across density presets.
- `label`: accessible status label, default `Loading`. Describe the active operation and provide visible status text where useful.
- `className`: use `text-current` to inherit surrounding color or a semantic tone such as `text-text-muted`. Explicit size utilities can override dimensions; preserve the bar's 3:1 ratio.
- SVG attributes and refs pass through. Set `aria-hidden='true'` when a button or containing region already announces the same state.

`LoaderRoot` is the composition primitive: the same variants, `sm` default, current text color, and `aria-label` instead of `label`. `loaderVariants` exports the supported names. All three are available from the root, `core`, and `core/Loader` entries; the leaf also has a default `Loader` export.

Reduced motion stops rotation, travel, scaling, and hopping. The indicator uses Gaudi's slow opacity breath while keeping its status label. The SVG/CSS implementation has no timers, and server rendering is deterministic. Unmount it when work finishes; the host owns loading state, cancellation, errors, and recovery.

Existing button, input, inline-status, overlay, and empty-state examples remain under Loader. Update `Spinner`, `SpinnerRoot`, and `core/Spinner` imports to `Loader`, `LoaderRoot`, and `core/Loader`. The Shadix UI reference informed the variant family; no remote animation code or assets are loaded.
