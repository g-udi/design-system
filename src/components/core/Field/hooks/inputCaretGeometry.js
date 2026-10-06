// Mirror the browser's text layout, including wrapping, ligatures, tabs and alignment.
// Passwords and bidirectional text retain the native caret; no masked value is copied.
const textTypes = new Set(['text', 'search', 'url', 'tel']);
const bidiText = /[\u0590-\u08ff\u200e\u200f\u202a-\u202e\u2066-\u2069\ufb1d-\ufdff\ufe70-\ufeff]/;
const textStyles = [
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontStretch',
  'fontVariant', 'fontFeatureSettings', 'fontVariationSettings', 'fontKerning',
  'letterSpacing', 'wordSpacing', 'lineHeight', 'textAlign', 'textIndent',
  'textTransform', 'tabSize', 'wordBreak', 'overflowWrap', 'textRendering',
];

export function canSmoothCaret(input, style) {
  return (input.tagName === 'TEXTAREA' || (input.tagName === 'INPUT' && textTypes.has(input.type)))
    && !input.disabled && !input.readOnly && !input.hidden
    && input.selectionStart != null && input.selectionStart === input.selectionEnd
    && style.direction !== 'rtl' && style.writingMode === 'horizontal-tb'
    && !bidiText.test(input.value);
}

export function measureInputCaret(input, mirror, style) {
  const multiline = input.tagName === 'TEXTAREA';
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingRight = parseFloat(style.paddingRight) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const paddingBottom = parseFloat(style.paddingBottom) || 0;
  const width = input.clientWidth - paddingLeft - paddingRight;
  const height = input.clientHeight - paddingTop - paddingBottom;
  if (width <= 0 || height <= 0) return null;
  for (const property of textStyles) mirror.style[property] = style[property];
  mirror.style.width = `${width}px`;
  mirror.style.whiteSpace = multiline && input.wrap !== 'off' ? 'pre-wrap' : 'pre';
  mirror.style.overflowWrap = multiline ? style.overflowWrap || 'break-word' : 'normal';
  // A terminal zero-width space gives an empty field or final newline a line box.
  mirror.textContent = `${input.value}\u200b`;
  const range = input.ownerDocument.createRange();
  const index = Math.min(input.selectionStart, input.value.length);
  range.setStart(mirror.firstChild, index);
  range.collapse(true);
  const rect = range.getClientRects()[0];
  if (!rect?.height) return null;
  const origin = mirror.getBoundingClientRect();
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
  return {
    x: rect.left - origin.left - input.scrollLeft,
    y: rect.top - origin.top - input.scrollTop + (multiline ? 0 : (height - lineHeight) / 2),
    height: rect.height,
    width,
    clipHeight: height,
    paddingLeft,
    paddingTop,
  };
}
