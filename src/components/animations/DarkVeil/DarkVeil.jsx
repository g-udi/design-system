'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

// Smooth illuminated sheets meet at moving creases; the shadow side stays unlit.
const fragment = `
vec3 shade(vec2 uv, float time) {
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0) / uScale;
  p += (uPointer - 0.5) * 0.08;
  float drift = time * 0.13;
  float valley = -0.52 + 0.13 * sin(drift * 0.7);
  float crease = -0.17 + 0.66 * pow(abs(p.x - valley), 0.72);
  crease += 0.035 * sin(p.x * 3.0 + drift);
  float d = p.y - crease;
  float sheet = smoothstep(-0.012, 0.065, d) * exp(-max(d, 0.0) * 6.5);
  float edge = exp(-abs(d) * 92.0) * 0.32;
  float angle = p.x * 0.36 + 0.20 + 0.10 * sin(drift + p.x);
  float d2 = p.y - angle;
  float crossing = smoothstep(-0.025, 0.07, d2) * exp(-max(d2, 0.0) * 5.0);
  float shadow = smoothstep(-0.08, 0.13, p.x - valley - p.y * 0.9);
  float veil = (sheet * (0.65 + 0.25 * sin(p.x * 2.0 - drift)) + edge) * (1.0 - shadow * 0.48);
  veil += crossing * shadow * 0.42;
  float underCrease = -0.25 + 0.82 * abs(p.x - valley - 0.28);
  float under = p.y - underCrease;
  float underSheet = smoothstep(-0.02, 0.075, under) * exp(-max(under, 0.0) * 8.0);
  veil += underSheet * exp(-pow((p.x - valley - 0.30) * 3.8, 2.0)) * 0.65;
  veil *= 0.75 + 0.25 * sin(p.x * 1.4 + p.y * 2.0 + drift * 0.8);
  vec3 pigment = palette(clamp(uv.x * 0.5 + uv.y * 0.25, 0.0, 1.0));
  vec3 scene = uBackground * 0.018 + pigment * veil * 1.25;
  return mix(uBackground, scene, min(uIntensity, 1.0)) + scene * max(uIntensity - 1.0, 0.0);
}
`;

export function DarkVeil(props) {
  return <BackgroundSurface effect="dark-veil" fragment={fragment} {...props} />;
}
