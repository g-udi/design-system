'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { bounded } from '../animationRuntime.js';

const fragment = `
uniform float uPixelSize;
uniform float uLevels;
uniform float uAmplitude;
float ordered2(vec2 p) {
  vec2 q = mod(p, 2.0);
  return q.x * 2.0 + q.y * 3.0 - q.x * q.y * 4.0;
}
vec3 shade(vec2 uv, float time) {
  vec2 cell = floor(uv * uCssResolution / uPixelSize);
  vec2 sampled = (cell + 0.5) * uPixelSize / uCssResolution;
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 p = (sampled - 0.5) * aspect * uScale;
  float phase = time * 0.07;
  float field = fbm(p * 2.7 + vec2(phase, -phase * 0.7));
  field += sin(p.x * 2.8 + sin(p.y * 2.3 + phase)) * 0.16 * uAmplitude;
  float pointer = exp(-dot((sampled - uPointer) * aspect, (sampled - uPointer) * aspect) * 32.0);
  field += pointer * uPointerActive * 0.22;
  float tone = clamp((field - 0.25) * 1.9, 0.0, 1.0);
  float threshold = (ordered2(cell) * 16.0 + ordered2(floor(cell / 2.0)) * 4.0 + ordered2(floor(cell / 4.0)) + 0.5) / 64.0;
  float quantized = floor(tone * (uLevels - 1.0) + threshold) / (uLevels - 1.0);
  return mix(uBackground, uColor1, clamp(quantized * uIntensity, 0.0, 1.0));
}
`;

export function Dither({ pixelSize = 2, levels = 3, amplitude = 1, ...props }) {
  return <BackgroundSurface effect="dither" fragment={fragment} interactive {...props}
    uniforms={{ uPixelSize: bounded(pixelSize, 2, 1, 8), uLevels: Math.round(bounded(levels, 3, 2, 8)), uAmplitude: bounded(amplitude, 1, 0, 2) }} />;
}

export default Dither;
