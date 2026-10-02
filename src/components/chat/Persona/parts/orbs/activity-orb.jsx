'use client';

// The dotted-sphere treatment of Mav9's ChatActivityOrb, whose geometry came from thinking-orbs
// (MIT, Jakub Antalik). Gaudi does not depend on thinking-orbs: this is a compact rewrite of the
// idea (a Fibonacci lattice of dots on a turning sphere, shaded by depth) that reacts to voice states.

import { useEffect, useMemo, useRef } from 'react';
import { approach, clamp01, clampSize, clampSpeed, createStateMix, hexToRgb, readLevel, stateEnergy } from './voice-orb-model.js';
import { createLoop, observeActivity, prefersReducedMotion, subscribeReducedMotion } from './observe-activity.js';
import { useVoiceOrbColors } from './use-voice-orb-colors.js';

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const TILT = -0.38;
const SPIN = { idle: 0.35, connecting: 0.9, listening: 0.7, thinking: 1.5, speaking: 0.8, error: 0.2, disabled: 0 };

const dotCount = (size) => (size < 48 ? 48 : size < 120 ? 96 : 150);

// Points evenly spread over a unit sphere.
const lattice = (count) => Array.from({ length: count }, (_, i) => {
  const y = 1 - (2 * (i + 0.5)) / count;
  const radius = Math.sqrt(1 - y * y);
  const theta = i * GOLDEN;
  return [ radius * Math.cos(theta), y, radius * Math.sin(theta) ];
});

const mix = (a, b, t) => a.map((channel, i) => Math.round(channel + (b[i] - channel) * t));

/**
 * Activity: a dotted sphere in SVG. It turns slowly at rest, ripples with the level when listening,
 * sweeps a bright band while thinking, swells when speaking, blinks its dots while connecting and
 * stops, dimmed, when asleep.
 */
export function ActivityOrb({ active = false, state = 'idle', size: requestedSize = 168, speed: requestedSpeed = 1, colorFrom: requestedFrom, colorTo: requestedTo, levelRef }) {
  const size = clampSize(requestedSize);
  const speed = clampSpeed(requestedSpeed);
  const moving = active && speed > 0;
  const hostRef = useRef(null);
  const groupRef = useRef(null);
  const { colorFrom, colorTo, errorFrom, errorTo } = useVoiceOrbColors(hostRef, 'activity', requestedFrom, requestedTo);
  const points = useMemo(() => lattice(dotCount(size)), [ size ]);
  const live = useRef({ state, speed, colorFrom, colorTo, errorFrom, errorTo });
  const redrawRef = useRef(null);

  useEffect(() => {
    live.current = { state, speed, colorFrom, colorTo, errorFrom, errorTo };
    redrawRef.current?.();
  });

  useEffect(() => {
    const host = hostRef.current;
    const group = groupRef.current;
    if (!host || !group) return undefined;
    const dots = Array.from(group.children);
    const centre = size / 2;
    const radius = size * 0.36;
    const baseDot = Math.max(0.6, size / 70);
    const stateMix = createStateMix(live.current.state);
    let spin = 0;
    let clock = 0;
    let level = 0;

    const render = (dt, still = false) => {
      const current = live.current;
      const easeDt = still ? 60 : dt;
      const w = stateMix.update(current.state, easeDt);
      level = approach(level, still ? stateEnergy(current.state, 1.2) : (readLevel(levelRef) ?? stateEnergy(current.state, clock)), 8, easeDt);
      let spinRate = 0;
      for (const key of Object.keys(SPIN)) spinRate += (w[key] ?? 0) * SPIN[key];
      spin += dt * spinRate * current.speed;
      const from = hexToRgb(current.colorFrom);
      const to = hexToRgb(current.colorTo);
      const errFrom = hexToRgb(current.errorFrom);
      const errTo = hexToRgb(current.errorTo);
      const band = Math.sin(clock * 1.6);
      const swell = 1 + w.speaking * level * 0.14 + w.listening * level * 0.05 - w.disabled * 0.06;
      const cosS = Math.cos(spin);
      const sinS = Math.sin(spin);
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);
      points.forEach(([ px, py, pz ], i) => {
        const dot = dots[i];
        if (!dot) return;
        // Listening ripples along latitude; error jitters.
        const ripple = 1 + w.listening * (0.03 + level * 0.12) * Math.sin(py * 9 - clock * 7) + w.error * 0.03 * Math.sin(i * 12.9 + clock * 30);
        const x0 = px * cosS + pz * sinS;
        const z0 = -px * sinS + pz * cosS;
        const y1 = py * cosT - z0 * sinT;
        const z1 = py * sinT + z0 * cosT;
        const scale = radius * swell * ripple;
        const depth = (z1 + 1) / 2;
        const highlight = w.thinking * Math.exp(-((py - band) ** 2) / 0.03);
        const blink = w.connecting * (0.5 + 0.5 * Math.sin(i * 0.7 - clock * 5));
        const opacity = clamp01((0.14 + 0.86 * depth) * (1 - 0.55 * w.disabled) * (1 - blink * 0.8) + highlight * 0.5);
        const r = baseDot * (0.45 + 0.75 * depth) * (1 + highlight * 0.8 + w.speaking * level * 0.5);
        const tone = mix(mix(from, to, (py + 1) / 2), mix(errFrom, errTo, (py + 1) / 2), w.error);
        dot.setAttribute('cx', (centre + x0 * scale).toFixed(2));
        dot.setAttribute('cy', (centre - y1 * scale).toFixed(2));
        dot.setAttribute('r', r.toFixed(2));
        dot.setAttribute('fill-opacity', opacity.toFixed(3));
        dot.setAttribute('fill', `rgb(${tone[0]}, ${tone[1]}, ${tone[2]})`);
      });
    };

    let inView = true;
    const loop = createLoop((dt) => {
      clock += dt * live.current.speed;
      render(dt);
    }, () => {
      if (clock === 0) {
        clock = 0.6;
        spin = 0.6;
      }
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
  }, [ points, size, levelRef, moving ]);

  return (
    <div ref={hostRef} data-slot='voice-orb' data-orb='activity' data-state={state} data-renderer='svg' data-moving={moving || undefined} className='ds-part-voice-orb' style={{ width: size, height: size }}>
      <svg aria-hidden='true' focusable='false' width={size} height={size} viewBox={`0 0 ${size} ${size}`} className='ds-part-voice-activity'>
        <g ref={groupRef}>
          {points.map(([ x, y ], index) => (
            <circle key={index} cx={size / 2 + x * size * 0.36} cy={size / 2 - y * size * 0.36} r={Math.max(0.6, size / 70) * 0.8} fill='currentColor' fillOpacity={0.5} />
          ))}
        </g>
      </svg>
    </div>
  );
}
