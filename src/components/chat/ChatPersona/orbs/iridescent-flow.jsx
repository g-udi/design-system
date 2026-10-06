'use client';

// Adapted from VoiceOrbs (MIT, Alexis Munoz). See ./LICENSE.

import { useEffect, useRef, useState } from 'react';
import { approach, clampLevel, clampSize, clampSpeed, createStateMix, hexToRgb, orbStates, readLevel, stateEnergy } from './voice-orb-model.js';
import { createLoop, observeActivity, prefersReducedMotion, subscribeReducedMotion } from './observe-activity.js';
import { useVoiceOrbColors } from './use-voice-orb-colors.js';
import { useWebGLSupport } from './use-webgl-support.js';
import { createOrbProgram } from './webgl-program.js';

const FLOW_RATE = { idle: 0.22, connecting: 0.55, listening: 0.72, thinking: 0.46, speaking: 1.35, error: 0.4, disabled: 0.02 };

const toUnit = (hex) => hexToRgb(hex).map((channel) => channel / 255);
const mix3 = (a, b, t) => [ a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t ];

const FRAG = `
precision highp float;
uniform float uSize;
uniform float uTime;
uniform float uFlow;
uniform float uLevel;
uniform vec3 uColorFrom;
uniform vec3 uColorTo;
uniform float uConnect;
uniform float uListen;
uniform float uThink;
uniform float uSpeak;
uniform float uError;
uniform float uDisabled;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 3; i++) {
    v += amp * noise(p);
    p = p * 2.03 + vec2(11.7, 5.3);
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - uSize) / uSize;
  float r = length(p);
  float mask = 1.0 - smoothstep(0.86, 0.92, r);
  if (mask < 0.003) { gl_FragColor = vec4(0.0); return; }

  vec2 drift = vec2(uFlow * 0.32, -uFlow * 0.21);
  vec2 q = vec2(fbm(p * 2.1 + drift), fbm(p * 2.1 + drift.yx + vec2(4.7, 1.9)));
  float n = fbm(p * 2.6 + 2.2 * q + vec2(uFlow * 0.42, uFlow * 0.27));

  float inter = sin(r * 24.0 - uTime * 3.1) * sin(r * 15.0 + uTime * 2.3);
  n += uThink * inter * (0.14 + 0.12 * uLevel);
  float ripple = sin(r * 30.0 - uTime * 6.5);
  n += uListen * ripple * (0.05 + 0.2 * uLevel);
  n = clamp(n, 0.0, 1.0);

  float fres = pow(smoothstep(0.3, 0.9, r), 2.0);
  float th = n * 1.7 + fres * 1.15 + uFlow * 0.1;
  vec3 film = 0.5 + 0.5 * cos(6.28318 * (th + vec3(0.0, 0.33, 0.67)));

  vec3 base = mix(uColorFrom, uColorTo, smoothstep(0.15, 0.85, n));
  float irid = clamp(0.4 + 0.35 * uSpeak + 0.18 * uListen + 0.3 * uLevel, 0.0, 1.0);
  irid *= 1.0 - 0.75 * uError;
  irid *= 1.0 - 0.7 * uDisabled;

  vec3 col = base * (0.62 + 0.85 * n);
  col += mix(uColorFrom, uColorTo, 0.5) * (1.0 - smoothstep(0.05, 0.75, r)) * 0.3;
  col += film * irid * (0.35 + 0.65 * fres);

  float ang = atan(p.y, p.x);
  float sweep = pow(0.5 + 0.5 * cos(ang - uTime * 2.4), 10.0);
  col += mix(uColorTo, vec3(1.0), 0.55) * sweep * smoothstep(0.35, 0.85, r) * uConnect * 1.1;

  col *= 1.0 + uListen * 0.22 * max(ripple, 0.0) * (0.4 + 0.6 * uLevel);
  col *= 1.0 + uThink * (0.12 * sin(uTime * 4.2) + 0.1 * inter);

  vec3 rim = mix(uColorTo, vec3(1.0), 0.45);
  col += rim * pow(smoothstep(0.55, 0.9, r), 3.0) * (0.4 + 0.55 * uLevel);
  col += uColorTo * fres * uError * 0.35;
  col *= 0.9 + 0.45 * uLevel + 0.25 * uSpeak * uLevel;

  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(lum), uDisabled * 0.85);
  col *= 1.0 - 0.35 * uDisabled;
  col = col / (1.0 + 0.22 * col);
  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col * mask, mask);
}
`;

const UNIFORMS = [ 'time', 'flow', 'level', 'colorFrom', 'colorTo', 'connect', 'listen', 'think', 'speak', 'error', 'disabled' ];
const uniformName = (key) => `u${key.charAt(0).toUpperCase()}${key.slice(1)}`;

/**
 * Iridescent Flow: a thin-film sphere drawn by a small WebGL shader (no library). Ripples when
 * listening, interferes when thinking, flares when speaking. Falls back to a still CSS gradient when
 * WebGL is missing or the context is lost.
 */
export function IridescentFlow({ active = false, state = 'idle', size: requestedSize = 168, speed: requestedSpeed = 1, colorFrom: requestedFrom, colorTo: requestedTo, levelRef }) {
  const size = clampSize(requestedSize);
  const speed = clampSpeed(requestedSpeed);
  const moving = active && speed > 0;
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const { colorFrom, colorTo, errorFrom, errorTo } = useVoiceOrbColors(hostRef, 'iridescent', requestedFrom, requestedTo);
  const live = useRef({ state, speed, from: colorFrom, to: colorTo });
  const redrawRef = useRef(null);
  const [ lost, setLost ] = useState(false);
  const support = useWebGLSupport();
  const showCanvas = support === true && !lost;

  useEffect(() => {
    live.current = { state, speed, from: colorFrom, to: colorTo };
    redrawRef.current?.();
  });

  useEffect(() => {
    if (!showCanvas) return undefined;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!gl) {
      setLost(true);
      return undefined;
    }
    const orb = createOrbProgram(gl, canvas, FRAG, size);
    if (!orb) {
      setLost(true);
      return undefined;
    }
    const loc = Object.fromEntries(UNIFORMS.map((key) => [ key, orb.uniform(uniformName(key)) ]));

    const errorFromV = toUnit(errorFrom);
    const errorToV = toUnit(errorTo);
    let paletteKey = '';
    let fromV = [ 1, 1, 1 ];
    let toV = [ 1, 1, 1 ];
    const stateMix = createStateMix(live.current.state);
    let clock = 0;
    let flow = 0;
    let level = 0;
    let flowRate = FLOW_RATE[live.current.state] ?? FLOW_RATE.idle;

    const render = (dt, still = false) => {
      const key = `${live.current.from}|${live.current.to}`;
      if (key !== paletteKey) {
        paletteKey = key;
        fromV = toUnit(live.current.from);
        toV = toUnit(live.current.to);
      }
      const current = live.current.state;
      const easeDt = still ? 60 : dt;
      const w = stateMix.update(current, easeDt);
      const liveLevel = readLevel(levelRef);
      level = approach(level, liveLevel ?? stateEnergy(current, clock), 8, easeDt);
      let rateTarget = 0;
      for (const name of orbStates) rateTarget += w[name] * FLOW_RATE[name];
      flowRate = approach(flowRate, rateTarget, 4, easeDt);
      flow += dt * live.current.speed * flowRate;
      const from = mix3(fromV, errorFromV, w.error);
      const to = mix3(toV, errorToV, w.error);
      gl.uniform1f(loc.time, clock);
      gl.uniform1f(loc.flow, flow);
      gl.uniform1f(loc.level, clampLevel(level));
      gl.uniform3f(loc.colorFrom, from[0], from[1], from[2]);
      gl.uniform3f(loc.colorTo, to[0], to[1], to[2]);
      gl.uniform1f(loc.connect, w.connecting);
      gl.uniform1f(loc.listen, w.listening);
      gl.uniform1f(loc.think, w.thinking);
      gl.uniform1f(loc.speak, w.speaking);
      gl.uniform1f(loc.error, w.error);
      gl.uniform1f(loc.disabled, w.disabled);
      orb.draw();
    };
    let inView = true;
    const loop = createLoop((dt) => {
      clock += dt * live.current.speed;
      render(dt);
    }, () => {
      if (clock === 0) clock = 4.7;
      render(0, true);
    });
    const apply = () => loop.sync(!prefersReducedMotion() && inView && moving);
    apply();
    const unsubscribeMotion = subscribeReducedMotion(apply);
    const unobserve = observeActivity(host, (visible) => {
      inView = visible;
      apply();
    });
    redrawRef.current = () => {
      if (!loop.isRunning()) render(0, true);
    };
    const onLost = (event) => {
      event.preventDefault();
      loop.stop();
      setLost(true);
    };
    canvas.addEventListener('webglcontextlost', onLost);
    return () => {
      loop.stop();
      unsubscribeMotion();
      unobserve();
      canvas.removeEventListener('webglcontextlost', onLost);
      redrawRef.current = null;
      orb.drop();
    };
  }, [ size, showCanvas, levelRef, moving, errorFrom, errorTo ]);

  const isError = state === 'error';
  return (
    <div ref={hostRef} data-slot='voice-orb' data-orb='iridescent' data-state={state} data-renderer={showCanvas ? 'webgl' : 'css'} data-moving={moving || undefined} className='ds-part-voice-orb' style={{ width: size }}>
      {showCanvas ? (
        <canvas ref={canvasRef} aria-hidden='true' className='ds-part-voice-orb-canvas' style={{ width: size }} />
      ) : (
        <span aria-hidden='true' className='ds-part-voice-orb-fallback' style={{ '--ds-voice-glow': `${Math.round(size * 0.08)}px` }}>
          <span className='ds-part-voice-orb-film' style={{ '--ds-voice-a': colorFrom, '--ds-voice-b': colorTo, opacity: isError ? 0 : 1 }} />
          <span className='ds-part-voice-orb-film' style={{ '--ds-voice-a': errorFrom, '--ds-voice-b': errorTo, opacity: isError ? 1 : 0 }} />
        </span>
      )}
    </div>
  );
}
