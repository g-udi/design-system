'use client';

// Adapted from the orb-ui bars theme (MIT, Alexander Chen). See ./LICENSE.

import { useEffect, useRef } from 'react';
import { approach, clamp01, clampSize, clampSpeed, hexToRgb, readLevel, stateEnergy } from './voice-orb-model.js';
import { createLoop, observeActivity, prefersReducedMotion, subscribeReducedMotion } from './observe-activity.js';
import { useVoiceOrbColors } from './use-voice-orb-colors.js';

const BARS = 5;
const PHASE_STEP = (Math.PI * 2) / BARS;
const TINT = { idle: 0, connecting: 0.3, listening: 0.6, thinking: 0.4, speaking: 1, disabled: 0 };
const STILL_PHASE = 0.9;

// Height of bar i as a share of the tallest bar: rests as dots, waves with the level while listening
// or speaking (faster when speaking), and sweeps a hump from start to end while connecting or thinking.
const barHeight = (state, i, level, t, low) => {
  if (state === 'listening' || state === 'speaking') {
    const tempo = state === 'speaking' ? 1 : 0.4;
    const wave = 0.5 + 0.15 * Math.sin(t * 1.4 * tempo * Math.PI * 2 + i * PHASE_STEP);
    return low + (1 - low) * clamp01(level * wave * 1.4);
  }
  if (state === 'connecting' || state === 'thinking') {
    const cycle = (t * 0.6 + (i / BARS) * 0.5) % 1;
    const hump = cycle < 0.5 ? Math.sin((cycle / 0.5) * Math.PI) : 0;
    return low + (0.4 - low) * hump;
  }
  return low;
};

/**
 * Bars: five rounded bars that rest as dots, follow the level while listening and speaking, and run
 * a loading wave while connecting or thinking. One frame loop writes each bar's height; the still
 * frame keeps each state's shape and tint.
 */
export function BarsOrb({ active = false, state = 'idle', size: requestedSize = 168, speed: requestedSpeed = 1, colorFrom: requestedFrom, colorTo: requestedTo, levelRef }) {
  const size = clampSize(requestedSize);
  const speed = clampSpeed(requestedSpeed);
  const moving = active && speed > 0;
  const hostRef = useRef(null);
  const rowRef = useRef(null);
  const colors = useVoiceOrbColors(hostRef, 'bars', requestedFrom, requestedTo);
  const live = useRef({ state, speed, colors });
  const redrawRef = useRef(null);

  useEffect(() => {
    live.current = { state, speed, colors };
    redrawRef.current?.();
  });

  useEffect(() => {
    const host = hostRef.current;
    const row = rowRef.current;
    if (!host || !row) return undefined;
    const bars = Array.from(row.children);
    const low = 0.06 / 0.55;
    const target = (current) => {
      const { colorFrom, colorTo, errorFrom } = live.current.colors;
      if (current === 'error') return hexToRgb(errorFrom);
      const from = hexToRgb(colorFrom);
      const to = hexToRgb(colorTo);
      const t = TINT[current] ?? 0;
      return from.map((channel, i) => channel + (to[i] - channel) * t);
    };
    let clock = 0;
    let level = 0;
    let fill = target(live.current.state);
    const heights = new Array(BARS).fill(low);
    const render = (dt, still = false) => {
      const current = live.current.state;
      const phase = still ? (current === 'thinking' || current === 'connecting' ? 0.5 : STILL_PHASE) : clock;
      level = still ? stateEnergy(current, STILL_PHASE) : approach(level, readLevel(levelRef) ?? stateEnergy(current, clock), 23, dt);
      const colour = target(current);
      fill = still ? colour : fill.map((channel, i) => approach(channel, colour[i], 7.7, dt));
      for (let i = 0; i < BARS; i++) {
        const goal = barHeight(current, i, level, phase, low);
        heights[i] = still ? goal : approach(heights[i], goal, goal > heights[i] ? 38 : 23, dt);
        bars[i]?.style.setProperty('--ds-voice-bar', heights[i].toFixed(4));
      }
      host.style.setProperty('--ds-voice-fill', `rgb(${fill.map(Math.round).join(' ')})`);
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
    return () => {
      loop.stop();
      unsubscribeMotion();
      unobserve();
      redrawRef.current = null;
    };
  }, [ levelRef, moving ]);

  return (
    <div ref={hostRef} data-slot='voice-orb' data-orb='bars' data-state={state} data-renderer='css' data-moving={moving || undefined} className='ds-part-voice-orb ds-part-voice-bars' style={{ width: size, '--ds-voice-fill': state === 'error' ? colors.errorFrom : colors.colorFrom }}>
      <span ref={rowRef} aria-hidden='true' className='ds-part-voice-bars-row'>
        {Array.from({ length: BARS }, (_, i) => <span key={i} className='ds-part-voice-bar' />)}
      </span>
    </div>
  );
}
