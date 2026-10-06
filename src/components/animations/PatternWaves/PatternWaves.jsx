'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

const fragment = `
float fabric(vec2 p, float time) {
  float phase = p.x * 11.0 + p.y * 3.1 + sin(p.y * 3.0 + time * 0.4) * 0.85 - time * 0.7;
  return sin(phase) + sin(phase * 2.0 + 0.7) * 0.27 + sin(p.x * 3.2 - p.y * 2.0 + time * 0.23) * 0.22;
}
vec3 shade(vec2 uv, float time) {
  vec2 pixels = uv * uCssResolution;
  float pitch = 9.0 * uScale;
  vec2 cell = floor(pixels / pitch);
  vec2 center = (cell + 0.5) * pitch;
  vec2 point = center / max(uCssResolution.y, 1.0);
  float ripple = 0.0;
  for (int i = 0; i < 16; i++) {
    float age = max(0.0, time - uTrail[i].z);
    float distance = length(center - uTrail[i].xy * uCssResolution);
    ripple += sin(distance * 0.10 - age * 9.0) * exp(-distance / 75.0 - age * 1.8) * uTrail[i].w * 0.35;
  }
  for (int i = 0; i < 4; i++) {
    float age = max(0.0, time - uClicks[i].z);
    float distance = length(center - uClicks[i].xy * uCssResolution);
    ripple += sin(distance * 0.09 - age * 11.0) * exp(-pow((distance - age * 130.0) / 65.0, 2.0) - age) * uClicks[i].w;
  }
  float height = fabric(point, time) + ripple;
  float slope = (fabric(point + vec2(0.012, 0.0), time) - fabric(point - vec2(0.012, 0.0), time)) / 0.024;
  float diffuse = smoothstep(-0.55, 0.95, height * 0.65 - slope * 0.055);
  float shine = pow(max(0.0, 1.0 - abs(slope * 0.16 + 0.55)), 12.0) * smoothstep(-0.1, 0.65, height);
  float light = clamp(diffuse * 0.66 + shine * 0.95 + abs(ripple) * 0.5, 0.0, 1.0);
  float radius = pitch * (0.07 + light * 0.405);
  vec2 mark = pixels - center - vec2(height * 0.5, height * 1.2);
  float dotMask = 1.0 - smoothstep(radius - 0.6, radius + 0.6, length(mark));
  float fade = 1.0 - smoothstep(0.35, 0.79, length((uv - 0.5) * vec2(1.0, 0.8)));
  vec3 ink = mix(uColor1, mix(uColor3, vec3(1.0), 0.8), clamp(light * 0.65 + shine, 0.0, 1.0));
  return mix(uBackground, ink, clamp(dotMask * fade * (0.12 + light * 0.88) * uIntensity, 0.0, 1.0));
}
`;

export function PatternWaves({ speed = 0.35, interactive = true, ...props }) {
  return <BackgroundSurface {...props} interactive={interactive} speed={speed} effect="pattern-waves" fragment={fragment} />;
}

export default PatternWaves;
