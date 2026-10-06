export default {
  "Animations/Backgrounds/Hyperspeed": {
    "description": "Paired light trails travel along a curving road and accelerate while the background is held.",
    "props": [
      [
        "curvature",
        "number",
        "1",
        "Road bend strength, clamped to 0\u20132."
      ],
      [
        "trailLength",
        "number",
        "1.5",
        "Light trail length, clamped to 0.25\u20134."
      ],
      [
        "paused",
        "boolean",
        "false",
        "Freeze the current frame. Reduced motion, offscreen containers and hidden tabs also stop animation."
      ],
      [
        "speed",
        "number",
        "1",
        "Animation speed multiplier, clamped to 0\u20135. Zero holds a static frame."
      ],
      [
        "intensity",
        "number",
        "1",
        "Effect strength, clamped to 0\u20132. Zero reveals the background color."
      ],
      [
        "scale",
        "number",
        "1",
        "Spatial scale of the effect, clamped to 0.25\u20134."
      ],
      [
        "colors",
        "string[]",
        "Gaudi theme tokens",
        "Up to three CSS colors. Omitted colors inherit the current Gaudi palette."
      ],
      [
        "background",
        "string",
        "var(--ds-color-surface)",
        "CSS color behind the effect and its static fallback."
      ],
      [
        "interactive",
        "boolean",
        "true",
        "Let pointer position influence the effect without capturing clicks or scrolling."
      ],
      [
        "height",
        "number | string",
        "360",
        "Container height in pixels or a CSS length. Numeric values are clamped to 1\u20134096; width fills the available container."
      ],
      [
        "children",
        "ReactNode",
        "\u2014",
        "Optional semantic content layered above the decorative canvas."
      ],
      [
        "className / style / ref / DOM props",
        "DOM props",
        "\u2014",
        "Forwarded to the outer container."
      ]
    ],
    "accessibility": "The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.",
    "notes": [
      "The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.",
      "Two opposing streams of paired lights follow a perspective road. Hold a non-interactive part of the background to accelerate smoothly; releasing slows it down without jumping its position. Use speed for a keyboard-accessible or controlled alternative.",
      "Visual idea inspired by Hyperspeed from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits source, shaders or assets are included."
    ],
    "usage": "import { Hyperspeed } from '@gaudi/design-system/animations/Hyperspeed';\n\n<Hyperspeed height={500} paused={false} />"
  }
};
