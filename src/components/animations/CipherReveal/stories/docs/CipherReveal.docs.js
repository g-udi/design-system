export default {
  "Animations/Text/CipherReveal": {
    "description": "Scrambled characters resolve progressively into readable text on view, hover or focus.",
    "props": [
      [
        "text",
        "string",
        "\"Ideas into interfaces\"",
        "Text to display. Short phrases work best; long text can wrap."
      ],
      [
        "duration",
        "number",
        "1200",
        "Reveal duration in milliseconds, clamped to 100–10000."
      ],
      [
        "direction",
        "start | end | center",
        "\"start\"",
        "Order in which the original letters are revealed."
      ],
      [
        "trigger",
        "view | hover",
        "\"view\"",
        "Begin on entering view, or wait for hover/focus. Hover and focus can replay either mode."
      ],
      [
        "characterSet",
        "string",
        "\"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\"",
        "Glyphs used for the decorative character rendering. Empty input uses a safe fallback."
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
    "accessibility": "The complete text is exposed once; scrambled characters are hidden from assistive technology. Pausing or reduced motion reveals the complete text. The outer span has no tab stop by default; focus replay applies when it receives focus.",
    "notes": [
      "Visual idea inspired by [Decrypted Text](https://reactbits.dev/text-animations/decrypted-text) from [React Bits](https://reactbits.dev) (MIT + Commons Clause). Independently implemented for Gaudi; no React Bits code or assets are included."
    ],
    "usage": "import { CipherReveal } from '@gaudi/design-system/animations/CipherReveal';\n\n<CipherReveal text=\"Gaudi\" />"
  }
};
