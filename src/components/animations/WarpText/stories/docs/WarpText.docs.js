export default {
  "Animations/Text/WarpText": {
    "description": "Text gently undulates at rest and bends beneath a moving pointer lens. Hover magnifies a local area, adds a soft ripple and optional RGB refraction, then eases back on exit.",
    "props": [
      [
        "text",
        "string",
        "\"Bend the moment\"",
        "Text to render; newline characters create multiple centered lines."
      ],
      [
        "warpStrength",
        "number",
        "0.08",
        "Ambient distortion, clamped to 0\u20130.25. Set 0 for hover-only warping."
      ],
      [
        "warpScale",
        "number",
        "1.7",
        "Size of the ambient distortion field, clamped to 0.5\u20135."
      ],
      [
        "speed",
        "number",
        "0.55",
        "Ambient and ripple speed, clamped to 0\u20133. Zero holds the field still; pointer interaction remains available."
      ],
      [
        "pointerRadius",
        "number",
        "0.42",
        "Lens radius as a fraction of the container height, clamped to 0.1\u20131."
      ],
      [
        "pointerStrength",
        "number",
        "0.38",
        "Pointer-driven bending and magnification, clamped to 0\u20131. Zero disables the lens."
      ],
      [
        "refraction",
        "number",
        "0.018",
        "RGB edge separation, clamped to 0\u20130.06. Set 0 for a clean lens. Most visible on light text against a dark surface."
      ],
      [
        "ripple",
        "boolean",
        "true",
        "Add a soft radial ripple inside the pointer lens."
      ],
      [
        "paused",
        "boolean",
        "false",
        "Render undistorted text and stop pointer effects and frame updates. Also respects reduced motion, hidden tabs and offscreen containers."
      ],
      [
        "className / style / ref",
        "DOM props",
        "\u2014",
        "Applied to the root. Typography and color are inherited; text shrinks to fit. Set height through style or className."
      ]
    ],
    "accessibility": "The full text is exposed once. The canvas is decorative and does not change the accessible text. Paused and reduced-motion states are undistorted. Touch does not latch hover, and no extra keyboard stop is added for a decorative effect. Provide a pause control for continuous motion.",
    "notes": [
      "Typography and color come from the host. The text texture fits its container and refreshes when fonts or themes change.",
      "WebGL unavailable or lost: the readable HTML text remains visible. Forced colors uses the HTML fallback.",
      "Visual behavior inspired by Warp Text from React Bits. Independently implemented for Gaudi; no upstream source or assets are included."
    ],
    "usage": "import { WarpText } from '@gaudi/design-system/animations/WarpText';\n\n<div style={{ fontSize: 96, fontWeight: 700 }}>\n  <WarpText text=\"Bend the moment\" />\n</div>"
  }
};
