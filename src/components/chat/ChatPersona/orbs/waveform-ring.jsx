'use client';

// Adapted from VoiceOrbs (MIT, Alexis Munoz). See ./LICENSE.

import { useEffect, useRef, useState } from 'react';
import { approach, clamp01, clampSize, clampSpeed, createStateMix, hexToRgb, readLevel, stateEnergy } from './voice-orb-model.js';
import { createLoop, observeActivity, prefersReducedMotion, subscribeReducedMotion } from './observe-activity.js';
import { useVoiceOrbColors } from './use-voice-orb-colors.js';

const TWO_PI = Math.PI * 2;
const SEGMENTS = 160;
const EMPTY = new Uint8Array(0);

const mixRgb = (a, b, t) => [ a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t ];
const rgba = (c, a) => `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${Math.round(clamp01(a) * 1000) / 1000})`;
const jag = (u, t) => Math.sign(Math.sin(TWO_PI * 19 * u + t * 1.9)) * (0.5 + 0.5 * Math.abs(Math.sin(TWO_PI * 7 * u - t * 2.4)));

// Time-domain samples centred on 128, mirrored so the ring closes without a seam.
const sampleWave = (u, data) => {
  const m = u < 0.5 ? u * 2 : (1 - u) * 2;
  const pos = m * (data.length - 1);
  const i0 = Math.floor(pos);
  const i1 = Math.min(i0 + 1, data.length - 1);
  const v = data[i0] + (data[i1] - data[i0]) * (pos - i0);
  return Math.max(-1, Math.min(1, ((v - 128) / 128) * 1.6));
};

/**
 * Waveform Ring: a 2D canvas ring that ripples with the state, or traces live time-domain samples
 * from `waveformRef` (an AnalyserNode's `getByteTimeDomainData` buffer) while listening or speaking.
 */
export function WaveformRing({ active = false, state = 'idle', size: requestedSize = 168, speed: requestedSpeed = 1, colorFrom: requestedFrom, colorTo: requestedTo, levelRef, waveformRef }) {
  const size = clampSize(requestedSize);
  const speed = clampSpeed(requestedSpeed);
  const moving = active && speed > 0;
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const { colorFrom, colorTo, errorFrom, errorTo } = useVoiceOrbColors(hostRef, 'waveform', requestedFrom, requestedTo);
  const [ drawn, setDrawn ] = useState(false);
  const live = useRef({ state, speed, from: colorFrom, to: colorTo });
  const redrawRef = useRef(null);

  useEffect(() => {
    live.current = { state, speed, from: colorFrom, to: colorTo };
    redrawRef.current?.();
  });

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.('2d');
    if (!host || !ctx) return undefined;
    setDrawn(true);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = size / 2;
    const R = size * 0.355;
    const errFrom = hexToRgb(errorFrom);
    const errTo = hexToRgb(errorTo);
    const errMid = mixRgb(errFrom, errTo, 0.5);
    const makeCore = (col) => {
      const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, R);
      g.addColorStop(0, rgba(col, 0.3));
      g.addColorStop(0.68, rgba(col, 0.1));
      g.addColorStop(1, rgba(col, 0));
      return g;
    };
    let paletteKey = '';
    let from = [ 255, 255, 255 ];
    let to = [ 255, 255, 255 ];
    let mid = from;
    let coreG = null;
    const errCoreG = makeCore(errMid);
    const stateMix = createStateMix(live.current.state);
    const xs = new Float32Array(SEGMENTS + 1);
    const ys = new Float32Array(SEGMENTS + 1);
    const alphas = new Float32Array(SEGMENTS + 1);
    let t = 0;
    let rot = 0;
    let levelS = 0;

    const render = (dt, still = false) => {
      const key = `${live.current.from}|${live.current.to}`;
      if (key !== paletteKey) {
        paletteKey = key;
        from = hexToRgb(live.current.from);
        to = hexToRgb(live.current.to);
        mid = mixRgb(from, to, 0.5);
        coreG = makeCore(mid);
      }
      const st = live.current.state;
      const spd = live.current.speed;
      const easeDt = still ? 60 : dt;
      const w = stateMix.update(st, easeDt);
      const target = still ? stateEnergy(st, 1.7) : (readLevel(levelRef) ?? stateEnergy(st, t));
      levelS = approach(levelS, target, 8, easeDt);
      const level = clamp01(levelS);
      rot += dt * 2.8 * spd;
      const data = waveformRef?.current ?? EMPTY;
      const hasWave = !still && data.length > 0;
      const overrideW = clamp01(w.error + w.disabled);
      const amp = w.idle * 0.03 + w.connecting * 0.045 + w.listening * (0.1 + level * 0.1) + w.thinking * 0.05 + w.speaking * (0.13 + level * 0.13) + w.error * 0.11 + w.disabled * 0.008;
      const breathe = 1 + w.idle * 0.02 * Math.sin(t * 1.1 * spd) + level * 0.02;
      const contract = 1 - w.thinking * (0.05 + 0.05 * Math.sin(t * 2.6 * spd));
      const baseR = R * breathe * contract;

      for (let i = 0; i <= SEGMENTS; i += 1) {
        const u = i / SEGMENTS;
        const theta = u * TWO_PI - Math.PI / 2;
        const proc = w.idle * Math.sin(TWO_PI * 2 * u + t * 0.9 * spd)
          + w.connecting * Math.sin(TWO_PI * 3 * u - t * 2.2 * spd)
          + w.listening * (0.62 * Math.sin(TWO_PI * 6 * u + t * 7.2 * spd) + 0.38 * Math.sin(TWO_PI * 11 * u - t * 9.6 * spd))
          + w.thinking * Math.sin(TWO_PI * 3 * u + t * 2.1 * spd)
          + w.speaking * (0.5 * Math.sin(TWO_PI * 4 * u + t * 5.3 * spd) + 0.32 * Math.sin(TWO_PI * 9 * u + t * 8.9 * spd) + 0.26 * Math.sin(TWO_PI * 15 * u - t * 6.4 * spd))
          + w.error * jag(u, t);
        const shape = hasWave ? proc * overrideW + sampleWave(u, data) * (1 - overrideW) : proc;
        const r = baseR + shape * amp * R;
        xs[i] = cx + Math.cos(theta) * r;
        ys[i] = cx + Math.sin(theta) * r;
        const dash = 0.5 + 0.5 * Math.tanh(Math.sin(theta * 7 - rot) * 5);
        alphas[i] = 1 - w.connecting * (1 - dash);
      }

      ctx.clearRect(0, 0, size, size);
      const alphaMul = 1 - 0.45 * w.disabled;
      const coreA = (0.5 + level * 0.5) * alphaMul;
      if (coreG && w.error < 0.996) {
        ctx.globalAlpha = coreA * (1 - w.error);
        ctx.fillStyle = coreG;
        ctx.fillRect(0, 0, size, size);
      }
      if (w.error > 0.004) {
        ctx.globalAlpha = coreA * w.error;
        ctx.fillStyle = errCoreG;
        ctx.fillRect(0, 0, size, size);
      }
      ctx.globalAlpha = 1;

      if (w.thinking > 0.004) {
        const echoCol = mixRgb(mid, errMid, w.error);
        for (let k = 0; k < 2; k += 1) {
          const phase = still ? 0.3 + k * 0.45 : (((t * 0.45 * spd + k * 0.5) % 1) + 1) % 1;
          const ea = w.thinking * phase * (1 - phase) * 1.6 * alphaMul;
          if (ea <= 0.004) continue;
          ctx.strokeStyle = rgba(echoCol, ea);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cx, R * (1.02 - phase * 0.72), 0, TWO_PI);
          ctx.stroke();
        }
      }

      const colAt = (u) => {
        const g = u < 0.5 ? u * 2 : (1 - u) * 2;
        const base = mixRgb(from, to, g);
        return w.error > 0.004 ? mixRgb(base, mixRgb(errFrom, errTo, g), w.error) : base;
      };
      ctx.lineCap = 'round';
      const passes = [
        [ 5.5 + level * 6, 0.16, 'lighter' ],
        [ Math.max(0.7, 1.7 + level * 1.5 - w.disabled * 0.8), 0.92, 'source-over' ]
      ];
      for (const [ lineWidth, passAlpha, composite ] of passes) {
        ctx.globalCompositeOperation = composite;
        ctx.lineWidth = lineWidth;
        for (let i = 0; i < SEGMENTS; i += 1) {
          const a = passAlpha * alphas[i] * alphaMul;
          if (a <= 0.004) continue;
          ctx.strokeStyle = rgba(colAt((i + 0.5) / SEGMENTS), a);
          ctx.beginPath();
          ctx.moveTo(xs[i], ys[i]);
          ctx.lineTo(xs[i + 1], ys[i + 1]);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    let inView = true;
    const loop = createLoop((dt) => {
      t += dt;
      render(dt);
    }, () => {
      if (t === 0) t = 4.2;
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
    return () => {
      loop.stop();
      unsubscribeMotion();
      unobserve();
      redrawRef.current = null;
    };
  }, [ size, waveformRef, levelRef, moving, errorFrom, errorTo ]);

  return (
    <div ref={hostRef} data-slot='voice-orb' data-orb='waveform' data-state={state} data-renderer={drawn ? 'canvas' : 'css'} data-moving={moving || undefined} className='ds-part-voice-orb' style={{ width: size }}>
      {drawn ? null : <span aria-hidden='true' className='ds-part-voice-waveform-fallback' style={{ '--ds-voice-a': state === 'error' ? errorFrom : colorFrom, '--ds-voice-b': state === 'error' ? errorTo : colorTo }} />}
      <canvas ref={canvasRef} aria-hidden='true' className='ds-part-voice-orb-canvas' style={{ width: size }} />
    </div>
  );
}
