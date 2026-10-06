'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

// Three differently oriented line families share a local, smoothed pointer lens.
const fragment = `
vec3 shade(vec2 uv, float time) {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect / uScale;
  vec2 pointer = (uPointer - 0.5) * aspect / uScale;
  vec2 delta = p - pointer;
  float radius2 = dot(delta, delta);
  p -= delta * exp(-radius2 / 0.055) * 2.8 * uPointerActive;
  float t = time * 0.18;
  vec3 emission = vec3(0.0);
  float coverage = 0.0;
  for (int family = 0; family < 3; family++) {
    float f = float(family);
    vec2 q = p;
    if (family == 1) q = mat2(0.91, -0.42, 0.42, 0.91) * p;
    if (family == 2) q = mat2(0.30, -0.954, 0.954, 0.30) * p;
    float curve = sin(q.x * 1.6 + t + f * 1.8) * 0.13;
    curve += sin(q.x * 0.8 - t * 0.7 + f) * 0.08;
    if (family == 0) curve -= q.x * 0.18;
    if (family == 2) curve -= 0.62;
    float spread = 0.013 + 0.017 * (0.5 + 0.5 * sin(q.x * 1.8 + t + f));
    float depth = family == 0 ? 1.0 : (family == 1 ? 0.17 : 0.24);
    for (int line = 0; line < 8; line++) {
      float n = float(line);
      float d = abs(q.y - curve - (n - 3.5) * spread);
      float core = exp(-pow(d * uCssResolution.y * uScale / 1.15, 2.0));
      float halo = exp(-d * 30.0) * 0.10;
      float light = (core * 0.95 + halo) * depth;
      vec3 pigment = palette(n / 7.0);
      emission += (mix(pigment, vec3(1.0), n / 7.0 * 0.78) * core + pigment * halo * 2.4) * depth;
      coverage += light;
    }
  }
  float onLight = smoothstep(0.4, 0.9, dot(uBackground, vec3(0.299, 0.587, 0.114)));
  vec3 darkScene = uBackground + emission * uIntensity;
  vec3 lightScene = mix(uBackground, palette(uv.x) * 0.72, 1.0 - exp(-coverage * uIntensity));
  return mix(darkScene, lightScene, onLight);
}
`;

export function FloatingLines(props) {
  return <BackgroundSurface effect="floating-lines" fragment={fragment} interactive={true} {...props} />;
}
