'use client';

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/**
 * Compiles a full-canvas fragment shader into a WebGL program sized to `size` CSS pixels (at most
 * 2x device pixels) and returns `{ uniform, draw, drop }`, or null when compiling or linking fails.
 * `uniform(name)` looks up a location; `draw()` paints one frame; `drop()` frees the GL objects.
 */
export function createOrbProgram(gl, canvas, fragment, size) {
  const shaders = [];
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vert = compile(gl.VERTEX_SHADER, VERTEX);
  const frag = compile(gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const drop = () => {
    for (const shader of shaders) gl.deleteShader(shader);
    if (program) gl.deleteProgram(program);
    if (buffer) gl.deleteBuffer(buffer);
  };
  if (!vert || !frag || !program || !buffer) {
    drop();
    return null;
  }
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    drop();
    return null;
  }
  gl.useProgram(program);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const px = Math.max(1, Math.round(size * dpr));
  canvas.width = px;
  canvas.height = px;
  gl.viewport(0, 0, px, px);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ -1, -1, 3, -1, -1, 3 ]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const sizeLocation = gl.getUniformLocation(program, 'uSize');
  if (sizeLocation) gl.uniform1f(sizeLocation, px);
  return {
    uniform: (name) => gl.getUniformLocation(program, name),
    draw: () => gl.drawArrays(gl.TRIANGLES, 0, 3),
    drop
  };
}
