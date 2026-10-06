'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { createLiquidEtherSimulation } from './liquidEtherSimulation.js';

const fragment = `
uniform sampler2D uField;
vec3 shade(vec2 uv, float time) {
  vec2 point = (uv - 0.5) * uScale + 0.5;
  vec3 dye = texture2D(uField, clamp(point, 0.0, 1.0)).rgb;
  float total = dye.r + dye.g + dye.b;
  vec3 color = (uColor1 * dye.r + uColor2 * dye.g + uColor3 * dye.b) / max(total, 0.001);
  color = mix(color, vec3(1.0), smoothstep(0.6, 2.0, total) * 0.32);
  float density = 1.0 - exp(-total * 2.4);
  float bounds = step(0.0, point.x) * step(point.x, 1.0) * step(0.0, point.y) * step(point.y, 1.0);
  return mix(uBackground, color, clamp(density * uIntensity * bounds, 0.0, 1.0));
}
`;

export function LiquidEther({ interactive = true, ...props }) {
  return <BackgroundSurface effect="liquid-ether" fragment={fragment} {...props} interactive={interactive} createSimulation={createLiquidEtherSimulation} />;
}

export default LiquidEther;
