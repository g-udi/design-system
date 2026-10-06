'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

// Equal CSS-pixel squares use ordered occupancy; clicks launch finite outward waves.
const fragment = `
float bayer2(vec2 p) {
  vec2 q = mod(p, 2.0);
  return q.x * 2.0 + q.y * 3.0 - q.x * q.y * 4.0;
}
vec3 shade(vec2 uv, float time) {
  float pitch = 8.0 * uScale;
  vec2 grid = uv * uCssResolution / pitch;
  vec2 cell = floor(grid);
  vec2 local = abs(fract(grid) - 0.5);
  vec2 samplePoint = (cell + 0.5) * pitch / uCssResolution;
  vec2 aspect = vec2(uCssResolution.x / uCssResolution.y, 1.0);
  vec2 p = (samplePoint - 0.5) * aspect;
  float field = fbm(p * 2.6 + vec2(time * 0.09, -time * 0.055));
  float density = smoothstep(0.38, 0.70, field);
  for (int i = 0; i < 4; i++) {
    float age = max(0.0, time - uClicks[i].z);
    float radius = length((samplePoint - uClicks[i].xy) * aspect);
    float wave = exp(-pow((radius - age * 0.34) / 0.055, 2.0));
    density += wave * exp(-age * 0.65) * uClicks[i].w * 0.7;
  }
  float threshold = (bayer2(cell) * 4.0 + bayer2(floor(cell / 2.0)) + 0.5) / 16.0;
  float occupied = smoothstep(threshold - 0.035, threshold + 0.035, density);
  float square = 1.0 - smoothstep(0.235, 0.265, max(local.x, local.y));
  float edge = smoothstep(0.0, 0.15, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
  vec3 pigment = mix(palette(0.36), vec3(1.0), 0.18);
  float opacity = square * occupied * edge * uIntensity * 0.85;
  return mix(uBackground, pigment, clamp(opacity, 0.0, 1.0));
}
`;

export function PixelBlast(props) {
  return <BackgroundSurface effect="pixel-blast" fragment={fragment} interactive={true} {...props} />;
}
