import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('AeroShards server output preserves foreground content and decorative semantics', async () => {
  const module = await loadComponent(new URL('../../../../src/components/animations/AeroShards/index.js', import.meta.url));
  assert.equal(module.default, module.AeroShards);
  const render = () => renderToStaticMarkup(createElement(module.AeroShards, {
    paused: true,
    height: 280,
    'data-consumer': 'kept',
    children: createElement('h2', null, 'Readable <content>')
  }));
  const html = render();
  assert.equal(render(), html);
  assert.match(html, /data-slot="aero-shards"/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /data-consumer="kept"/);
  assert.match(html, /<canvas[^>]*aria-hidden="true"/);
  assert.match(html, /<h2>Readable &lt;content&gt;<\/h2>/);
  assert.doesNotMatch(html, /aria-live|NaN|Infinity/);
});

// These private geometry checks guard the previously flat, repeated-diamond regression.
test('AeroShards builds a deterministic bounded mesh with asymmetric non-coplanar facets', async () => {
  const { createAeroGeometry, AERO_PARTICLE_COUNT, AERO_VERTEX_STRIDE } = await import('../../../../src/components/animations/AeroShards/aeroGeometry.js');
  const vertices = createAeroGeometry();
  assert.deepEqual(vertices, createAeroGeometry());
  assert.ok(AERO_PARTICLE_COUNT > 0 && AERO_PARTICLE_COUNT <= 2000);
  assert.equal(vertices.length, AERO_PARTICLE_COUNT * 12 * AERO_VERTEX_STRIDE);
  assert.ok(vertices.every(Number.isFinite));
  const firstNormal = vertices.slice(3, 6);
  const secondNormal = vertices.slice(3 * AERO_VERTEX_STRIDE + 3, 3 * AERO_VERTEX_STRIDE + 6);
  assert.ok(Math.hypot(...firstNormal.map((value, index) => value - secondNormal[index])) > 0.1);
  const sizes = new Set();
  const depths = new Set();
  for (let i = 0; i < vertices.length; i += 12 * AERO_VERTEX_STRIDE) {
    assert.ok(Math.abs(Math.hypot(...vertices.slice(i + 3, i + 6)) - 1) < 0.0001);
    sizes.add(vertices[i + 8].toFixed(2));
    depths.add(vertices[i + 7].toFixed(2));
  }
  assert.ok(sizes.size > 80 && depths.size > 80, 'Independent size and depth ranges must not collapse to uniform tiles');
});

function recordingGl(failedAllocation) {
  const created = [];
  const deleted = [];
  const uploads = [];
  const draws = [];
  const values = new Map();
  const gl = {};
  for (const name of ['VERTEX_SHADER', 'FRAGMENT_SHADER', 'COMPILE_STATUS', 'LINK_STATUS', 'ARRAY_BUFFER', 'STATIC_DRAW',
    'TEXTURE_2D', 'TEXTURE_MIN_FILTER', 'TEXTURE_MAG_FILTER', 'TEXTURE_WRAP_S', 'TEXTURE_WRAP_T', 'LINEAR', 'CLAMP_TO_EDGE',
    'FRAMEBUFFER', 'RGBA', 'UNSIGNED_BYTE', 'COLOR_ATTACHMENT0', 'RENDERBUFFER', 'DEPTH_COMPONENT16', 'DEPTH_ATTACHMENT',
    'FRAMEBUFFER_COMPLETE', 'BLEND', 'CULL_FACE', 'SCISSOR_TEST', 'DEPTH_TEST', 'LEQUAL', 'FLOAT', 'TRIANGLES']) gl[name] = name;
  gl.COLOR_BUFFER_BIT = 1;
  gl.DEPTH_BUFFER_BIT = 2;
  for (const type of ['Shader', 'Program', 'Buffer', 'Texture', 'Framebuffer', 'Renderbuffer']) {
    gl[`create${type}`] = () => {
      if (failedAllocation === type) return null;
      const resource = { type, id: created.length };
      created.push(resource);
      return resource;
    };
    gl[`delete${type}`] = resource => deleted.push(resource);
  }
  for (const name of ['shaderSource', 'compileShader', 'attachShader', 'linkProgram', 'bindBuffer', 'bufferData', 'bindTexture',
    'texParameteri', 'bindFramebuffer', 'framebufferTexture2D', 'bindRenderbuffer', 'renderbufferStorage', 'framebufferRenderbuffer',
    'viewport', 'disable', 'enable', 'depthFunc', 'depthMask', 'colorMask', 'clearColor', 'clearDepth', 'clear', 'useProgram',
    'enableVertexAttribArray', 'vertexAttribPointer', 'disableVertexAttribArray']) gl[name] = () => {};
  gl.getShaderParameter = gl.getProgramParameter = () => true;
  gl.getAttribLocation = () => 0;
  gl.getUniformLocation = (_, name) => name;
  gl.checkFramebufferStatus = () => gl.FRAMEBUFFER_COMPLETE;
  gl.texImage2D = (...args) => uploads.push(args);
  gl.drawArrays = (...args) => draws.push(args);
  for (const name of ['uniform1f', 'uniform2fv', 'uniform3fv']) gl[name] = (location, value) => values.set(location, value);
  return { gl, created, deleted, uploads, draws, values };
}

test('AeroShards reuses GPU resources between frames, resizes storage, and disposes the complete mesh', async () => {
  const { createAeroRenderer } = await import('../../../../src/components/animations/AeroShards/aeroRenderer.js');
  const { gl, created, deleted, uploads, draws, values } = recordingGl();
  const renderer = createAeroRenderer(gl);
  const count = created.length;
  const frame = { time: 1, pointer: [0.5, 0.5], pointerActive: 0, pressed: 0, width: 320, height: 500,
    bufferWidth: 480, bufferHeight: 750, colors: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], background: [0, 0, 0], scale: 1, intensity: 1 };
  renderer.step(frame);
  renderer.step({ ...frame, time: 2, pressed: 1 });
  assert.equal(created.length, count);
  assert.equal(uploads.length, 1);
  assert.equal(draws.length, 6, 'Three independently depth-tested colour passes per frame');
  assert.equal(values.get('uPressed'), 1);
  assert.equal(values.get('uTime'), 2);
  renderer.step({ ...frame, bufferWidth: 1620 });
  assert.equal(uploads.length, 2);
  renderer.dispose();
  assert.deepEqual(new Set(deleted), new Set(created));
  assert.equal(deleted.length, created.length);
});

test('AeroShards releases partially allocated GPU resources when setup fails', async () => {
  const { createAeroRenderer } = await import('../../../../src/components/animations/AeroShards/aeroRenderer.js');
  for (const type of ['Program', 'Buffer', 'Texture', 'Framebuffer', 'Renderbuffer']) {
    const { gl, created, deleted } = recordingGl(type);
    assert.throws(() => createAeroRenderer(gl), /Unable to allocate AeroShards/);
    assert.deepEqual(new Set(deleted), new Set(created));
    assert.equal(deleted.length, created.length);
  }
});
