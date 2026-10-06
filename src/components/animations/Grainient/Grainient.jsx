'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { bounded } from '../animationRuntime.js';

const fragment = `
uniform float uGrain;
uniform float uWarp;
uniform float uContrast;
vec3 shade(vec2 uv, float time) {
  vec2 p = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0) * uScale;
  float phase = time * 0.075;
  p += (uPointer - 0.5) * uPointerActive * 0.12;
  vec2 warp = vec2(sin(p.y * 2.4 + phase), cos(p.x * 1.9 - phase * 1.2));
  p += warp * uWarp * 0.65;
  float first = sin(p.x * 1.7 + p.y * 1.4 + phase + sin(p.y * 2.0) * 0.6);
  float second = cos(p.x * 1.1 - p.y * 2.4 - phase * 0.8);
  float a = smoothstep(-1.0, 1.0, first * uContrast);
  float b = smoothstep(-0.9, 1.0, second * uContrast);
  vec3 ink = mix(mix(uColor1, uColor2, a), uColor3, b * 0.78);
  float grain = hash21(floor(uv * uCssResolution) + floor(time * 12.0) * vec2(1.7, 3.1)) - 0.5;
  ink += grain * uGrain * 0.4;
  return mix(uBackground, ink, clamp(uIntensity, 0.0, 1.0));
}
`;

export function Grainient({ grain = 0.3, warp = 1, contrast = 1.2, ...props }) {
  return <BackgroundSurface effect="grainient" fragment={fragment} {...props}
    uniforms={{ uGrain: bounded(grain, 0.3, 0, 1), uWarp: bounded(warp, 1, 0, 3), uContrast: bounded(contrast, 1.2, 0.25, 3) }} />;
}

export default Grainient;
