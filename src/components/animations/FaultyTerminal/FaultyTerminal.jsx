'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { bounded } from '../animationRuntime.js';

const fragment = `
uniform float uDigitSize;
uniform float uCurvature;
uniform float uScanlines;
uniform float uGlitch;
vec3 shade(vec2 uv, float time) {
  vec2 p = uv * 2.0 - 1.0;
  p *= 1.0 + dot(p, p) * uCurvature * 0.18;
  vec2 screen = p * 0.5 + 0.5;
  float band = floor(screen.y * 24.0);
  float tick = floor(time * 3.0);
  float fault = step(0.95, hash21(vec2(band, tick))) * uGlitch;
  screen.x += (hash21(vec2(tick, band)) - 0.5) * fault * 0.035;
  vec2 grid = screen * uCssResolution / (17.0 * uDigitSize / uScale);
  vec2 cell = floor(grid);
  vec2 local = abs(fract(grid) - 0.5);
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 fieldPoint = cell / max(uCssResolution.y / (17.0 * uDigitSize / uScale), 1.0);
  float field = fbm(fieldPoint * 3.7 + vec2(time * 0.11, -time * 0.06));
  field += sin(fieldPoint.x * 3.0 + time * 0.17) * 0.12;
  field = 0.5 + (field - 0.46) * 1.35;
  float pointer = exp(-dot((screen - uPointer) * aspect, (screen - uPointer) * aspect) * 22.0);
  field += pointer * uPointerActive * 0.23;
  float size = smoothstep(0.28, 0.72, field) * 0.4;
  // Tiny square pixels grow into plus signs, diamonds and solid phosphor blocks.
  float kind = floor(hash21(cell + floor(time * 0.6)) * 3.0);
  float distance = max(local.x, local.y);
  if (kind < 1.0) distance = min(max(local.x, local.y * 2.4), max(local.x * 2.4, local.y));
  else if (kind < 2.0) distance = (local.x + local.y) * 0.72;
  float glyph = 1.0 - smoothstep(size, size + 0.04, distance);
  glyph *= smoothstep(0.27, 0.4, field);
  float scan = 1.0 - uScanlines * (0.25 + 0.25 * cos(screen.y * uCssResolution.y * 3.141593));
  float vignette = clamp(1.2 - dot(p * 0.45, p * 0.45), 0.0, 1.0);
  float bounds = step(0.0, screen.x) * step(screen.x, 1.0) * step(0.0, screen.y) * step(screen.y, 1.0);
  float glow = pow(max(field - 0.28, 0.0), 2.0) * 0.16;
  return mix(uBackground, uColor1, clamp((glyph * 0.85 + glow) * scan * vignette * bounds * uIntensity, 0.0, 1.0));
}
`;

export function FaultyTerminal({ digitSize = 1, curvature = 0.1, scanlines = 0.5, glitch = 1, ...props }) {
  return <BackgroundSurface effect="faulty-terminal" fragment={fragment} interactive {...props}
    uniforms={{ uDigitSize: bounded(digitSize, 1, 0.5, 3), uCurvature: bounded(curvature, 0.1, 0, 1), uScanlines: bounded(scanlines, 0.5, 0, 1), uGlitch: bounded(glitch, 1, 0, 2) }} />;
}

export default FaultyTerminal;
