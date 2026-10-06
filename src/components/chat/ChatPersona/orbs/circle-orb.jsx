'use client';

// Adapted from the orb-ui circle theme (MIT, Alexander Chen). See ./LICENSE.

import { useEffect, useRef } from 'react';
import { approach, clamp01, clampSize, clampSpeed, hexToRgb, readLevel, stateEnergy } from './voice-orb-model.js';
import { createLoop, observeActivity, prefersReducedMotion, subscribeReducedMotion } from './observe-activity.js';
import { useVoiceOrbColors } from './use-voice-orb-colors.js';

// How far each state's fill sits between the palette's from (0) and to (1) colour.
const TINT = { idle: 0, connecting: 0.25, listening: 0.55, thinking: 0.35, speaking: 1, disabled: 0 };
const STILL_PHASE = 0.9;

const breath = (period, t) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / period);

// Scale, glow (share of the size) and opacity a state aims for at time t with level 0..1.
const pose = (state, level, t) => {
  switch (state) {
    case 'listening':
      return { scale: 0.82 + 0.18 * level, glow: 0, alpha: 1 };
    case 'speaking':
      return { scale: 0.95 + 0.08 * level, glow: 0.14 * level, alpha: 1 };
    case 'connecting':
    case 'thinking': {
      const pulse = Math.sin((Math.PI * t) / 1.5) ** 2;
      return { scale: 1 - 0.05 * pulse, glow: 0, alpha: 1 - 0.4 * pulse };
    }
    case 'idle':
      return { scale: 1 + 0.06 * breath(6, t), glow: 0, alpha: 1 };
    default:
      return { scale: 1, glow: 0, alpha: 1 };
  }
};

/**
 * Circle: a flat disc that breathes at rest, tightens and follows the level while listening, pulses
 * while connecting or thinking, and swells with a glow while speaking. One frame loop writes custom
 * properties; the still frame keeps each state's size, tint and opacity.
 */
export function CircleOrb({ active = false, state = 'idle', size: requestedSize = 168, speed: requestedSpeed = 1, colorFrom: requestedFrom, colorTo: requestedTo, levelRef }) {
  const size = clampSize(requestedSize);
  const speed = clampSpeed(requestedSpeed);
  const moving = active && speed > 0;
  const hostRef = useRef(null);
  const colors = useVoiceOrbColors(hostRef, 'circle', requestedFrom, requestedTo);
  const live = useRef({ state, speed, colors });
  const redrawRef = useRef(null);

  useEffect(() => {
    live.current = { state, speed, colors };
    redrawRef.current?.();
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
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
    let scale = 1;
    let glow = 0;
    let alpha = 1;
    let fill = target(live.current.state);
    const write = () => {
      host.style.setProperty('--ds-voice-scale', scale.toFixed(4));
      host.style.setProperty('--ds-voice-glow', `${(glow * size).toFixed(2)}px`);
      host.style.setProperty('--ds-voice-alpha', alpha.toFixed(3));
      host.style.setProperty('--ds-voice-fill', `rgb(${fill.map(Math.round).join(' ')})`);
    };
    const render = (dt, still = false) => {
      const current = live.current.state;
      level = still ? stateEnergy(current, STILL_PHASE) : approach(level, readLevel(levelRef) ?? stateEnergy(current, clock), 20, dt);
      const goal = pose(current, clamp01(level), still ? STILL_PHASE : clock);
      const colour = target(current);
      if (still) {
        ({ scale, glow, alpha } = goal);
        fill = colour;
      } else {
        scale = approach(scale, goal.scale, goal.scale > scale ? 46 : 21, dt);
        glow = approach(glow, goal.glow, goal.glow > glow ? 46 : 21, dt);
        alpha = approach(alpha, goal.alpha, 12, dt);
        fill = fill.map((channel, i) => approach(channel, colour[i], 3.7, dt));
      }
      write();
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
  }, [ levelRef, moving, size ]);

  return (
    <div ref={hostRef} data-slot='voice-orb' data-orb='circle' data-state={state} data-renderer='css' data-moving={moving || undefined} className='ds-part-voice-orb ds-part-voice-circle' style={{ width: size, '--ds-voice-fill': state === 'error' ? colors.errorFrom : colors.colorFrom }}>
      <span aria-hidden='true' className='ds-part-voice-circle-glow' />
      <span aria-hidden='true' className='ds-part-voice-circle-disc' />
    </div>
  );
}
