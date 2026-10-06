'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

const fragment = `
float waveHeight(vec2 point, float time) {
  vec2 p = point * uScale * 0.66;
  p += vec2(sin(p.y * 0.17 + time * 0.07), cos(p.x * 0.19 - time * 0.06)) * 1.4;
  return sin(p.x * 0.9 + p.y * 0.68 - time * 0.22) * 0.42
    + sin(p.x * 1.7 - p.y * 0.44 + time * 0.15) * 0.19
    + cos(p.x * 0.47 + p.y * 1.2 + time * 0.1) * 0.16;
}
vec3 shade(vec2 uv, float time) {
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / max(uResolution.y, 1.0);
  vec3 origin = vec3((uPointer.x - 0.5) * uPointerActive * 0.55, 1.55, -2.5);
  vec3 ray = normalize(vec3(p.x * 0.8, p.y * 0.75 - 0.16 + (uPointer.y - 0.5) * uPointerActive * 0.055, 1.0));
  float travel = 48.0;
  float hit = 0.0;
  vec3 position = origin;
  // Every crest lies between -0.77 and 0.77. Search that entire slab so
  // grazing rays cannot exhaust small distance steps and leave holes.
  if (ray.y < -0.0001) {
    float near = (origin.y - 0.78) / -ray.y;
    float far = min((origin.y + 0.78) / -ray.y, 48.0);
    float before = near;
    if (near < far) {
      for (int i = 0; i < 48; i++) {
        float candidate = mix(near, far, (float(i) + 1.0) / 48.0);
        vec3 samplePoint = origin + ray * candidate;
        if (samplePoint.y <= waveHeight(samplePoint.xz, time)) {
          float after = candidate;
          for (int refinement = 0; refinement < 8; refinement++) {
            float middle = (before + after) * 0.5;
            vec3 midpoint = origin + ray * middle;
            if (midpoint.y > waveHeight(midpoint.xz, time)) before = middle;
            else after = middle;
          }
          travel = (before + after) * 0.5;
          hit = 1.0;
          break;
        }
        before = candidate;
      }
    }
  }
  position = origin + ray * travel;
  float haze = exp(-travel * 0.12) * (1.0 - smoothstep(18.0, 42.0, travel));
  float height = waveHeight(position.xz, time);
  float dx = waveHeight(position.xz + vec2(0.025, 0.0), time) - height;
  float dz = waveHeight(position.xz + vec2(0.0, 0.025), time) - height;
  vec3 normal = normalize(vec3(-dx, 0.025, -dz));
  float light = clamp(dot(normal, normalize(vec3(-0.5, 0.9, -0.4))), 0.0, 1.0);
  vec3 crest = mix(uColor2, mix(uColor3, vec3(1.0), 0.35), light * light * 0.65);
  vec3 water = mix(uColor1, crest, smoothstep(-0.77, 0.77, height) * 0.7 + light * 0.2);
  water *= 0.55 + 0.45 * light;
  vec3 sky = mix(uBackground, uColor1, 0.055 * exp(-abs(p.y - 0.12) * 5.0) * uIntensity);
  float grain = (hash21(uv * uCssResolution + floor(time * 20.0)) - 0.5) * 0.012;
  return mix(sky, water, clamp(hit * haze * uIntensity, 0.0, 1.0)) + grain * uIntensity;
}
`;

export function GradientWaves(props) {
  return <BackgroundSurface effect="gradient-waves" fragment={fragment} {...props} />;
}

export default GradientWaves;
