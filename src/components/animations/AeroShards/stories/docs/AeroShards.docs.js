export default {
  "Animations/Backgrounds/AeroShards": {
    "description": "Faceted shards flow through a curved stream in layers of depth. Hold the pointer to gather the stream, then release to unfurl it.",
    "props": [
      [
        "paused",
        "boolean",
        "false",
        "Freeze the current frame. Reduced motion, hidden tabs and offscreen containers also stop animation."
      ],
      [
        "speed",
        "number",
        "1",
        "Playback multiplier from 0 to 5. Zero freezes time."
      ],
      [
        "intensity",
        "number",
        "1",
        "Visibility of the shards, clamped to 0–2. Zero shows only the background color."
      ],
      [
        "scale",
        "number",
        "1",
        "Spatial scale from 0.25 to 4. Larger values produce larger details."
      ],
      [
        "colors",
        "string[]",
        "Gaudi theme colors",
        "Up to three CSS colors. Omit to follow the current Gaudi theme."
      ],
      [
        "background",
        "string",
        "var(--ds-color-surface)",
        "CSS color behind the effect, also used by the static fallback."
      ],
      [
        "interactive",
        "boolean",
        "true",
        "The pointer repels nearby shards. Press and hold to gather a rotating cloud; release to unfurl. Input stops while paused."
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
        "Accessible foreground content layered above the decorative canvas."
      ],
      [
        "className / style / ref",
        "DOM props",
        "—",
        "Applied to the outer div. Standard DOM attributes and handlers are forwarded."
      ]
    ],
    "accessibility": "The canvas is decorative and hidden from assistive technology. Foreground children remain readable and interactive. Provide a pause control for continuous motion, and place text on a contrasting surface. Reduced motion displays a still frame; unavailable WebGL uses a static color fallback.",
    "notes": [
      "The playground layers a Gaudi header, hero and working documentation links above the effect. The Demo content switch hides only this foreground; canvas size, animation phase and pause state are retained.",
      "Shard size varies with depth. Hold/release changes the stream envelope without resetting its retained phase.",
      "Visual idea inspired by AeroShards from React Bits. Independently implemented for Gaudi from the rendered visual reference; no React Bits source code, shaders or assets are included."
    ],
    "usage": "import { AeroShards } from '@gaudi/design-system/animations/AeroShards';\n\n<AeroShards height={500} paused={paused} />"
  }
};
