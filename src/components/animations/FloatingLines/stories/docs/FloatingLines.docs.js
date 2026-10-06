export default {
  "Animations/Backgrounds/FloatingLines": {
    "description": "Three layered families of glowing lines cross the surface and bend around the pointer.",
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
        "Scale changes the sweep of the curves and the pointer lens. Clamped to 0.25–4."
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
        "true",
        "Bend nearby line families around the pointer, with a smooth return on leave. No interaction is needed to use the content."
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
      "Eight curves in each family converge and separate at different angles and brightnesses. The local pointer lens relaxes smoothly after the pointer leaves.",
      "Visual idea inspired by Floating Lines from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included."
    ],
    "usage": "import { FloatingLines } from '@gaudi/design-system/animations/FloatingLines';\n\n<FloatingLines height={360} paused />"
  }
};
