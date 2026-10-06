'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

const fragment = `
vec3 shade(vec2 uv, float time) {
  float pinch = 0.5 + (uPointer.x - 0.5) * uPointerActive * 0.1;
  float x = (uv.x - pinch) * 2.0;
  float fan = pow(abs(x), 1.18) * 0.49;
  float pixel = 1.0 / max(uCssResolution.y, 1.0);
  vec3 glow = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    float strand = float(i);
    float phase = strand * 1.0472;
    float curve = sin(x * (3.9 + strand * 0.14) * uScale + phase + time * 0.26);
    float y = 0.5 + curve * fan;
    float distance = abs(uv.y - y);
    float core = exp(-pow(distance / (pixel * 0.72), 2.0));
    float halo = exp(-distance / (pixel * 4.0)) * 0.42;
    float cursorLight = exp(-dot(uv - uPointer, uv - uPointer) * 24.0) * uPointerActive;
    vec3 color = mix(mix(uColor1, uColor2, strand / 5.0), uColor3, 0.2);
    color = mix(color, vec3(1.0), 0.7);
    glow += color * (core + halo) * (0.9 + cursorLight * 0.2);
  }
  float knot = exp(-abs(x) * 25.0 - abs(uv.y - 0.5) * 160.0);
  glow += mix(uColor1, vec3(1.0), 0.7) * knot * 0.5;
  vec3 light = glow * uIntensity;
  float coverage = clamp(max(light.r, max(light.g, light.b)), 0.0, 1.0);
  vec3 ink = mix(uBackground, mix(mix(uColor1, uColor2, 0.4), uColor3, 0.2), coverage);
  return mix(uBackground + light, ink, step(0.55, dot(uBackground, vec3(0.2126, 0.7152, 0.0722))));
}
`;

export function WebThreads(props) {
  return <BackgroundSurface effect="web-threads" fragment={fragment} {...props} />;
}

export default WebThreads;
