# CipherReveal

> Animations/Text/CipherReveal · animations · `@gaudi/design-system/animations/CipherReveal`

Scrambled characters resolve progressively into readable text on view, hover or focus.

## Import

```js
import CipherReveal from '@gaudi/design-system/animations/CipherReveal';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `CipherReveal`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `text` | `string` | `"Ideas into interfaces"` | no | Text to display. Short phrases work best; long text can wrap. |
| `duration` | `number` | `1200` | no | Reveal duration in milliseconds, clamped to 100–10000. |
| `direction` | `start \| end \| center` | `"start"` | no | Order in which the original letters are revealed. |
| `trigger` | `view \| hover` | `"view"` | no | Begin on entering view, or wait for hover/focus. Hover and focus can replay either mode. |
| `characterSet` | `string` | `"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"` | no | Glyphs used for the decorative character rendering. Empty input uses a safe fallback. |
| `paused` | `boolean` | `false` | no | Stop nonessential motion. System reduced motion, hidden tabs and offscreen containers also stop it. |
| `className / style / ref` | `DOM props` | — | no | Applied to the outer span. Typography is inherited. |

## Variants

- `direction`: `start`, `end`, `center`
- `trigger`: `view`, `hover`

## Usage

```jsx
import { CipherReveal } from '@gaudi/design-system/animations/CipherReveal';

<CipherReveal text="Gaudi" />
```

## Accessibility

The complete text is exposed once; scrambled characters are hidden from assistive technology. Pausing or reduced motion reveals the complete text. The outer span has no tab stop by default; focus replay applies when it receives focus.

## Notes

- Visual idea inspired by [Decrypted Text](https://reactbits.dev/text-animations/decrypted-text) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

## Examples

- Playground (Storybook `animations-text-cipherreveal--playground`)
- Reveal from the center (Storybook `animations-text-cipherreveal--variant`)

## README

Scrambled characters resolve progressively into readable text on view, hover or focus.

```jsx
import { CipherReveal } from '@gaudi/design-system/animations/CipherReveal';

<CipherReveal text="Gaudi" />
```

- `text` (string, default "Ideas into interfaces"): Text to display. Short phrases work best; long text can wrap.
- `duration` (number, default 1200): Reveal duration in milliseconds, clamped to 100–10000.
- `direction` (start | end | center, default "start"): Order in which the original letters are revealed.
- `trigger` (view | hover, default "view"): Begin on entering view, or wait for hover/focus. Hover and focus can replay either mode.
- `characterSet` (string, default "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"): Glyphs used for the decorative character rendering. Empty input uses a safe fallback.
- `paused` (boolean, default false): Stop nonessential motion. System reduced motion, hidden tabs and offscreen containers also stop it.
- `className / style / ref` (DOM props, default —): Applied to the outer span. Typography is inherited.

The complete text is exposed once; scrambled characters are hidden from assistive technology. Pausing or reduced motion reveals the complete text. The outer span has no tab stop by default; focus replay applies when it receives focus.

Visual idea inspired by [Decrypted Text](https://reactbits.dev/text-animations/decrypted-text) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.
