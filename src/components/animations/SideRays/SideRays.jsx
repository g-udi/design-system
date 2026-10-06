'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

// Broad shafts illuminate a small corner region, with a fast atmospheric falloff.
const fragment = `
vec3 shade(vec2 uv, float time) {
  vec2 origin = vec2(1.02, 1.22) + (uPointer - 0.5) * 0.06;
  vec2 p = (origin - uv) * vec2(uResolution.x / uResolution.y, 1.0);
  float angle = atan(p.y, p.x);
  float radius = length(p);
  float shafts = 0.0;
  for (int i = 0; i < 4; i++) {
    float n = float(i);
    float axis = 0.60 + n * 0.29 + sin(time * 0.26 + n * 2.2) * 0.08;
    float width = (0.12 + 0.03 * sin(n + 1.0)) * uScale;
    float d = (angle - axis) / width;
    shafts += exp(-d * d) * (0.65 + 0.35 * sin(time * 0.46 + n * 2.0));
  }
  float falloff = exp(-radius * 4.5 / uScale);
  float light = (shafts * 2.4 + exp(-radius * 5.0) * 0.20) * falloff * uIntensity;
  vec3 pigment = mix(palette(clamp(angle / 1.57, 0.0, 1.0)), vec3(1.0), 0.60);
  float onLight = smoothstep(0.4, 0.9, dot(uBackground, vec3(0.299, 0.587, 0.114)));
  return mix(uBackground + pigment * light, mix(uBackground, pigment * 0.55, 1.0 - exp(-light)), onLight);
}
`;

export function SideRays(props) {
  return <BackgroundSurface effect="side-rays" fragment={fragment} {...props} />;
}
