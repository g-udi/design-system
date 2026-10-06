'use client';

// Adapted from VoiceOrbs (MIT, Alexis Munoz). See ./LICENSE. VoiceOrbs draws the liquid metal with a
// shader library; Gaudi adds no shader dependency, so the metal is a CSS sphere with a rotating sheen
// and an energy-driven swell and glow.

import { useEffect, useRef } from 'react';
import { approach, clampSize, clampSpeed, mixHex, readLevel, stateEnergy } from './voice-orb-model.js';
import { createLoop, observeActivity, prefersReducedMotion, subscribeReducedMotion } from './observe-activity.js';
import { useVoiceOrbColors } from './use-voice-orb-colors.js';

const SPIN = { error: 1.7, listening: 1.45, speaking: 1.15, thinking: 0.85, connecting: 0.5, idle: 0.32, disabled: 0 };
const STILL_PHASE = 0.9;

const tint = (hex, t) => mixHex(hex, '#ffffff', t);
const shade = (hex, t) => mixHex(hex, '#000000', t);

const layers = (from, to) => ({
  base: `radial-gradient(circle at 50% 38%, ${tint(from, 0.5)}, ${mixHex(from, to, 0.5)} 45%, ${shade(to, 0.55)} 100%)`,
  sheen: `conic-gradient(from 210deg at 50% 50%, transparent 0deg, ${tint(to, 0.65)} 40deg, transparent 90deg, ${tint(from, 0.4)} 180deg, transparent 240deg, ${tint(to, 0.5)} 300deg, transparent 360deg)`
});

/**
 * Mercury: a polished metal sphere whose sheen turns with the state and swells with the level. Pure
 * CSS layers driven by one animation frame loop that writes custom properties (no re-render per frame).
 */
export function MercuryOrb({ active = false, state = 'idle', size: requestedSize = 168, speed: requestedSpeed = 1, colorFrom: requestedFrom, colorTo: requestedTo, levelRef }) {
  const size = clampSize(requestedSize);
  const speed = clampSpeed(requestedSpeed);
  const moving = active && speed > 0;
  const hostRef = useRef(null);
  const sphereRef = useRef(null);
  const { colorFrom, colorTo, errorFrom, errorTo } = useVoiceOrbColors(hostRef, 'mercury', requestedFrom, requestedTo);
  const live = useRef({ state, speed });

  useEffect(() => {
    live.current = { state, speed };
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let energy = 0;
    let angle = 0;
    let clock = 0;
    const write = (value, turn) => {
      host.style.setProperty('--ds-voice-energy', value.toFixed(3));
      host.style.setProperty('--ds-voice-turn', `${turn.toFixed(1)}deg`);
    };
    let inView = true;
    const loop = createLoop((dt) => {
      const { state: current, speed: multiplier } = live.current;
      clock += dt * multiplier;
      energy = approach(energy, readLevel(levelRef) ?? stateEnergy(current, clock), 7.5, dt);
      angle = (angle + dt * 60 * (SPIN[current] ?? SPIN.idle) * multiplier) % 360;
      write(energy, angle);
    }, () => write(stateEnergy(live.current.state, STILL_PHASE), angle));
    const apply = () => loop.sync(!prefersReducedMotion() && inView && moving);
    apply();
    const unsubscribeMotion = subscribeReducedMotion(apply);
    const unobserve = observeActivity(host, (visible) => {
      inView = visible;
      apply();
    });
    return () => {
      loop.stop();
      unsubscribeMotion();
      unobserve();
    };
  }, [ levelRef, moving, state ]);

  // A short shake when the state turns to error, skipped for reduced motion.
  useEffect(() => {
    const sphere = sphereRef.current;
    if (state !== 'error' || !moving || !sphere?.animate || prefersReducedMotion()) return undefined;
    const shake = sphere.animate([
      { transform: 'translateX(0)' }, { transform: 'translateX(-1.5px)' }, { transform: 'translateX(3px)' },
      { transform: 'translateX(-2px)' }, { transform: 'translateX(1px)' }, { transform: 'translateX(0)' }
    ], { duration: 340, easing: 'ease-out' });
    return () => shake.cancel();
  }, [ state, moving ]);

  const isError = state === 'error';
  const from = isError ? errorFrom : colorFrom;
  const to = isError ? errorTo : colorTo;
  const brand = layers(colorFrom, colorTo);
  const error = layers(errorFrom, errorTo);
  return (
    <div
      ref={hostRef}
      data-slot='voice-orb'
      data-orb='mercury'
      data-state={state}
      data-renderer='css'
      data-moving={moving || undefined}
      className='ds-part-voice-orb ds-part-voice-mercury'
      style={{ width: size, '--ds-voice-a': from, '--ds-voice-b': to, '--ds-voice-size': `${size}px`, '--ds-voice-back': shade(mixHex(from, to, 0.5), 0.72) }}
    >
      <span aria-hidden='true' className='ds-part-voice-mercury-glow' />
      <span ref={sphereRef} aria-hidden='true' className='ds-part-voice-mercury-sphere'>
        {[ [ 'brand', brand, !isError ], [ 'error', error, isError ] ].map(([ key, layer, visible ]) => (
          <span key={key} className='ds-part-voice-mercury-layer' style={{ backgroundImage: layer.base, opacity: visible ? 1 : 0 }}>
            <span className='ds-part-voice-mercury-sheen' style={{ backgroundImage: layer.sheen }} />
          </span>
        ))}
        <span className='ds-part-voice-mercury-highlight' />
      </span>
    </div>
  );
}
