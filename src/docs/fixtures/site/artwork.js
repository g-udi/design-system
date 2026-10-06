// Abstract gradient artwork in the style of the blog's og-card. Every example image uses it; no stock photos.
// Files are numbered so generated lists can pick one with `static/images/art/${n % 12}.svg`.
export const artwork = Array.from({ length: 12 }, (_, index) => `static/images/art/${index}.svg`);
export const [aurora, dusk, lagoon, meadow, ember, iris, rose, sky, sand, mint, peach, slate] = artwork;
