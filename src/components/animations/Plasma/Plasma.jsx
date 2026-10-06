'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { bounded } from '../animationRuntime.js';

const fragment = `
uniform float uDirection;
uniform float uTurbulence;
vec3 shade(vec2 uv, float time) {
  vec2 p = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0) * uScale;
  p += (uPointer - 0.5) * uPointerActive * 0.13;
  float phase = time * 0.16 * uDirection;
  vec2 q = p * 1.25;
  for (int i = 0; i < 5; i++) {
    float n = float(i) + 1.0;
    q += vec2(sin(q.y * n + phase + n), cos(q.x * n - phase * 0.8)) * (0.38 * uTurbulence / n);
  }
  float fold = sin(q.x * 1.8 + sin(q.y * 1.9 + phase) * 1.7 + phase);
  float inner = sin(q.y * 2.2 - q.x * 0.7 - phase * 0.6);
  float edge = exp(-pow((fold - 0.14) / 0.16, 2.0));
  float sheet = smoothstep(-0.16, 0.14, fold) * (1.0 - smoothstep(0.22, 1.0, fold));
  float light = (edge * 0.19 + sheet * 0.65) * (0.52 + 0.48 * smoothstep(-1.0, 0.8, inner));
  vec3 pigment = mix(uColor1, mix(uColor2, uColor3, 0.5), smoothstep(-0.8, 0.9, inner) * 0.3);
  return mix(uBackground, pigment, clamp(light * uIntensity, 0.0, 1.0));
}
`;

export function Plasma({ direction = 'forward', turbulence = 1, ...props }) {
  return <BackgroundSurface effect="plasma" fragment={fragment} {...props}
    uniforms={{ uDirection: direction === 'reverse' ? -1 : 1, uTurbulence: bounded(turbulence, 1, 0, 2) }} />;
}

export default Plasma;
