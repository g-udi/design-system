'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';
import { createAeroRenderer } from './aeroRenderer.js';

const fragment = `
uniform sampler2D uField;
vec3 shade(vec2 uv, float time) {
  return texture2D(uField, uv).rgb;
}
`;

export function AeroShards({ speed = 1, interactive = true, ...props }) {
  return <BackgroundSurface {...props} interactive={interactive} speed={speed} effect="aero-shards"
    fragment={fragment} createSimulation={createAeroRenderer} />;
}

export default AeroShards;
