# GlyphInspector

Inspect animated letter outlines with a gliding frame, floating square particles, measurement guides and a live readout. Hover to take control; drag and release a letter to return it to its slot.

```jsx
import { GlyphInspector } from '@gaudi/design-system/animations/GlyphInspector';

<GlyphInspector text="Gaudi" paused activeIndex={2} />
```

- `text` (string, default "Gaudi"): Text to display. Keep it short enough for the chosen font size.
- `autoplay` (boolean, default true): Step the inspector through the letters while no letter is hovered or held.
- `draggable` (boolean, default true): Allow decorative letters to be lifted a short distance; release returns them to their slot. Does not change the text.
- `readout` (boolean, default true): Show the inspected character, its code point and its measured size (or drag offset) below the frame.
- `guides` (boolean, default true): Draw faint horizontal guides along the top and bottom of the inspected letter across the line.
- `interval` (number, default 900): Milliseconds between automatic steps, clamped to 200–10000 before applying tempo.
- `outline` (dashed | dotted | solid, default "dashed"): Stroke style of the inspected letter outline.
- `accent` (string, default "currentColor"): Color of the frame, guides and readout.
- `particles` (number, default 12): Number of drifting square particles around the frame, rounded and clamped to 0–40. Set 0 to hide them.
- `tempo` (number, default 1): Speed multiplier for automatic inspection, outline tracing and particles, clamped to 0.25–3.
- `reveal` (letter | area | none, default "letter"): Outline the inspected letter, softly reveal nearby letter outlines around the pointer, or keep all letters filled.
- `radius` (number, default 120): Area reveal radius in CSS pixels, clamped to 20–400. Only used with reveal="area".
- `paused` (boolean, default false): Stop motion and dragging while keeping the inspector visible at `activeIndex`, even with `autoplay={false}`. System reduced motion, hidden tabs and offscreen containers also stop motion.
- `activeIndex` (number, default 0): Zero-based character index to inspect when paused. Counts Unicode code points, including spaces. Out-of-range, non-integer or non-finite values fall back to 0. Empty text shows no inspector. Ignored while running.
- `className / style / ref` (DOM props, default —): Applied to the outer span. Typography is inherited.

The complete text is exposed once; decorative letters are hidden from assistive technology. Hover and drag do not change the text. Reduced motion removes animated inspection and dragging; an explicitly paused inspector remains visible without motion. Provide a pause control for continuous autoplay.

Typography is inherited and shrinks to fit the available width. The component reserves space for its particles, readout and bounded drag movement.

Visual idea inspired by [Tech Text](https://reactbits.dev/text-animations/tech-text) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included.
