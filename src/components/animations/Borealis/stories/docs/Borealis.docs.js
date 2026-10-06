export default {
  "Animations/Backgrounds/Aurora": {
    "description": "Theme-aware Aurora light curtains, with a Soft Aurora variant that forms a narrow glowing ribbon.",
    "props": [
      [
        "variant",
        "\"aurora\" | \"soft\"",
        "aurora",
        "Top-lit curtains or a soft horizontal ribbon. Unknown values fall back to aurora."
      ],
      [
        "amplitude",
        "number",
        "1",
        "Height variation of the light, clamped to 0\u20132."
      ],
      [
        "blend",
        "number",
        "0.5",
        "Softness of the glow, clamped to 0\u20131."
      ],
      [
        "fadeEdges",
        "boolean",
        "true",
        "Fade the decorative layer into the page at its lower edge."
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
        "height",
        "number | string",
        "content / viewport",
        "Optional fixed height in pixels or CSS length. Without it, the existing page wrapper grows with content and fills at least the viewport; decoration is capped at 48rem."
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
      "Borealis remains the public component name. Existing layout imports, direct children, outer ref, and page layout are preserved. Soft Aurora is selected with variant=\"soft\".",
      "Visual ideas inspired by React Bits Aurora and Soft Aurora (MIT + Commons Clause). Independently authored for Gaudi; no upstream source, shaders or assets are included."
    ],
    "usage": "import Borealis from '@gaudi/design-system/animations/Borealis';\n\n<Borealis variant=\"soft\" height={500}>{content}</Borealis>"
  }
};
