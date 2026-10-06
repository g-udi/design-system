'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { bounded } from '../animationRuntime.js';

const fragment = `
uniform float uCellSize;
uniform float uDotSize;
vec3 shade(vec2 uv, float time) {
  float pitch = uCellSize;
  vec2 pixels = uv * uCssResolution;
  vec2 cell = floor(pixels / pitch);
  vec2 center = (cell + 0.5) * pitch;
  vec2 point = center / max(uCssResolution.y, 1.0) / uScale;
  vec2 local = pixels - center;
  float field = sin(point.x * 7.0 + sin(point.y * 6.5 + time * 0.32) * 1.6);
  field += sin(point.y * 7.0 - point.x * 3.4 - time * 0.48) * 0.75;
  field += sin(point.x * 3.3 + point.y * 2.0 + time * 0.24) * 0.3;
  float splash = 0.0;
  for (int i = 0; i < 16; i++) {
    float age = max(0.0, time - uTrail[i].z);
    float distance = length(center - uTrail[i].xy * uCssResolution);
    splash += sin(distance * 0.12 - age * 8.0) * exp(-distance / 65.0 - age * 2.0) * uTrail[i].w * 0.4;
  }
  for (int i = 0; i < 4; i++) {
    float age = max(0.0, time - uClicks[i].z);
    float distance = length(center - uClicks[i].xy * uCssResolution);
    splash += sin(distance * 0.11 - age * 10.0) * exp(-pow((distance - age * 120.0) / 45.0, 2.0) - age * 1.3) * uClicks[i].w * 1.4;
  }
  field += splash;
  float size = pitch * uDotSize * 0.5;
  float distance;
  if (field < -0.3) {
    distance = max(abs(local.x) * 0.866025 + local.y * 0.5, -local.y) - size * 0.67;
  } else if (field > 0.55) {
    distance = max(abs(local.x), abs(local.y)) - size;
  } else {
    distance = length(local) - size;
  }
  float mark = 1.0 - smoothstep(-0.55, 0.55, distance);
  float fade = 1.0 - smoothstep(0.36, 0.74, length(uv - 0.5)) * 0.85;
  vec3 ink = mix(uColor1, uColor3, 0.55);
  ink = mix(ink, vec3(1.0), min(abs(splash), 1.0));
  return mix(uBackground, ink, clamp(mark * fade * (0.66 + min(abs(splash), 1.0) * 0.34) * uIntensity, 0.0, 1.0));
}
`;

function textMask(text, textSize) {
  const escaped = text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
  const fontSize = Math.min(500 * textSize, 1500 / Math.max(text.length, 1));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><mask id="cutout"><rect width="100%" height="100%" fill="white"/><svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet"><text x="500" y="250" dy=".35em" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="600" font-size="${fontSize}" fill="black">${escaped}</text></svg></mask></defs><rect width="100%" height="100%" fill="white" mask="url(#cutout)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function ShapeWaves({ speed = 1, interactive = true, text = '', textSize = 0.6, cellSize = 10, dotSize = 0.75, children, ...props }) {
  const mask = text ? textMask(String(text), bounded(textSize, 0.6, 0.1, 1)) : undefined;
  return <BackgroundSurface {...props} interactive={interactive} speed={speed} effect="shape-waves" fragment={fragment}
    uniforms={{ uCellSize: bounded(cellSize, 10, 4, 40), uDotSize: bounded(dotSize, 0.75, 0.1, 0.95) }}
    canvasStyle={mask ? { maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' } : undefined}>
    {text ? <span className="sr-only">{text}</span> : null}
    {children}
  </BackgroundSurface>;
}

export default ShapeWaves;
