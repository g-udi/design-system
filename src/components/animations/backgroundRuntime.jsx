'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utilities/cn/cn.js';
import { observeTheme } from '../../themes/observeTheme.js';
import { useAnimation, bounded } from './animationRuntime.js';
import { backgroundVertex, backgroundUniforms, createProgram } from './backgroundShader.js';
import { createBackgroundPointer } from './backgroundPointer.js';
import { releaseDetachedWebGLContext } from './webglLifecycle.js';

const defaultColors = ['var(--ds-color-chart-1)', 'var(--ds-color-chart-2)', 'var(--ds-color-chart-3)'];

/** A CSS height for a background: numbers are bounded pixels, other values pass through. */
export const backgroundHeight = height => typeof height === 'number' ? bounded(height, 360, 1, 4096) : height;

/** Shared canvas lifecycle; each owner supplies an independently authored fragment shader. */
export function BackgroundSurface({
  effect, fragment, paused = false, speed = 1, intensity = 1, scale = 1,
  colors, background = 'var(--ds-color-surface)', interactive = false,
  height = 360, className, style, children, ref: forwardedRef,
  onPointerMove, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp, onPointerCancel,
  uniforms = {}, canvasStyle, createSimulation, ...props
}) {
  const { ref, root, active } = useAnimation(paused, forwardedRef);
  const canvasRef = useRef(null);
  const engine = useRef(null);
  const clock = useRef(0);
  const input = useRef(null);
  if (!input.current) input.current = createBackgroundPointer();
  const [renderer, setRenderer] = useState('loading');
  const [contextVersion, setContextVersion] = useState(0);
  const options = useRef(null);
  options.current = {
    active, speed: bounded(speed, 1, 0, 5), intensity: bounded(intensity, 1, 0, 2),
    scale: bounded(scale, 1, 0.25, 4), colors, background, uniforms
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = root.current;
    delete canvas.dataset.renderError;
    let gl;
    let program;
    let buffer;
    let simulation;
    let cssWidth = 1;
    let cssHeight = 1;
    let resolvedColors;
    let resolvedBackground;
    const shaders = [];
    let frame = 0;
    let lastTime = 0;
    let disposed = false;
    let resizeObserver;
    let stopObservingTheme;
    let probe;
    const fail = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!disposed) setRenderer('fallback');
    };
    const lost = event => { event.preventDefault(); fail(); };
    const restored = () => { if (!disposed) setContextVersion(value => value + 1); };
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);

    const cleanup = () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      stopObservingTheme?.();
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
      probe?.remove();
      if (gl) {
        simulation?.dispose?.();
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        shaders.forEach(shader => gl.deleteShader(shader));
        releaseDetachedWebGLContext(gl);
      }
      engine.current = null;
    };

    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
      if (!gl) { canvas.dataset.renderError = 'WebGL is unavailable'; fail(); return cleanup; }
      const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision ? 'highp' : 'mediump';
      program = createProgram(gl, backgroundVertex, `precision ${precision} float;\n${backgroundUniforms}\n${fragment}\nvoid main() { gl_FragColor = vec4(clamp(shade(vUv, uTime), 0.0, 1.0), 1.0); }`, shaders);
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'aPosition');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const locations = new Map();
      const location = name => {
        if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
        return locations.get(name);
      };
      simulation = createSimulation?.(gl);

      // Let the browser resolve CSS colours (including local variables and modern colour spaces).
      probe = document.createElement('span');
      probe.setAttribute('aria-hidden', 'true');
      probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:0;overflow:hidden';
      host.appendChild(probe);
      const pixel = document.createElement('canvas');
      pixel.width = pixel.height = 1;
      const context = pixel.getContext('2d', { willReadFrequently: true });
      const color = (value, fallback) => {
        probe.style.color = fallback;
        if (typeof value === 'string' && CSS.supports('color', value)) probe.style.color = value;
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = getComputedStyle(probe).color;
        context.fillRect(0, 0, 1, 1);
        return Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3).map(channel => channel / 255);
      };
      const refreshColors = () => {
        gl.useProgram(program);
        resolvedColors = defaultColors.map((fallback, index) => color(options.current.colors?.[index], fallback));
        resolvedBackground = color(options.current.background, 'var(--ds-color-surface)');
        resolvedColors.forEach((value, index) => gl.uniform3fv(location(`uColor${index + 1}`), value));
        gl.uniform3fv(location('uBackground'), resolvedBackground);
      };
      const draw = (delta = 0) => {
        if (disposed || gl.isContextLost()) return;
        const state = input.current;
        state.step(delta, clock.current);
        simulation?.step({ delta, time: clock.current, pointer: state.pointer,
          previousPointer: state.previousPointer, pointerActive: state.pointerActive,
          pressed: state.pressed, width: cssWidth, height: cssHeight,
          bufferWidth: canvas.width, bufferHeight: canvas.height,
          scale: options.current.scale, intensity: options.current.intensity,
          colors: resolvedColors, background: resolvedBackground });
        // A private simulation may use its own program, framebuffer and vertex buffer.
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.SCISSOR_TEST);
        gl.colorMask(true, true, true, true);
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        if (simulation?.texture) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, simulation.texture);
          gl.uniform1i(location('uField'), 0);
        }
        gl.uniform2f(location('uResolution'), canvas.width, canvas.height);
        gl.uniform2f(location('uCssResolution'), cssWidth, cssHeight);
        gl.uniform2fv(location('uPointer'), state.pointer);
        gl.uniform4fv(location('uTrail[0]'), state.trail);
        gl.uniform4fv(location('uClicks[0]'), state.clicks);
        gl.uniform1f(location('uPointerActive'), state.pointerActive);
        gl.uniform1f(location('uPressed'), state.pressed);
        gl.uniform1f(location('uTime'), clock.current);
        gl.uniform1f(location('uIntensity'), options.current.intensity);
        gl.uniform1f(location('uScale'), options.current.scale);
        Object.entries(options.current.uniforms).forEach(([name, value]) => {
          if (Number.isFinite(value)) gl.uniform1f(location(name), value);
        });
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      const tick = now => {
        frame = 0;
        if (disposed || !options.current.active || options.current.speed === 0 || gl.isContextLost()) return;
        if (!lastTime) lastTime = now;
        const elapsed = now - lastTime;
        // Cap sustained drawing at 30fps and avoid catch-up jumps after a hidden tab.
        if (elapsed >= 1000 / 30) {
          const delta = Math.min(elapsed, 100) / 1000 * options.current.speed;
          clock.current += delta;
          lastTime = now;
          draw(delta);
        }
        frame = requestAnimationFrame(tick);
      };
      const update = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        refreshColors();
        draw();
        if (options.current.active && options.current.speed > 0) frame = requestAnimationFrame(tick);
      };
      const resize = () => {
        const bounds = host.getBoundingClientRect();
        cssWidth = Math.max(1, bounds.width);
        cssHeight = Math.max(1, bounds.height);
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(2000000 / Math.max(1, bounds.width * bounds.height)));
        canvas.width = Math.max(1, Math.round(bounds.width * ratio));
        canvas.height = Math.max(1, Math.round(bounds.height * ratio));
        gl.viewport(0, 0, canvas.width, canvas.height);
        draw();
      };
      engine.current = { update };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      stopObservingTheme = observeTheme(host, update);
      refreshColors();
      resize();
      update();
      setRenderer('webgl');
    } catch (error) {
      canvas.dataset.renderError = error.message;
      fail();
    }
    return cleanup;
  }, [fragment, contextVersion, root, createSimulation]);

  // Props update uniforms without reallocating the renderer or resetting the retained phase.
  const colorKey = Array.isArray(colors) ? colors.join('|') : '';
  const uniformKey = JSON.stringify(uniforms);
  useEffect(() => { engine.current?.update(); }, [active, speed, intensity, scale, colorKey, background, uniformKey]);
  useEffect(() => {
    if (!interactive) input.current.reset();
    else if (!active) input.current.release();
    engine.current?.update();
  }, [active, interactive]);

  const movePointer = event => {
    if (!interactive || !active || options.current.speed === 0 || event.defaultPrevented) return false;
    if (event.target.closest?.('button, input, textarea, select, a[href], [role="button"], [contenteditable="true"]')) return false;
    const bounds = event.currentTarget.getBoundingClientRect();
    input.current.move([bounded((event.clientX - bounds.left) / bounds.width, 0.5, 0, 1), bounded(1 - (event.clientY - bounds.top) / bounds.height, 0.5, 0, 1)]);
    return true;
  };

  const animated = renderer === 'webgl' && active && options.current.speed > 0;
  return <div {...props} ref={ref} className={cn('ds-background', className)}
    data-slot={effect} data-effect={effect} data-renderer={renderer} data-animated={String(animated)}
    style={{ height: backgroundHeight(height), background, ...style }}
    onPointerMove={event => {
      onPointerMove?.(event);
      movePointer(event);
    }}
    onPointerEnter={event => { onPointerEnter?.(event); movePointer(event); }}
    onPointerDown={event => { onPointerDown?.(event); if (event.button === 0 && movePointer(event)) input.current.down(clock.current); }}
    onPointerUp={event => { onPointerUp?.(event); input.current.release(); }}
    onPointerCancel={event => { onPointerCancel?.(event); input.current.leave(); }}
    onPointerLeave={event => { onPointerLeave?.(event); input.current.leave(); }}>
    <canvas ref={canvasRef} className='ds-background__canvas' style={canvasStyle} aria-hidden='true' />
    {children == null ? null : <div className='ds-background__content'>{children}</div>}
  </div>;
}
