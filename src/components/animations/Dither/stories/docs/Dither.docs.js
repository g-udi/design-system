export default {
  "Animations/Backgrounds/Dither": {
    "description": "Flowing waves rendered with ordered dithering and a limited tonal palette.",
    "props": [
      [
        "pixelSize",
        "number",
        "2",
        "Dither pixel size in CSS pixels, clamped to 1\u20138."
      ],
      [
        "levels",
        "number",
        "3",
        "Number of tonal levels, rounded and clamped to 2\u20138."
      ],
      [
        "amplitude",
        "number",
        "1",
        "Wave displacement, clamped to 0\u20132."
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
        "The first CSS color supplies the tint; omitted colors inherit Gaudi theme tokens."
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
      "An 8\u00d78 ordered threshold pattern quantizes a continuous wave field. The first colors entry supplies its tint; background supplies the other end of the tonal range. Pointer movement reveals a brighter local region.",
      "Visual idea inspired by Dither from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits source, shaders or assets are included."
    ],
    "usage": "import { Dither } from '@gaudi/design-system/animations/Dither';\n\n<Dither height={500} paused={false} />"
  }
};
