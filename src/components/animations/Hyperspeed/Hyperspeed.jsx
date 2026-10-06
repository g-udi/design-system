'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { bounded } from '../animationRuntime.js';
import { createHyperspeedMotion } from './hyperspeedMotion.js';

const fragment = `
uniform float uTravel;
uniform float uCurvature;
uniform float uTrailLength;
vec3 shade(vec2 uv, float time) {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float horizon = -0.035 + sin(time * 0.12) * 0.018;
  float below = horizon - p.y;
  vec3 sky = uBackground;
  if (below <= 0.002) return sky;
  float depth = 1.25 / below;
  float turn = sin(depth * 0.023 + time * 0.13) * uCurvature * 9.0;
  turn += sin(depth * 0.047 - time * 0.09) * uCurvature * 2.0;
  float roadX = p.x * depth - turn + (uPointer.x - 0.5) * uPointerActive * 1.3;
  roadX *= uScale;
  float fog = exp(-depth * 0.007) * (1.0 - smoothstep(140.0, 240.0, depth));
  float road = 1.0 - smoothstep(6.8, 7.0, abs(roadX));
  vec3 paint = mix(uBackground, uColor1, road * fog * 0.035 * uIntensity);
  float edge = exp(-abs(abs(roadX) - 6.8) * 18.0) * 0.2;
  vec3 light = uColor3 * edge;
  for (int lane = 0; lane < 16; lane++) {
    float laneIndex = float(lane);
    float center = (laneIndex - 7.5) * 0.8;
    float direction = laneIndex < 8.0 ? 1.0 : -0.7;
    float z = depth + uTravel * direction;
    float span = 23.0 + laneIndex * 0.9;
    float part = mod(z + laneIndex * 13.7, span);
    float length = uTrailLength * (4.0 + 4.0 * hash21(vec2(laneIndex, floor(z / span)))) * (1.0 + uPressed * 1.7);
    float segment = smoothstep(0.0, 0.8, part) * (1.0 - smoothstep(length, length + 1.0, part));
    float pair = abs(abs(roadX - center) - 0.13);
    float pixel = depth / uCssResolution.y;
    float core = 1.0 - smoothstep(0.018, 0.06 + pixel, pair);
    float glow = exp(-pair * 7.0) * 0.3;
    vec3 color = laneIndex < 8.0 ? mix(uColor1, uColor3, laneIndex * 0.07) : mix(uColor2, uColor3, (laneIndex - 8.0) * 0.07);
    light += color * (core + glow) * segment;
  }
  float dash = step(0.5, fract((depth + uTravel) / 8.0));
  float marking = exp(-abs(abs(roadX) - 2.85) * 25.0) * dash * 0.055;
  light += uColor3 * marking;
  float brightness = max(light.r, max(light.g, light.b));
  return mix(paint, light / max(brightness, 0.0001), clamp(brightness * fog * uIntensity, 0.0, 1.0));
}
`;

export function Hyperspeed({ curvature = 1, trailLength = 1.5, ...props }) {
  return <BackgroundSurface effect="hyperspeed" fragment={fragment} createSimulation={createHyperspeedMotion} interactive {...props}
    uniforms={{ uCurvature: bounded(curvature, 1, 0, 2), uTrailLength: bounded(trailLength, 1.5, 0.25, 4) }} />;
}

export default Hyperspeed;
