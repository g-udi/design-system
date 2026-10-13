export default {
  "Animations/Text/PhraseCycle": {
    "description": "A sequence of phrases rotates vertically in a stable space, without moving the surrounding line.",
    "props": [
      [
        "texts",
        "string[]",
        "[\"thoughtfully\", \"boldly\", \"together\"]",
        "Phrases to display in order. All phrases are included once in the accessible text."
      ],
      [
        "interval",
        "number",
        "2200",
        "Milliseconds between phrase changes, clamped to 700–30000. Each transition uses the focal motion duration (560 ms)."
      ],
      [
        "direction",
        "up | down",
        "\"up\"",
        "Direction of the vertical transition."
      ],
      [
        "paused",
        "boolean",
        "false",
        "Stop nonessential motion. System reduced motion, hidden tabs and offscreen containers also stop it."
      ],
      [
        "className / style / ref",
        "DOM props",
        "—",
        "Applied to the outer span. Typography is inherited."
      ]
    ],
    "accessibility": "All phrases are exposed once as stable text, without a live region. Reduced motion shows the first phrase. Pausing keeps the current phrase visible. Provide a pause control for continuous cycling.",
    "notes": [
      "Visual idea inspired by [Rotating Text](https://reactbits.dev/text-animations/rotating-text) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included."
    ],
    "usage": "import { PhraseCycle } from '@gaudi/design-system/animations/PhraseCycle';\n\n<PhraseCycle texts={[\"Create\", \"Explore\"]} />"
  }
};
