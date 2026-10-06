// Original shared shader utilities. Individual backgrounds supply their own geometry.
export const backgroundVertex = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

export const backgroundUniforms = `
uniform vec2 uResolution;
uniform vec2 uCssResolution;
uniform vec2 uPointer;
uniform vec4 uTrail[16];
uniform vec4 uClicks[4];
uniform float uPointerActive;
uniform float uPressed;
uniform float uTime;
uniform float uIntensity;
uniform float uScale;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBackground;
varying vec2 vUv;
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise21(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 blend = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(cell), hash21(cell + vec2(1.0, 0.0)), blend.x),
             mix(hash21(cell + vec2(0.0, 1.0)), hash21(cell + vec2(1.0, 1.0)), blend.x), blend.y);
}
float fbm(vec2 p) {
  float sum = 0.0;
  float weight = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += weight * noise21(p);
    p = mat2(0.8, -0.6, 0.6, 0.8) * p * 2.03 + 7.1;
    weight *= 0.5;
  }
  return sum;
}
vec3 palette(float t) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5 ? mix(uColor1, uColor2, t * 2.0) : mix(uColor2, uColor3, (t - 0.5) * 2.0);
}
`;

export function compileBackground(gl, source, type) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to allocate background shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || 'Unable to compile background shader');
  }
  return shader;
}
