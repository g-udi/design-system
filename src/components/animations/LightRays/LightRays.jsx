'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

// Overlapping atmospheric shafts dissolve before reaching the lower surface.
const fragment = `
vec3 shade(vec2 uv, float time) {
  vec2 source = vec2(0.5, 1.17);
  vec2 p = (uv - source) * vec2(uResolution.x / uResolution.y, 1.0);
  float depth = max(-p.y, 0.06);
  float direction = p.x / depth - (uPointer.x - 0.5) * 0.22 * uPointerActive;
  float shafts = 0.0;
  for (int i = 0; i < 5; i++) {
    float n = float(i);
    float axis = (n - 2.0) * 0.24 * uScale + sin(time * 0.22 + n * 1.8) * 0.05;
    float d = (direction - axis) / (0.12 * uScale);
    shafts += exp(-d * d) * (0.48 + 0.20 * sin(time * 0.32 + n * 1.7));
  }
  float cone = exp(-direction * direction / (0.28 * uScale * uScale));
  float fade = exp(-depth * 3.0 / uScale) * (1.0 - smoothstep(0.40, 1.40, depth));
  float light = (shafts * 0.66 + cone * 0.26) * fade * uIntensity;
  vec3 pigment = mix(palette(clamp(uv.x * 0.45 + 0.25, 0.0, 1.0)), vec3(1.0), 0.68);
  float onLight = smoothstep(0.4, 0.9, dot(uBackground, vec3(0.299, 0.587, 0.114)));
  return mix(uBackground + pigment * light, mix(uBackground, pigment * 0.52, 1.0 - exp(-light * 1.5)), onLight);
}
`;

export function LightRays(props) {
  return <BackgroundSurface effect="light-rays" fragment={fragment} interactive={true} {...props} />;
}
