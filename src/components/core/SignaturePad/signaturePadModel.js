// Adapted from ReUI (MIT); see README.md#third-party-notices.

const round = (value) => Math.round(value * 100) / 100;

const pair = (x, y) => `${round(x)} ${round(y)}`;

const CORNER_COS = -0.17;

function circlePath(x, y, r) {
  const radius = round(Math.max(r, 0.25));
  return `M${pair(x - radius, y)}a${radius} ${radius} 0 1 0 ${round(radius * 2)} 0a${radius} ${radius} 0 1 0 ${round(-radius * 2)} 0Z`;
}

function outlinePath(points, from, to) {
  const [startX, startY, startSize] = points[from];
  if (from === to) return circlePath(startX, startY, startSize / 2);
  const left = [];
  const right = [];
  let nx = 0;
  let ny = 1;
  for (let i = from; i <= to; i++) {
    const [ax, ay] = points[Math.max(i - 1, from)];
    const [bx, by] = points[Math.min(i + 1, to)];
    const length = Math.hypot(bx - ax, by - ay);
    if (length > 1e-6) {
      nx = -(by - ay) / length;
      ny = (bx - ax) / length;
    }
    const [x, y, size] = points[i];
    const r = size / 2;
    left.push([x + nx * r, y + ny * r]);
    right.push([x - nx * r, y - ny * r]);
  }
  const last = left.length - 1;
  const endRadius = round(points[to][2] / 2);
  const startRadius = round(startSize / 2);
  let d = `M${pair(...left[0])}`;
  for (let i = 1; i < last; i++) {
    const [x, y] = left[i];
    d += `Q${pair(x, y)} ${pair((x + left[i + 1][0]) / 2, (y + left[i + 1][1]) / 2)}`;
  }
  d += `L${pair(...left[last])}A${endRadius} ${endRadius} 0 0 0 ${pair(...right[last])}`;
  for (let i = last - 1; i > 0; i--) {
    const [x, y] = right[i];
    d += `Q${pair(x, y)} ${pair((x + right[i - 1][0]) / 2, (y + right[i - 1][1]) / 2)}`;
  }
  return `${d}L${pair(...right[0])}A${startRadius} ${startRadius} 0 0 0 ${pair(...left[0])}Z`;
}

function isCorner(a, b, c) {
  const ux = b[0] - a[0];
  const uy = b[1] - a[1];
  const vx = c[0] - b[0];
  const vy = c[1] - b[1];
  const lengths = Math.hypot(ux, uy) * Math.hypot(vx, vy);
  return lengths > 0 && (ux * vx + uy * vy) / lengths < CORNER_COS;
}

function getSignaturePadStrokePath(stroke) {
  const { points } = stroke;
  if (points.length === 0) return '';
  let d = '';
  let start = 0;
  for (let i = 1; i < points.length - 1; i++) {
    if (isCorner(points[i - 1], points[i], points[i + 1])) {
      d += outlinePath(points, start, i);
      start = i;
    }
  }
  return d + outlinePath(points, start, points.length - 1);
}

function getSignaturePadBounds(strokes) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const stroke of strokes) {
    for (const [x, y, size] of stroke.points) {
      const r = size / 2;
      minX = Math.min(minX, x - r);
      minY = Math.min(minY, y - r);
      maxX = Math.max(maxX, x + r);
      maxY = Math.max(maxY, y + r);
    }
  }
  if (minX === Infinity) return null;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function resolveFrame(strokes, options) {
  const { width, height, padding = 8, crop = true } = options;
  if (width !== undefined && height !== undefined) {
    return { x: 0, y: 0, width, height };
  }
  const bounds = getSignaturePadBounds(strokes);
  if (!bounds) return { x: 0, y: 0, width: width ?? 1, height: height ?? 1 };
  if (!crop) {
    return {
      x: 0,
      y: 0,
      width: width ?? Math.ceil(bounds.x + bounds.width + padding),
      height: height ?? Math.ceil(bounds.y + bounds.height + padding),
    };
  }
  const x = Math.floor(bounds.x - padding);
  const y = Math.floor(bounds.y - padding);
  return {
    x,
    y,
    width: Math.ceil(bounds.x + bounds.width + padding) - x,
    height: Math.ceil(bounds.y + bounds.height + padding) - y,
  };
}

const escapeAttribute = (value) =>
  value.replace(/[&"<>]/g, (char) => `&#${char.charCodeAt(0)};`);

function signaturePadToSVG(strokes, options = {}) {
  const { x, y, width, height } = resolveFrame(strokes, options);
  const color = options.color ?? '#000000';
  const background = options.background
    ? `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${escapeAttribute(options.background)}"/>`
    : '';
  const paths = strokes
    .map((stroke) => {
      const d = getSignaturePadStrokePath(stroke);
      return d
        ? `<path d="${d}" fill="${escapeAttribute(stroke.color ?? color)}"/>`
        : '';
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" width="${width}" height="${height}">${background}${paths}</svg>`;
}

function drawToCanvas(strokes, options) {
  const { x, y, width, height } = resolveFrame(strokes, options);
  const scale = options.scale ?? 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext('2d');
  if (!context)
    throw new Error('A 2D canvas is required to export a signature image.');
  context.scale(scale, scale);
  context.translate(-x, -y);
  const background =
    options.background ?? (options.type === 'image/jpeg' ? '#ffffff' : '');
  if (background) {
    context.fillStyle = background;
    context.fillRect(x, y, width, height);
  }
  for (const stroke of strokes) {
    const d = getSignaturePadStrokePath(stroke);
    if (!d) continue;
    context.fillStyle = stroke.color ?? options.color ?? '#000000';
    context.fill(new Path2D(d));
  }
  return canvas;
}

function signaturePadToDataURL(strokes, options = {}) {
  return drawToCanvas(strokes, options).toDataURL(
    options.type ?? 'image/png',
    options.quality,
  );
}

function signaturePadToBlob(strokes, options = {}) {
  return new Promise((resolve) => {
    drawToCanvas(strokes, options).toBlob(
      resolve,
      options.type ?? 'image/png',
      options.quality,
    );
  });
}

function serializeSignaturePad(strokes, format = 'svg', options = {}) {
  if (!getSignaturePadBounds(strokes)) return '';
  if (!['svg', 'png', 'jpeg', 'json'].includes(format))
    throw new TypeError(`Unsupported signature format: ${format}`);
  if (format === 'json') return JSON.stringify(strokes);
  if (format === 'svg') {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(signaturePadToSVG(strokes, options))}`;
  }
  return signaturePadToDataURL(strokes, {
    ...options,
    type: format === 'jpeg' ? 'image/jpeg' : 'image/png',
  });
}

function sameStrokes(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((stroke, index) => {
    const other = b[index];
    if (stroke === other) return true;
    const { points } = stroke;
    return (
      stroke.color === other.color &&
      points.length === other.points.length &&
      points.every((point, pointIndex) =>
        point.every((value, axis) => value === other.points[pointIndex][axis]),
      )
    );
  });
}

export {
  round,
  resolveFrame,
  sameStrokes,
  getSignaturePadStrokePath,
  getSignaturePadBounds,
  signaturePadToSVG,
  signaturePadToDataURL,
  signaturePadToBlob,
  serializeSignaturePad,
};
