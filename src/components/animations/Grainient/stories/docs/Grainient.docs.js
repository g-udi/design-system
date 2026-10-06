export default {
  "Animations/Backgrounds/Grainient": {
    "description": "A slowly warped three-color gradient with fine animated grain.",
    "props": [
      [
        "grain",
        "number",
        "0.3",
        "Grain strength, clamped to 0\u20131."
      ],
      [
        "warp",
        "number",
        "1",
        "Gradient distortion, clamped to 0\u20133."
      ],
      [
        "contrast",
        "number",
        "1.2",
        "Gradient contrast, clamped to 0.25\u20133."
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
        "Blend strength, clamped to 0\u20132 and visually saturated at 1. Zero reveals the background color."
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
        "false",
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
      "Three continuous color fields blend across the whole container. Grain follows CSS pixels and freezes with the gradient.",
      "Visual idea inspired by Grainient from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits source, shaders or assets are included."
    ],
    "usage": "import { Grainient } from '@gaudi/design-system/animations/Grainient';\n\n<Grainient height={500} paused={false} />"
  }
};
