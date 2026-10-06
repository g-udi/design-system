'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { bounded } from '../animationRuntime.js';

const fragment = `
uniform float uLineWidth;
uniform float uScanWidth;
uniform float uScanGlow;
vec3 shade(vec2 uv, float time) {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  p += (uPointer - 0.5) * uPointerActive * 0.09;
  // Intersect the four planes of a rectangular corridor.
  vec2 size = vec2(1.8, 1.0);
  vec2 hit = size / max(abs(p), vec2(0.001));
  float depth = min(hit.x, hit.y);
  bool side = hit.x < hit.y;
  vec2 surface = vec2(side ? p.y * depth : p.x * depth, depth);
  surface *= 2.0 * uScale;
  vec2 distance = abs(fract(surface + 0.5) - 0.5);
  float pixel = max(depth * 2.0 * uScale / uCssResolution.y, 0.001);
  float lines = 1.0 - smoothstep(pixel * uLineWidth, pixel * (uLineWidth + 1.2), min(distance.x, distance.y));
  float pulse = mod(time * 2.8, 28.0) + 1.5;
  float beam = exp(-pow((depth - pulse) / uScanWidth, 2.0));
  float halo = exp(-abs(depth - pulse) / (uScanWidth * 3.2));
  float fog = exp(-max(depth - 2.0, 0.0) * 0.095);
  vec3 field = mix(uBackground, uColor1, lines * 0.27 * fog * uIntensity);
  field = mix(field, uColor2, clamp((beam * lines + halo * 0.13) * uScanGlow * fog * uIntensity, 0.0, 1.0));
  return field;
}
`;

export function GridScan({ lineWidth = 1, scanWidth = 1.4, scanGlow = 1, ...props }) {
  return <BackgroundSurface effect="grid-scan" fragment={fragment} interactive {...props}
    uniforms={{ uLineWidth: bounded(lineWidth, 1, 0.25, 3), uScanWidth: bounded(scanWidth, 1.4, 0.2, 5), uScanGlow: bounded(scanGlow, 1, 0, 2) }} />;
}

export default GridScan;
