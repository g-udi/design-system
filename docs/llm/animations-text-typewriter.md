# Typewriter

> Animations/Text/Typewriter · animations · `@gaudi/design-system/animations/Typewriter`

Types, pauses and deletes a sequence of phrases while reserving space for the longest one.

## Import

```js
import Typewriter from '@gaudi/design-system/animations/Typewriter';
// also: import { … } from '@gaudi/design-system/animations';
```

Exports: `Typewriter`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `texts` | `string[]` | `["Make something memorable.", "Make it yours."]` | no | Phrases to display in order. All phrases are included once in the accessible text. |
| `typeDelay` | `number` | `80` | no | Milliseconds between typed characters, 16–3000. |
| `eraseDelay` | `number` | `40` | no | Milliseconds between deleted characters, 16–3000. |
| `holdDelay` | `number` | `1600` | no | Milliseconds to hold the complete phrase, 100–30000. |
| `repeat` | `boolean` | `true` | no | Repeat the phrases; false leaves the final sentence visible. |
| `caret` | `boolean` | `true` | no | Show a caret; it blinks only while animation is enabled. |
| `paused` | `boolean` | `false` | no | Stop nonessential motion. System reduced motion, hidden tabs and offscreen containers also stop it. |
| `className / style / ref` | `DOM props` | — | no | Applied to the outer span. Typography is inherited. |

## Usage

```jsx
import { Typewriter } from '@gaudi/design-system/animations/Typewriter';

<Typewriter texts={["Create", "Explore"]} />
```

## Accessibility

All phrases are exposed once as stable text, without a live region. Reduced motion shows the complete current phrase. Pausing freezes the current typed fragment. Provide a pause control for repeating sequences.

## Notes

- Visual idea inspired by [Text Type](https://reactbits.dev/text-animations/text-type) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.

## Examples

- Playground (Storybook `animations-typewriterwriter--playground`)
- One sentence (Storybook `animations-typewriterwriter--variant`)

## README

Types, pauses and deletes a sequence of phrases while reserving space for the longest one.

```jsx
import { Typewriter } from '@gaudi/design-system/animations/Typewriter';

<Typewriter texts={["Create", "Explore"]} />
```

- `texts` (string[], default ["Make something memorable.", "Make it yours."]): Phrases to display in order. All phrases are included once in the accessible text.
- `typeDelay` (number, default 80): Milliseconds between typed characters, 16–3000.
- `eraseDelay` (number, default 40): Milliseconds between deleted characters, 16–3000.
- `holdDelay` (number, default 1600): Milliseconds to hold the complete phrase, 100–30000.
- `repeat` (boolean, default true): Repeat the phrases; false leaves the final sentence visible.
- `caret` (boolean, default true): Show a caret; it blinks only while animation is enabled.
- `paused` (boolean, default false): Stop nonessential motion. System reduced motion, hidden tabs and offscreen containers also stop it.
- `className / style / ref` (DOM props, default —): Applied to the outer span. Typography is inherited.

All phrases are exposed once as stable text, without a live region. Reduced motion shows the complete current phrase. Pausing freezes the current typed fragment. Provide a pause control for repeating sequences.

Visual idea inspired by [Text Type](https://reactbits.dev/text-animations/text-type) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.
