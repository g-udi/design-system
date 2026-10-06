export default {
  "Animations/Backgrounds/GradientWaves": {
    "description": "Broad, softly lit swells roll toward a hazy horizon, with atmospheric depth and subtle pointer parallax.",
    "props": [
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
        "Effect strength, clamped to 0–2. Zero reveals the background color."
      ],
      [
        "scale",
        "number",
        "1",
        "Spatial scale of the effect, clamped to 0.25–4."
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
      "The shader traces a continuous height field with broad foreground swells. Surface lighting and distance haze soften receding crests; pointer movement subtly shifts the viewpoint.",
      "Visual idea inspired by Gradient Waves from React Bits (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits source, shaders or assets are included."
    ],
    "usage": "import { GradientWaves } from '@gaudi/design-system/animations/GradientWaves';\n\n<GradientWaves height={360} paused={false} />"
  }
};
