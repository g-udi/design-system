'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

// Uneven, luminous ribbons travel through a broad diagonal column.
const fragment = `
vec3 shade(vec2 uv, float time) {
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0) / uScale;
  p.x -= p.y * 0.47 + (uPointer.x - 0.5) * 0.3;
  float t = time * 0.22;
  float center = 0.025 * sin(p.y * 4.1 + t) + 0.035 * sin(p.y * 8.0 - t * 0.7);
  float bloom = exp(-pow((p.x - center) / 0.29, 2.0)) * 0.30;
  float ribbons = 0.0;
  float cores = 0.0;
  for (int i = 0; i < 4; i++) {
    float n = float(i);
    float phase = n * 1.73;
    float bend = sin(p.y * 3.2 + phase + t) * 0.085;
    bend += sin(p.y * 8.5 + phase * 1.7 + 2.0 * sin(p.y * 5.3 + phase + t)) * 0.05;
    bend += sin(p.y * 17.0 + phase - t * 0.5) * 0.008;
    float axis = center + (n - 1.5) * 0.09 + bend;
    float width = 0.07 + 0.075 * pow(0.5 + 0.5 * sin(p.y * 6.0 + phase - t * 0.8), 2.0);
    float across = (p.x - axis) / width;
    float left = abs(p.x - axis + width * 0.5);
    float right = abs(p.x - axis - width * 0.5);
    float body = smoothstep(-0.55, -0.42, across) * (1.0 - smoothstep(0.42, 0.55, across));
    float strength = 0.50 + 0.50 * pow(0.5 + 0.5 * sin(p.y * 5.0 + phase - t), 2.0);
    float highlightWidth = 0.003 + 0.006 * pow(0.5 + 0.5 * sin(p.y * 9.0 + phase + t), 3.0);
    float reflected = 0.35 + 0.65 * pow(clamp(0.5 - across, 0.0, 1.0), 2.0);
    ribbons += body * reflected * strength * 0.82;
    ribbons += exp(-abs(p.x - axis) * 16.0) * strength * 0.09;
    cores += (exp(-left / highlightWidth) * 0.55 + exp(-right / (highlightWidth * 0.7)) * 0.18) * strength;
  }
  vec3 pigment = palette(clamp(uv.y * 0.8 + 0.1, 0.0, 1.0));
  vec3 emission = pigment * (bloom + ribbons) + mix(pigment, vec3(1.0), 0.65) * cores;
  float onLight = smoothstep(0.4, 0.9, dot(uBackground, vec3(0.299, 0.587, 0.114)));
  vec3 darkScene = uBackground + emission * uIntensity;
  vec3 lightScene = mix(uBackground, pigment * 0.8, 1.0 - exp(-(bloom + ribbons + cores) * uIntensity));
  return mix(darkScene, lightScene, onLight);
}
`;

export function LightPillar(props) {
  return <BackgroundSurface effect="light-pillar" fragment={fragment} {...props} />;
}
