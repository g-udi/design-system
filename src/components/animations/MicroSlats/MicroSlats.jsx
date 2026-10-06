'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

const fragment = `
vec3 shade(vec2 uv, float time) {
  vec2 pixels = uv * uCssResolution;
  vec2 pitch = vec2(13.0, 28.0) * uScale;
  vec2 cell = floor(pixels / pitch);
  vec2 center = (cell + 0.5) * pitch;
  vec2 point = center / max(uCssResolution.y, 1.0);
  float swell = sin(point.x * 3.1 + point.y * 5.3 - time * 0.65);
  swell += 0.48 * sin(point.x * 5.0 - point.y * 3.6 + time * 0.34);
  float wake = 0.0;
  for (int i = 0; i < 16; i++) {
    float age = max(0.0, time - uTrail[i].z);
    vec2 delta = center - uTrail[i].xy * uCssResolution;
    float radius = 38.0 + age * 28.0;
    wake += exp(-dot(delta, delta) / (radius * radius)) * exp(-age * 1.6) * uTrail[i].w * 0.30;
  }
  for (int i = 0; i < 4; i++) {
    float age = max(0.0, time - uClicks[i].z);
    float distance = length(center - uClicks[i].xy * uCssResolution);
    wake += exp(-pow((distance - age * 150.0) / 30.0, 2.0)) * exp(-age * 1.8) * uClicks[i].w;
  }
  float light = smoothstep(-1.25, 1.2, swell + wake * 0.8);
  vec2 local = pixels - center;
  float radius = 3.75 * uScale;
  vec2 corner = abs(local) - (vec2(5.0, 12.5) * uScale - radius);
  float distance = length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) - radius;
  float slat = 1.0 - smoothstep(-0.65, 0.65, distance);
  float fog = mix(1.0, 0.52, smoothstep(0.45, 1.0, uv.y));
  float glint = pow(light, 9.0) * 0.6 + min(wake, 1.0) * 0.9;
  vec3 material = mix(uColor1, mix(uColor3, vec3(1.0), 0.65), clamp(glint, 0.0, 1.0));
  return mix(uBackground, material, clamp(slat * (0.13 + light * 0.68 + wake * 0.25) * fog * uIntensity, 0.0, 1.0));
}
`;

export function MicroSlats({ speed = 0.6, interactive = true, ...props }) {
  return <BackgroundSurface {...props} interactive={interactive} speed={speed} effect="micro-slats" fragment={fragment} />;
}

export default MicroSlats;
