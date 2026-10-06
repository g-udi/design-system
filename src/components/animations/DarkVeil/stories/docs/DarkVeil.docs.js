export default {
  "Animations/Backgrounds/DarkVeil": {
    "description": "Broad illuminated folds drift across a dark surface, with sharp creases and deep intervening shadows.",
    "props": [
      [
        "paused",
        "boolean",
        "false",
        "Freeze the current frame. Reduced motion, hidden tabs and offscreen surfaces also stop motion."
      ],
      [
        "speed",
        "number",
        "1",
        "Motion multiplier, clamped to 0–5. Zero keeps the current frame still."
      ],
      [
        "intensity",
        "number",
        "1",
        "Strength of the effect, clamped to 0–2. Zero shows only the background color."
      ],
      [
        "scale",
        "number",
        "1",
        "Scale changes the breadth of the folded sheets. When interactive, pointer movement gently offsets the folds. Clamped to 0.25–4."
      ],
      [
        "colors",
        "string[]",
        "Gaudi chart colors 1–3",
        "Up to three CSS colors, including CSS variables. Omitted colors use the current Gaudi palette."
      ],
      [
        "background",
        "string",
        "var(--ds-color-surface)",
        "Base CSS color beneath the effect. Follows the current theme by default."
      ],
      [
        "interactive",
        "boolean",
        "false",
        "Let pointer movement influence the decorative effect. No interaction is needed to use the content."
      ],
      [
        "height",
        "number | string",
        "360",
        "Surface height in pixels or a CSS length. Numeric values are clamped to 1–4096."
      ],
      [
        "children",
        "ReactNode",
        "—",
        "Optional content rendered above the decorative canvas. Keep text and controls on a contrasting surface."
      ],
      [
        "className / style / ref",
        "DOM props",
        "—",
        "Applied to the outer div along with other DOM props and pointer handlers."
      ]
    ],
    "accessibility": "The canvas is decorative and hidden from assistive technology; children remain accessible. Reduced motion shows a still frame, and unavailable graphics use a static color fallback. Provide a visible pause control when motion continues beside meaningful content. Keep text contrast independent of the moving artwork.",
    "notes": [
      "The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.",
      "Smooth, asymmetric sheets gather light along their creases and remain dark on the opposite side.",
      "Visual idea inspired by Dark Veil from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included."
    ],
    "usage": "import { DarkVeil } from '@gaudi/design-system/animations/DarkVeil';\n\n<DarkVeil height={360} paused />"
  }
};
