'use client';

// Adapted from the orb-ui cloud and radial themes (MIT, Alexander Chen). See ./LICENSE.

import { useEffect, useRef, useState } from 'react';
import { approach, clamp01, clampSize, clampSpeed, createStateMix, hexToRgb, mixHex, orbStates, readLevel, stateEnergy } from './voice-orb-model.js';
import { createLoop, observeActivity, prefersReducedMotion, subscribeReducedMotion } from './observe-activity.js';
import { useVoiceOrbColors } from './use-voice-orb-colors.js';
import { useWebGLSupport } from './use-webgl-support.js';
import { createOrbProgram } from './webgl-program.js';

const tint = (hex, t) => mixHex(hex, '#ffffff', t);
const shade = (hex, t) => mixHex(hex, '#000000', t);
const toUnit = (hex) => hexToRgb(hex).map((channel) => channel / 255);

const NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.52;
  mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);
  for (int octave = 0; octave < 5; octave++) {
    value += amplitude * noise(p);
    p = rotation * p * 1.92 + vec2(9.7, 4.3);
    amplitude *= 0.5;
  }
  return value;
}
`;

// Cloud: a slow sky of folded fbm cloud and a milky horizon band, more turbulent with activity.
const CLOUD = `
precision highp float;
uniform float uSize;
uniform float uTime;
uniform float uActivity;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
${NOISE}
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  vec2 centered = uv - 0.5;
  float edge = 1.0 - smoothstep(0.488, 0.5, length(centered));
  if (edge <= 0.0) { gl_FragColor = vec4(0.0); return; }
  vec2 p = centered * 2.0;
  float t = uTime;
  vec2 warp = vec2(fbm(p * 1.02 + vec2(t * 0.34, -t * 0.24)), fbm(p * 1.08 + vec2(-t * 0.27, t * 0.32) + vec2(6.7, 2.9)));
  vec2 curl = vec2(sin(p.y * 2.4 + t * 0.68 + warp.y * 3.2), cos(p.x * 2.1 - t * 0.61 + warp.x * 3.0));
  vec2 warped = p + (warp - 0.5) * (1.18 + uActivity * 0.38) + curl * (0.035 + uActivity * 0.07);
  float broad = fbm(warped * 0.92 + vec2(t * 0.14, -t * 0.18));
  float folded = fbm(warped * 1.66 + vec2(-t * 0.23, t * 0.19) + 5.2);
  float field = mix(broad, folded, 0.3 + uActivity * 0.14);
  float horizon = 0.46 + 0.08 * sin((uv.x + warp.x * 0.2) * 5.4 + t * 0.42) + 0.16 * (broad - 0.5);
  float upper = smoothstep(horizon - 0.12, horizon + 0.08, uv.y);
  float band = exp(-pow((uv.y - horizon) * (5.2 + uActivity * 0.8), 2.0));
  float cloud = smoothstep(0.24, 0.79, field);
  vec3 color = mix(uC2, uC1, upper);
  color = mix(color, uC0, upper * (0.14 + smoothstep(0.42, 0.78, folded) * 0.5));
  color = mix(color, uC3, clamp(band * (0.42 + cloud * 0.62), 0.0, 0.88));
  color = mix(color, uC3, (1.0 - upper) * smoothstep(0.58, 0.9, broad) * 0.18);
  color += (noise(gl_FragCoord.xy * 0.64) - 0.5) / 255.0;
  gl_FragColor = vec4(color * edge, edge);
}
`;

// Radial: a four-lobed pinwheel with bright seams and a rippling outer membrane.
const RADIAL = `
precision highp float;
uniform float uSize;
uniform float uTime;
uniform float uRotation;
uniform float uListen;
uniform float uSpeak;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;
uniform vec3 uC5;
void main() {
  vec2 p = (gl_FragCoord.xy / uSize - 0.5) * 2.0;
  float radius = length(p);
  float edge = 1.0 - smoothstep(0.993, 1.0, radius);
  if (edge <= 0.0) { gl_FragColor = vec4(0.0); return; }
  float angle = atan(p.y, p.x);
  float warpStrength = 0.026 + uSpeak * 0.105;
  float angularWarp = sin(angle * 3.0 - uTime * 0.54 + radius * 2.1) + 0.48 * sin(angle * 5.0 + uTime * 0.31 - radius * 3.7) + 0.22 * sin(angle * 8.0 - uTime * 0.19 + radius * 5.2);
  float phase = angle - 1.78 - uRotation + angularWarp * warpStrength * (0.2 + radius * 0.8);
  float lobeField = cos(phase * 2.0);
  float darkMix = smoothstep(-0.04, 0.38, lobeField);
  float radialLight = 0.5 + 0.5 * sin(radius * 3.0 - uTime * 0.16);
  vec3 darkColor = mix(uC1, uC0, 0.42 + 0.38 * radius);
  darkColor = mix(darkColor, uC2, pow(max(lobeField, 0.0), 11.0) * (0.18 + radialLight * 0.16));
  vec3 lightColor = mix(uC3, uC2, 0.5 + 0.2 * sin(radius * 3.4 + phase * 2.0));
  lightColor = mix(lightColor, mix(uC1, uC2, 0.4), pow(max(-lobeField, 0.0), 5.0) * 0.28);
  vec3 color = mix(lightColor, darkColor, darkMix);
  float secondaryRay = 0.5 + 0.5 * sin(phase * 6.0 + radius * 1.8 - uTime * 0.42);
  color = mix(color, uC2, secondaryRay * (0.055 + uSpeak * 0.045) * (0.25 + radius * 0.75));
  float rimWave = 0.063 * sin(angle * 3.0 + uTime * 1.34) + 0.036 * sin(angle * 5.0 - uTime * 0.91 + 1.4) + 0.021 * sin(angle * 7.0 + uTime * 0.63 - 0.8) + 0.012 * sin(angle * 11.0 - uTime * 1.72 + sin(angle * 2.0 + uTime * 0.58));
  rimWave *= 1.0 + uListen * 0.38;
  float rimInner = 0.82 + rimWave - uListen * 0.2;
  float rim = smoothstep(rimInner - 0.02, rimInner + 0.015, radius);
  vec3 membrane = mix(uC4, uC3, smoothstep(0.78, 1.0, radius));
  color = mix(color, membrane, clamp(rim * (0.3 + uListen * 0.3), 0.0, 0.72));
  float seamDirection = max(0.0, -sin(phase * 2.0));
  float seam = pow(seamDirection, mix(30.0, 3.2, smoothstep(0.05, 1.0, radius))) * (0.78 + radius * 0.25);
  color = mix(color, uC5, clamp(seam, 0.0, 0.96));
  gl_FragColor = vec4(color * edge, edge);
}
`;

// Shader colours derived from the palette's two tokens, darkest first.
const palettes = {
  cloud: (from, to) => [ from, tint(mixHex(from, to, 0.35), 0.15), tint(to, 0.55), tint(to, 0.85) ],
  radial: (from, to) => [ shade(from, 0.62), from, to, tint(to, 0.72), tint(to, 0.4), tint(to, 0.95) ]
};

// Cloud and radial flow speeds per state; live level adds to listening and speaking.
const FLOW = {
  cloud: { idle: 0.24, connecting: 0.36, listening: 0.72, thinking: 0.42, speaking: 1.65, error: 0.18, disabled: 0 },
  radial: { idle: 0.36, connecting: 0.42, listening: 0.54, thinking: 0.46, speaking: 1.05, error: 0.24, disabled: 0 }
};
const FLOW_RANGE = { cloud: { listening: 0.78, speaking: 1.55 }, radial: { listening: 0.26, speaking: 1.15 } };
const STILL_PHASE = 0.9;

const fallbackFill = (field, [ c0, c1, c2, c3 ]) => (field === 'cloud'
  ? `linear-gradient(180deg, ${c0} 2%, ${c1} 32%, ${c3} 52%, ${c2} 84%)`
  : `conic-gradient(from 12deg, ${c0} 0deg, ${c1} 72deg, ${c3} 92deg, ${c2} 172deg, ${c0} 196deg, ${c1} 254deg, ${c3} 278deg, ${c2} 360deg)`);

/**
 * Field orbs, drawn by a small WebGL shader: `cloud` is a drifting sky with a milky horizon that
 * shrinks while listening and swells while speaking; `radial` is a pinwheel whose membrane ripples
 * while listening and whose seams swing while speaking. Both fall back to a still CSS gradient.
 */
export function FieldOrb({ field = 'cloud', active = false, state = 'idle', size: requestedSize = 168, speed: requestedSpeed = 1, colorFrom: requestedFrom, colorTo: requestedTo, levelRef }) {
  const kind = field === 'radial' ? 'radial' : 'cloud';
  const size = clampSize(requestedSize);
  const speed = clampSpeed(requestedSpeed);
  const moving = active && speed > 0;
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const { colorFrom, colorTo, errorFrom, errorTo } = useVoiceOrbColors(hostRef, kind, requestedFrom, requestedTo);
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
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    const orb = gl && createOrbProgram(gl, canvas, kind === 'cloud' ? CLOUD : RADIAL, size);
    if (!orb) {
      setLost(true);
      return undefined;
    }
    const at = Object.fromEntries([ 'uTime', 'uActivity', 'uRotation', 'uListen', 'uSpeak', 'uC0', 'uC1', 'uC2', 'uC3', 'uC4', 'uC5' ].map((name) => [ name, orb.uniform(name) ]));
    const errorColours = palettes[kind](errorFrom, errorTo).map(toUnit);
    const stateMix = createStateMix(live.current.state);
    let paletteKey = '';
    let colours = [];
    let clock = 0;
    let flow = 0;
    let level = 0;
    let flowRate = FLOW[kind][live.current.state] ?? FLOW[kind].idle;
    let scale = 1;
    let rotation = 0;
    let velocity = 0;

    const render = (dt, still = false) => {
      const key = `${live.current.from}|${live.current.to}`;
      if (key !== paletteKey) {
        paletteKey = key;
        colours = palettes[kind](live.current.from, live.current.to).map(toUnit);
      }
      const current = live.current.state;
      const easeDt = still ? 60 : dt;
      const w = stateMix.update(current, easeDt);
      level = still ? stateEnergy(current, STILL_PHASE) : approach(level, readLevel(levelRef) ?? stateEnergy(current, clock), 6, dt);
      const energy = clamp01(level);
      let rateTarget = 0;
      for (const name of orbStates) rateTarget += w[name] * ((FLOW[kind][name] ?? 0) + (FLOW_RANGE[kind][name] ?? 0) * energy);
      flowRate = approach(flowRate, rateTarget, 4, easeDt);
      flow = still ? STILL_PHASE * 4 : flow + dt * live.current.speed * flowRate;
      const listen = w.listening * energy;
      const speak = w.speaking * energy;
      if (kind === 'cloud') {
        // Listening draws the cloud in; speaking swells it; connecting and thinking breathe.
        const breath = (w.connecting + w.thinking) * 0.03 * Math.sin(clock * 2.4);
        const goal = 0.82 * (1 - listen * 0.2 + speak * 0.2 + breath - w.disabled * 0.04);
        scale = still ? goal : approach(scale, goal, 4, dt);
        gl.uniform1f(at.uActivity, 0.1 + w.thinking * 0.12 + w.listening * (0.18 + energy * 0.32) + w.speaking * (0.56 + energy * 0.34));
      } else {
        // A damped spring follows a calm sway, or a livelier swing while speaking.
        const sway = Math.sin(clock * 0.7) * 0.16 + Math.sin(clock * 0.33 + 1.1) * 0.032;
        const swing = Math.sin(clock * 1.6) * (0.13 + speak * 0.17) + Math.sin(clock * 3.1 + 0.9) * (0.035 + speak * 0.035);
        const goal = sway + (swing - sway) * w.speaking;
        if (still) {
          rotation = goal;
          velocity = 0;
        } else {
          const stiffness = (4.2 + w.speaking * 3) ** 2;
          velocity += ((goal - rotation) * stiffness - velocity * 2 * (4.2 + w.speaking * 3)) * dt;
          rotation += velocity * dt;
        }
        scale = 0.9 - w.disabled * 0.04;
        gl.uniform1f(at.uRotation, rotation);
        gl.uniform1f(at.uListen, listen);
        gl.uniform1f(at.uSpeak, speak);
      }
      canvas.style.transform = `scale(${scale.toFixed(4)})`;
      gl.uniform1f(at.uTime, flow);
      colours.forEach((colour, i) => {
        const mixed = colour.map((channel, c) => channel + (errorColours[i][c] - channel) * w.error);
        gl.uniform3f(at[`uC${i}`], mixed[0], mixed[1], mixed[2]);
      });
      orb.draw();
    };
    let inView = true;
    const loop = createLoop((dt) => {
      clock += dt * live.current.speed;
      render(dt);
    }, () => render(0, true));
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
  }, [ kind, size, showCanvas, levelRef, moving, errorFrom, errorTo ]);

  const isError = state === 'error';
  return (
    <div ref={hostRef} data-slot='voice-orb' data-orb={kind} data-state={state} data-renderer={showCanvas ? 'webgl' : 'css'} data-moving={moving || undefined} className='ds-part-voice-orb' style={{ width: size }}>
      {showCanvas ? (
        <canvas ref={canvasRef} aria-hidden='true' className='ds-part-voice-orb-canvas' style={{ width: size }} />
      ) : (
        <span aria-hidden='true' className='ds-part-voice-orb-fallback'>
          <span className='ds-part-voice-orb-film' style={{ backgroundImage: fallbackFill(kind, palettes[kind](colorFrom, colorTo)), opacity: isError ? 0 : 1 }} />
          <span className='ds-part-voice-orb-film' style={{ backgroundImage: fallbackFill(kind, palettes[kind](errorFrom, errorTo)), opacity: isError ? 1 : 0 }} />
        </span>
      )}
    </div>
  );
}
