import { createLinearTexture, createProgram } from '../backgroundShader.js';
import { AERO_PARTICLE_COUNT, AERO_VERTEX_STRIDE, createAeroGeometry } from './aeroGeometry.js';

const vertex = `
attribute vec3 aPoint;
attribute vec3 aNormal;
attribute vec4 aSeed;
attribute vec3 aDetail;
uniform float uTime;
uniform float uAspect;
uniform float uScale;
uniform float uChannel;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uPressed;
varying vec3 vNormal;
varying float vDepth;
varying float vFace;
varying float vTint;

mat3 turn(float roll, float yaw, float bearing) {
  float cr = cos(roll), sr = sin(roll);
  float cy = cos(yaw), sy = sin(yaw);
  float cb = cos(bearing), sb = sin(bearing);
  return mat3(cb, sb, 0.0, -sb, cb, 0.0, 0.0, 0.0, 1.0)
    * mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy)
    * mat3(1.0, 0.0, 0.0, 0.0, cr, sr, 0.0, -sr, cr);
}

void main() {
  float phase = aSeed.x * 6.2831853;
  float depth = aSeed.y * aSeed.y;
  float z = -2.6 + depth * 3.9 + sin(uTime * 0.23 + phase) * 0.10;
  float perspective = 2.6 / (3.2 - z);
  float travel = fract(aSeed.x + uTime * (0.018 + depth * 0.016));
  float x = (travel * 2.8 - 1.4) * max(uAspect, 2.15);
  float flow = 0.12 - sin(x * 0.82 + uTime * 0.13) * 0.28;
  float turbulence = sin(x * 2.4 + phase * 3.0 + uTime * 0.43) * 0.095
    + cos(phase * 7.0 - uTime * 0.29) * 0.045;
  vec2 stream = vec2(x, flow + aDetail.x + turbulence);
  vec2 pointer = (uPointer - 0.5) * vec2(2.0 * uAspect, 2.0) / uScale;
  vec2 delta = stream - pointer;
  float distance = length(delta);
  stream += delta / max(distance, 0.001) * exp(-distance * distance * 7.0)
    * uPointerActive * (1.0 - uPressed) * 0.18;

  // Each particle follows its own orbit; hold preserves its identity and depth.
  float orbit = phase + uTime * (0.35 + depth * 0.45);
  float radius = 0.025 + pow(aSeed.w, 1.6) * 0.42;
  vec2 cloud = pointer + vec2(cos(orbit), sin(orbit)) * radius;
  cloud += vec2(sin(phase * 13.0 + uTime * 0.4), cos(phase * 11.0 - uTime * 0.3)) * 0.025;
  vec2 center = mix(stream, cloud, uPressed);
  float bearing = atan(-0.23 * cos(x * 0.82 + uTime * 0.13))
    + sin(phase * 9.0 + uTime * 0.24) * 0.24;
  bearing = mix(bearing, orbit + 1.5707963, uPressed);
  float roll = phase * 5.0 + uTime * (0.45 + aSeed.w * 0.75) * mix(-1.0, 1.0, step(0.5, aDetail.z));
  mat3 rotation = turn(roll, sin(phase * 3.0 + uTime * 0.27) * 0.65, bearing);
  float size = (0.006 + pow(aSeed.z, 3.0) * 0.064) * mix(1.0, 0.32, uPressed);
  vec3 point = rotation * (aPoint * size);
  vec2 projected = (center + point.xy * perspective) * uScale;
  vec2 clip = projected / vec2(uAspect, 1.0);
  vNormal = normalize(rotation * aNormal);
  // Each colour pass has independent triangle coverage and depth, including
  // exposed RGB fringes. Optical dispersion grows toward the image edge.
  clip += uChannel * (clip * 0.007 + vNormal.xy * 0.0005);
  gl_Position = vec4(clip, -(z + point.z + 0.4) / 4.0, 1.0);
  vDepth = depth;
  vFace = aDetail.y;
  vTint = aDetail.z;
}
`;

const fragment = `
precision mediump float;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBackground;
uniform float uIntensity;
varying vec3 vNormal;
varying float vDepth;
varying float vFace;
varying float vTint;
void main() {
  vec3 normal = normalize(vNormal);
  if (normal.z < 0.0) normal = -normal;
  float light = max(0.0, dot(normal, normalize(vec3(-0.6, 0.8, 1.1))));
  float reflection = pow(max(0.0, dot(normal, normalize(vec3(-0.35, 0.4, 1.0)))), 13.0);
  float edgeReflection = pow(1.0 - abs(normal.z), 3.0);
  vec3 tint = mix(uColor1, uColor3, vTint * 0.65);
  tint = mix(tint, uColor2, edgeReflection * 0.22);
  vec3 pearl = mix(tint, vec3(1.0), 0.18 + light * 0.42 + reflection * 0.38);
  pearl *= 0.37 + light * 0.48 + reflection * 0.42 + vFace * 0.09;
  float lightSurface = smoothstep(0.4, 0.7, dot(uBackground, vec3(0.2126, 0.7152, 0.0722)));
  pearl = mix(pearl, tint * (0.32 + light * 0.48) + reflection * 0.22, lightSurface * 0.8);
  float visibility = (0.20 + vDepth * 0.76) * uIntensity;
  gl_FragColor = vec4(mix(uBackground, pearl, clamp(visibility, 0.0, 1.0)), 1.0);
}
`;

/** Private bounded mesh renderer. BackgroundSurface owns time, input and lifecycle. */
export function createAeroRenderer(gl) {
  let program, buffer, texture, framebuffer, depthBuffer;
  const shaders = [];
  const dispose = () => {
    if (texture) gl.deleteTexture(texture);
    if (framebuffer) gl.deleteFramebuffer(framebuffer);
    if (depthBuffer) gl.deleteRenderbuffer(depthBuffer);
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    shaders.forEach(shader => gl.deleteShader(shader));
  };
  try {
    program = createProgram(gl, vertex, fragment, shaders, 'AeroShards');
    buffer = gl.createBuffer();
    texture = createLinearTexture(gl);
    framebuffer = gl.createFramebuffer();
    depthBuffer = gl.createRenderbuffer();
    if (!buffer || !texture || !framebuffer || !depthBuffer) throw new Error('Unable to allocate AeroShards mesh');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, createAeroGeometry(), gl.STATIC_DRAW);
    const attributes = [['aPoint', 3, 0], ['aNormal', 3, 3], ['aSeed', 4, 6], ['aDetail', 3, 10]]
      .map(([name, size, offset]) => ({ location: gl.getAttribLocation(program, name), size, offset }));
    const names = ['uTime', 'uAspect', 'uScale', 'uChannel', 'uPointer', 'uPointerActive', 'uPressed',
      'uColor1', 'uColor2', 'uColor3', 'uBackground', 'uIntensity'];
    const uniforms = Object.fromEntries(names.map(name => [name, gl.getUniformLocation(program, name)]));
    let allocatedWidth = 0;
    let allocatedHeight = 0;
    return {
      texture,
      step({ time, pointer, pointerActive, pressed, width, height, bufferWidth, bufferHeight, colors, background, scale, intensity }) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        if (allocatedWidth !== bufferWidth || allocatedHeight !== bufferHeight) {
          allocatedWidth = bufferWidth;
          allocatedHeight = bufferHeight;
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, bufferWidth, bufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
          gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
          gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, bufferWidth, bufferHeight);
          gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
          if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('Unable to render AeroShards depth');
        }
        gl.viewport(0, 0, bufferWidth, bufferHeight);
        gl.disable(gl.BLEND);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.SCISSOR_TEST);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.depthMask(true);
        gl.colorMask(true, true, true, true);
        gl.clearColor(...background, 1);
        gl.clearDepth(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        for (const attribute of attributes) {
          gl.enableVertexAttribArray(attribute.location);
          gl.vertexAttribPointer(attribute.location, attribute.size, gl.FLOAT, false, AERO_VERTEX_STRIDE * 4, attribute.offset * 4);
        }
        gl.uniform1f(uniforms.uTime, time);
        gl.uniform1f(uniforms.uAspect, width / height);
        gl.uniform1f(uniforms.uScale, scale);
        gl.uniform1f(uniforms.uIntensity, intensity);
        gl.uniform2fv(uniforms.uPointer, pointer);
        gl.uniform1f(uniforms.uPointerActive, pointerActive);
        gl.uniform1f(uniforms.uPressed, pressed);
        gl.uniform3fv(uniforms.uBackground, background);
        colors.forEach((color, index) => gl.uniform3fv(uniforms[`uColor${index + 1}`], color));
        for (let channel = 0; channel < 3; channel++) {
          gl.colorMask(channel === 0, channel === 1, channel === 2, false);
          gl.clear(gl.DEPTH_BUFFER_BIT);
          gl.uniform1f(uniforms.uChannel, channel - 1);
          gl.drawArrays(gl.TRIANGLES, 0, AERO_PARTICLE_COUNT * 12);
        }
        attributes.forEach(attribute => gl.disableVertexAttribArray(attribute.location));
      },
      dispose
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
