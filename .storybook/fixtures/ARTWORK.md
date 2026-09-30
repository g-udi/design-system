# Example artwork

Every example image that isn't a person uses abstract gradient artwork in the style of the blog's
`og-card.jpg`: covers, thumbnails, galleries and backgrounds. People always keep real portraits
(see [PORTRAITS.md](./PORTRAITS.md)); avatar fallbacks use the same gradient shades as their tones.

- Twelve fields live in `.storybook/public/static/images/art/0.svg` to `11.svg`. They are soft
  linear bases with blurred colour blooms: aurora, dusk, lagoon, meadow, ember, iris, rose, sky,
  sand, mint, peach and slate, in that order.
- Each SVG uses `preserveAspectRatio='xMidYMid slice'`, so it crops cleanly to any frame.
- Stories import names from `.storybook/fixtures/site/artwork.js`. Copyable fixtures reference
  paths directly (`static/images/art/3.svg`), and generated lists pick one with
  `` `static/images/art/${index % 12}.svg` ``.

Names, roles and handles in the examples are fictional demo data. Initials, colour surfaces,
workspace marks and deliberate image failures remain explicit fallback demonstrations.
Applications supply their own image URLs; the components never choose an image provider.
