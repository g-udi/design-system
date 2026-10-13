export default {
  "Animations/Backgrounds/Particle Sea": {
    "description": "A rolling sea of fine points seen in perspective; crests catch the light and glitter.",
    "props": [
      [
        "waveHeight",
        "number",
        "1",
        "Swell height, clamped to 0–2. Higher seas light more crests."
      ],
      [
        "density",
        "number",
        "1",
        "Points per unit of water, clamped to 0.25–2."
      ],
      [
        "horizon",
        "number",
        "0.75",
        "Horizon position from the bottom of the container, clamped to 0.3–1. The area above it shows the background."
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
        "Animation speed multiplier, clamped to 0–5. Zero holds a static frame."
      ],
      [
        "intensity",
        "number",
        "1",
        "Brightness of the lit points, clamped to 0–2. Zero reveals the background color."
      ],
      [
        "scale",
        "number",
        "1",
        "Spatial scale of the sea, clamped to 0.25–4."
      ],
      [
        "colors",
        "string[]",
        "Gaudi theme tokens",
        "Up to three CSS colors for the points. Omitted colors inherit the current Gaudi palette."
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
        "Lift the sea under the pointer without capturing clicks or scrolling."
      ],
      [
        "height",
        "number | string",
        "360",
        "Container height in pixels or a CSS length. Numeric values are clamped to 1–4096; width fills the available container."
      ],
      [
        "children",
        "ReactNode",
        "—",
        "Optional semantic content layered above the decorative canvas."
      ],
      [
        "className / style / ref / DOM props",
        "DOM props",
        "—",
        "Forwarded to the outer container."
      ]
    ],
    "accessibility": "The canvas is decorative and hidden from assistive technology. Keep important content in children and provide a pause control for continuous animation. Reduced motion renders a static frame; unsupported WebGL retains the styled container and content.",
    "notes": [
      "The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.",
      "Points are spaced evenly across the water, so they shrink and crowd towards the horizon. Only crests are lit, and each point twinkles on its own phase. Points too small to resolve fade out instead of shimmering."
    ],
    "usage": "import { ParticleSea } from '@gaudi/design-system/animations/ParticleSea';\n\n<ParticleSea height={500} waveHeight={1.2} colors={['var(--ds-color-warning)']} />"
  }
};
