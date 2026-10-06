import sanitize from 'sanitize-html';

// The content owners accept prose, KaTeX's accessible MathML, and Mermaid SVG.
// Keep executable elements/attributes outside this presentation-only allowlist.
const mathTags = ['math', 'semantics', 'annotation', 'mrow', 'mi', 'mo', 'mn', 'mtext', 'mspace', 'msup', 'msub', 'msubsup', 'mfrac', 'msqrt', 'mroot', 'mover', 'munder', 'munderover', 'mtable', 'mtr', 'mtd', 'menclose', 'mpadded', 'mphantom', 'mstyle'];
const svgTags = ['svg', 'g', 'defs', 'desc', 'title', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'textPath', 'marker', 'clipPath', 'mask', 'pattern', 'linearGradient', 'radialGradient', 'stop', 'use', 'image', 'foreignObject'];
const presentationAttributes = [
  'class', 'id', 'title', 'role', 'aria-*', 'data-*', 'style', 'dir', 'lang',
  'xmlns', 'xmlns:xlink', 'width', 'height', 'viewBox', 'preserveAspectRatio',
  'x', 'y', 'x1', 'y1', 'x2', 'y2', 'dx', 'dy', 'cx', 'cy', 'r', 'rx', 'ry', 'd', 'points', 'transform',
  'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin',
  'opacity', 'color', 'font-family', 'font-size', 'font-weight', 'text-anchor', 'dominant-baseline', 'alignment-baseline', 'textLength', 'lengthAdjust',
  'marker-start', 'marker-mid', 'marker-end', 'markerWidth', 'markerHeight', 'markerUnits', 'refX', 'refY', 'orient',
  'clip-path', 'clipPathUnits', 'mask', 'maskUnits', 'maskContentUnits', 'patternUnits', 'patternContentUnits', 'patternTransform',
  'gradientUnits', 'gradientTransform', 'offset', 'stop-color', 'stop-opacity',
  'display', 'encoding', 'mathvariant', 'mathsize', 'mathcolor', 'mathbackground', 'displaystyle', 'scriptlevel', 'accent', 'accentunder',
  'stretchy', 'fence', 'separator', 'lspace', 'rspace', 'minsize', 'maxsize', 'linethickness', 'columnalign', 'columnspacing', 'rowspacing', 'rowspan', 'colspan'
];
const length = /^-?(?:\d*\.)?\d+(?:em|ex|px|pt|rem|%)?$/;
const mathStyles = {
  ...Object.fromEntries(['height', 'width', 'min-width', 'top', 'left', 'margin-left', 'margin-right', 'padding-left', 'padding-right', 'vertical-align', 'font-size', 'border-bottom-width', 'border-right-width'].map((property) => [property, [length]])),
  position: [/^(?:relative|absolute)$/],
  color: [/^(?:#[\da-f]{3,8}|[a-z]+|rgba?\([\d\s.,%]+\))$/i]
};

/** Sanitize content on the server and client; style tags are reserved for trusted generated SVG. */
export default function sanitizeHtml(html, { allowStyleTags = false } = {}) {
  if (html == null) return '';
  return sanitize(String(html), {
    allowedTags: [...sanitize.defaults.allowedTags, 'img', ...mathTags, ...svgTags, ...(allowStyleTags ? ['style'] : [])],
    allowedAttributes: {
      '*': presentationAttributes,
      a: ['href', 'xlink:href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'loading'],
      image: ['href', 'xlink:href'],
      use: ['href', 'xlink:href'],
      textPath: ['href', 'xlink:href', 'startOffset'],
      th: ['scope', 'headers'],
      td: ['headers'],
      ol: ['start', 'reversed', 'type'],
      li: ['value'],
      time: ['datetime']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowedSchemesAppliedToAttributes: ['href', 'src', 'xlink:href'],
    allowedStyles: allowStyleTags ? undefined : { '*': mathStyles },
    allowVulnerableTags: allowStyleTags,
    parser: { lowerCaseTags: false, lowerCaseAttributeNames: false }
  });
}
