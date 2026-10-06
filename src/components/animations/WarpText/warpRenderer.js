// A text texture sampled through a moving, local lens. No external assets or renderer dependency.
const vertex = `
attribute vec2 position;
varying vec2 uv;
void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }
`;
const fragment = `
precision mediump float;
varying vec2 uv;
uniform sampler2D lettering;
uniform vec2 pointer;
uniform float aspect, time, ambient, scale, radius, strength, hover, ripple, refraction;
void main() {
  vec2 ratio = vec2(aspect, 1.);
  vec2 field = uv * ratio * scale * 6.;
  vec2 drift = vec2(sin(field.y + time) * cos(field.x * .7 - time * .6),
                    cos(field.x - time * .8) * sin(field.y * .8 + time));
  vec2 delta = (uv - pointer) * ratio;
  float distance = length(delta);
  float weight = 1. - smoothstep(0., radius, distance);
  float lens = weight * weight * hover * strength;
  vec2 bend = -delta * lens * .72;
  bend += normalize(delta + vec2(.0001)) * sin(distance * 42. - time * 5.) * lens * ripple * .022;
  vec2 sampleUV = uv + (drift * ambient * .12 + bend) / ratio;
  vec2 fringe = (drift * ambient + delta * lens) * refraction / ratio;
  vec4 red = texture2D(lettering, sampleUV + fringe);
  vec4 green = texture2D(lettering, sampleUV);
  vec4 blue = texture2D(lettering, sampleUV - fringe);
  float alpha = max(red.a, max(green.a, blue.a));
  gl_FragColor = vec4(red.r * red.a, green.g * green.a, blue.b * blue.a, alpha);
}
`;

export function createWarpRenderer(canvas) {
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' }); } catch { return null; }
  if (!gl) return null;
  const shaders = [];
  const compile = (kind, source) => {
    const shader = gl.createShader(kind);
    if (!shader) return null;
    shaders.push(shader);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vert = compile(gl.VERTEX_SHADER, vertex), frag = compile(gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram(), buffer = gl.createBuffer(), texture = gl.createTexture();
  const dispose = () => {
    shaders.forEach(shader => gl.deleteShader(shader));
    if (program) gl.deleteProgram(program);
    if (buffer) gl.deleteBuffer(buffer);
    if (texture) gl.deleteTexture(texture);
  };
  if (!vert || !frag || !program || !buffer || !texture) { dispose(); return null; }
  gl.attachShader(program, vert); gl.attachShader(program, frag); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return null; }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const uniforms = Object.fromEntries(['pointer', 'aspect', 'time', 'ambient', 'scale', 'radius', 'strength', 'hover', 'ripple', 'refraction'].map(name => [name, gl.getUniformLocation(program, name)]));
  return {
    upload(mask) {
      canvas.width = mask.width; canvas.height = mask.height;
      gl.viewport(0, 0, mask.width, mask.height);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
    },
    draw({ x, y, ...values }) {
      gl.uniform2f(uniforms.pointer, x, y);
      Object.entries(values).forEach(([name, value]) => gl.uniform1f(uniforms[name], value));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose
  };
}

export function createWarpTextMask(root, text, width, height) {
  const mask = document.createElement('canvas');
  const ratio = Math.min(window.devicePixelRatio || 1, 2, 2048 / width, 2048 / height);
  mask.width = Math.max(1, Math.round(width * ratio)); mask.height = Math.max(1, Math.round(height * ratio));
  const context = mask.getContext('2d');
  if (!context) return null;
  context.scale(ratio, ratio);
  const style = getComputedStyle(root);
  const lines = String(text ?? '').split('\n');
  const requested = parseFloat(style.fontSize) || 64;
  const lineHeight = (parseFloat(style.lineHeight) || requested * 1.2) / requested;
  const setFont = size => {
    context.font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;
    if ('letterSpacing' in context) context.letterSpacing = `${(parseFloat(style.letterSpacing) || 0) * size / requested}px`;
  };
  setFont(requested);
  const natural = Math.max(1, ...lines.map(line => context.measureText(line).width));
  // Reserve room for the lens at both edges, including very narrow containers.
  const fontSize = requested * Math.min(1, width * .84 / natural, height * .68 / (lines.length * requested * lineHeight));
  setFont(Math.max(1, fontSize));
  context.fillStyle = style.color; context.textAlign = 'center'; context.textBaseline = 'middle';
  lines.forEach((line, i) => context.fillText(line, width / 2, height / 2 + (i - (lines.length - 1) / 2) * fontSize * lineHeight));
  return mask;
}
