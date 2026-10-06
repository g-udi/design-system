export default {
  "Animations/Backgrounds/GridScan": {
    "description": "A perspective grid corridor illuminated by a traveling scan pulse.",
    "props": [
      [
        "lineWidth",
        "number",
        "1",
        "Grid line thickness, clamped to 0.25\u20133."
      ],
      [
        "scanWidth",
        "number",
        "1.4",
        "Depth of the scan band, clamped to 0.2\u20135."
      ],
      [
        "scanGlow",
        "number",
        "1",
        "Scan brightness, clamped to 0\u20132."
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
        "First CSS color for the lines, second for the scan; omitted colors inherit Gaudi theme tokens."
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
      "Four gridded planes converge into a tunnel. The scan pulse travels through its depth; pointer movement changes the vanishing point. Colors use the first entry for grid lines and the second for the scan.",
      "Visual idea inspired by GridScan from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits source, shaders or assets are included."
    ],
    "usage": "import { GridScan } from '@gaudi/design-system/animations/GridScan';\n\n<GridScan height={500} paused={false} />"
  }
};
