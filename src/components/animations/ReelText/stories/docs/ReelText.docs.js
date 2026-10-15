export default {
  "Animations/Text/ReelText": {
    "description": "A formatted value whose digits spin into place on slot-machine reels, landing left to right.",
    "props": [
      ["value", "string | number", "\"\"", "The value to show, already formatted. Digits become reels; every other character stays fixed."],
      ["duration", "number", "900", "Milliseconds the first reel takes to land, clamped to 0–4000."],
      ["stagger", "number", "70", "Milliseconds between consecutive reels landing, left to right, clamped to 0–400."],
      ["paused", "boolean", "false", "Swap values without motion. System reduced motion, hidden tabs and offscreen containers do the same."],
      ["className / style / ref", "DOM props", "—", "Applied to the outer span. Typography is inherited."]
    ],
    "accessibility": "The root is one image named with the whole value; the reels are hidden, so the value is read once and never digit by digit. Reduced motion swaps values instantly.",
    "notes": [
      "Motion inspired by [Slot text](https://uiarc.dev/components/slot-text) from Arc. Independently implemented for Gaudi; no Arc code or assets are included."
    ],
    "usage": "import { ReelText } from '@gaudi/design-system/animations/ReelText';\n\n<ReelText value=\"$31,904\" />"
  }
};
