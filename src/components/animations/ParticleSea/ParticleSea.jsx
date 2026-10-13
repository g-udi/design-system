'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { bounded } from '../animationRuntime.js';

// Each pixel is projected onto a rolling sea seen in perspective. Points are jittered in world space,
// so they shrink and crowd towards the horizon, and only crests catch enough light to glitter.
const fragment = `
uniform float uWaveHeight;
uniform float uDensity;
uniform float uHorizon;
float seaHeight(vec2 world, float time) {
  world *= 4.2;
  // Two directional swells give long ridges; a little noise breaks them up like open water.
  float swell = sin(dot(world, vec2(0.62, 0.32)) + time * 0.6) * 0.55
    + sin(dot(world, vec2(-0.28, 0.74)) + time * 0.42) * 0.3
    + (fbm(world * 0.22 + vec2(time * 0.04, 0.0)) - 0.5) * 0.5;
  return swell * uWaveHeight;
}
vec3 shade(vec2 uv, float time) {
  float gap = uHorizon - uv.y;
  if (gap <= 0.002) return uBackground;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float x = (uv.x - 0.5) * aspect;
  float depth = 0.9 / gap;
  vec2 world = vec2(x * depth, depth) * uScale;
  float height = 0.0;
  for (int i = 0; i < 2; i++) {
    height = seaHeight(world, time);
    depth = max(0.9 - height * 0.12, 0.2) / gap;
    world = vec2(x * depth, depth) * uScale;
  }
  height = seaHeight(world, time);
  float cells = 28.0 * uDensity;
  vec2 grid = world * cells;
  vec2 cell = floor(grid);
  // Project the jittered point back to the screen so its glint stays round despite perspective shear.
  vec2 anchor = (cell + vec2(hash21(cell), hash21(cell + 17.3))) / (cells * uScale);
  float anchorGap = max(0.9 - height * 0.12, 0.2) / max(anchor.y, 0.001);
  vec2 anchorUv = vec2(anchor.x / (anchor.y * aspect) + 0.5, uHorizon - anchorGap);
  vec2 pixelsPerCell = vec2(uCssResolution.y / (depth * uScale * cells), gap * gap * uCssResolution.y / (0.9 * uScale * cells));
  float radius = mix(0.35, 0.95, smoothstep(0.05, 0.6, gap));
  float point = 1.0 - smoothstep(radius - 0.3, radius + 0.6, length((uv - anchorUv) * uCssResolution));
  float resolvable = smoothstep(1.1, 3.0, min(pixelsPerCell.x, pixelsPerCell.y));
  vec2 toPointer = (uv - uPointer) * vec2(aspect, 1.0);
  float lift = uPointerActive * exp(-dot(toPointer, toPointer) * 4.0) * 1.6;
  // Calm water still glints faintly; swells light their crests fully.
  float ridge = smoothstep(-0.15, 0.7, height / max(uWaveHeight, 0.05) + lift);
  float crest = 0.05 + 0.95 * ridge * sqrt(ridge);
  float twinkle = 0.55 + 0.45 * sin(time * 2.4 + hash21(cell + 3.1) * 6.2832);
  float light = point * crest * twinkle * resolvable * smoothstep(0.0, 0.2, gap);
  vec3 ink = palette(hash21(cell + 9.7));
  return mix(uBackground, ink, clamp(light * uIntensity * 2.6, 0.0, 1.0));
}
`;

export function ParticleSea({ waveHeight = 1, density = 1, horizon = 0.75, ...props }) {
  return <BackgroundSurface effect="particle-sea" fragment={fragment} {...props}
    uniforms={{ uWaveHeight: bounded(waveHeight, 1, 0, 2), uDensity: bounded(density, 1, 0.25, 2), uHorizon: bounded(horizon, 0.75, 0.3, 1) }} />;
}

export default ParticleSea;
