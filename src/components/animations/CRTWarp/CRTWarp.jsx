'use client';

import { BackgroundSurface } from '../backgroundRuntime.jsx';

const fragment = `
float phosphorField(vec2 p, float time) {
  // Two independently drifting fields split and reconnect into islands;
  // displacement changes their outlines instead of moving a fixed texture.
  vec2 displacement = vec2(
    noise21(p * 0.72 + vec2(time * 0.09, 3.4)),
    noise21(p * 0.72 + vec2(8.2, -time * 0.08))
  ) - 0.5;
  p += displacement * 1.65;
  vec2 diagonal = mat2(0.8, -0.6, 0.6, 0.8) * p;
  return noise21(p + vec2(time * 0.14, time * 0.035)) * 0.72
    + noise21(diagonal * 1.7 + vec2(-time * 0.075, 11.4)) * 0.28;
}
float phosphorSignal(vec2 p, float time) {
  float field = phosphorField(p, time);
  // Broad nested phosphor bands remain visible instead of clipping every
  // positive wave into one solid, overexposed plateau.
  return step(0.42, field) * 0.1 + step(0.47, field) * 0.18
    + step(0.53, field) * 0.29 + step(0.6, field) * 0.43;
}
vec3 shade(vec2 uv, float time) {
  vec2 screen = uv * 2.0 - 1.0;
  vec2 curved = screen * (1.0 + dot(screen, screen) * 0.125);
  vec2 cursor = uv - uPointer;
  curved += cursor * exp(-dot(cursor, cursor) * 11.0) * uPointerActive * 0.8;
  vec2 signalUv = curved * 0.5 + 0.5;
  vec2 cells = max(uCssResolution / 13.0, vec2(1.0));
  vec2 sampled = (floor(signalUv * cells) + 0.5) / cells;
  vec2 spatial = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0) * 5.4 * uScale;
  vec2 p = (sampled - 0.5) * spatial;
  float signal = phosphorSignal(p, time);
  float left = phosphorSignal(p - vec2(0.095, 0.0), time);
  float right = phosphorSignal(p + vec2(0.095, 0.0), time);
  float halo = smoothstep(0.38, 0.65, phosphorField((signalUv - 0.5) * spatial, time));
  float scanline = 0.88 + 0.12 * sin(signalUv.y * 1256.637);
  float grain = (hash21(floor(uv * uCssResolution) + floor(time * 30.0)) - 0.5) * 0.07;
  vec3 phosphor = mix(mix(uColor1, uColor2, 0.12), uColor3, (1.0 - signal) * 0.2);
  vec3 separated = phosphor * mix(vec3(signal), vec3(left, signal, right), 0.3);
  vec3 light = (separated * 0.85 + phosphor * halo * 0.28) * scanline;
  float coverage = max(left, max(signal, right));
  vec3 outputColor = uBackground * (1.0 - coverage) + light + grain;
  return uBackground + (outputColor - uBackground) * uIntensity;
}
`;

export function CRTWarp(props) {
  return <BackgroundSurface effect="crt-warp" fragment={fragment} {...props} />;
}

export default CRTWarp;
