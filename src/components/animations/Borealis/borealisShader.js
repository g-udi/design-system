// Independently authored light curtains and soft horizontal emission bands.
export const borealisFragment = `
uniform float uSoft;
uniform float uAmplitude;
uniform float uBlend;
vec3 shade(vec2 uv, float time) {
  float x = uv.x * uScale;
  float flow = time * 0.18;
  float ridge = noise21(vec2(x * 4.3 + flow, flow * 0.6));
  ridge += noise21(vec2(x * 8.1 - flow * 0.7, 3.4 + flow)) * 0.26;
  float light;
  vec3 tint;
  if (uSoft > 0.5) {
    float center = 0.48 + (ridge - 0.61) * 0.32 * uAmplitude;
    float spread = mix(0.02, 0.10, uBlend);
    float distance = abs(uv.y - center);
    light = exp(-distance * distance / (spread * spread)) * 0.75;
    light += exp(-distance / (spread * 1.8)) * 0.3;
    float second = abs(uv.y - center - sin(x * 8.0 + flow) * 0.026);
    light += exp(-second * second / 0.00028) * 0.2;
    tint = palette(0.5 + 0.48 * sin(x * 4.6 - flow * 0.7));
  } else {
    float edge = 0.84 - (ridge - 0.3) * 0.5 * uAmplitude;
    float spread = mix(0.08, 0.36, uBlend);
    float below = max(edge - uv.y, 0.0);
    light = exp(-below * below / (spread * spread)) * (0.63 + 0.37 * ridge);
    light *= smoothstep(0.0, 0.38, uv.y);
    tint = palette(uv.x);
  }
  return mix(uBackground, tint, clamp(light * uIntensity, 0.0, 1.0));
}
`;
