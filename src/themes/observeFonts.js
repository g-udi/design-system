/** Canvas `font` shorthand for a computed style, optionally at another size. */
export const canvasFont = (style, size = style.fontSize) => `${style.fontStyle} ${style.fontWeight} ${size} ${style.fontFamily}`;

/** Run `onChange` once document fonts are ready and whenever a font finishes loading. Returns cleanup. */
export function observeFonts(onChange) {
  const fonts = typeof document === 'undefined' ? undefined : document.fonts;
  if (!fonts) return () => {};
  fonts.ready.then(onChange);
  fonts.addEventListener('loadingdone', onChange);
  return () => fonts.removeEventListener('loadingdone', onChange);
}
