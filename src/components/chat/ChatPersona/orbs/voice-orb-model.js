// Adapted from VoiceOrbs (MIT, Alexis Munoz). See ./LICENSE.

/** States every orb renderer understands. ChatPersona maps its own states onto these. */
export const orbStates = [ 'idle', 'connecting', 'listening', 'thinking', 'speaking', 'error', 'disabled' ];

export const clamp01 = (value) => Math.min(1, Math.max(0, value));

export const clampLevel = (level) => (Number.isFinite(level) ? clamp01(level) : 0);

export const clampSize = (size, fallback = 168) => (Number.isFinite(size) ? Math.min(512, Math.max(1, size)) : fallback);

export const clampSpeed = (speed) => (Number.isFinite(speed) ? Math.max(0, Math.min(4, speed)) : 1);

export const isHex = (value) => typeof value === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);

export const hexToRgb = (hex) => {
  const clean = isHex(hex) ? hex.slice(1) : '';
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const n = Number.parseInt(full || '0', 16);
  return [ (n >> 16) & 255, (n >> 8) & 255, n & 255 ];
};

/** Linear mix of two hex colours, for lighting maths (tints and shades of a token). */
export const mixHex = (a, b, t) => {
  const [ ar, ag, ab ] = hexToRgb(a);
  const [ br, bg, bb ] = hexToRgb(b);
  const channel = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${channel(ar, br)}${channel(ag, bg)}${channel(ab, bb)}`;
};

/** The resting energy of a state when the host supplies no live level. */
export const stateEnergy = (state, t) => {
  switch (state) {
    case 'listening':
      return 0.4 + 0.32 * Math.abs(Math.sin(t * 8.5)) + 0.18 * Math.abs(Math.sin(t * 4.1 + 1.5));
    case 'speaking':
      return 0.3 + 0.24 * Math.abs(Math.sin(t * 6.2)) + 0.16 * Math.abs(Math.sin(t * 3 + 0.6));
    case 'thinking':
      return 0.24 + 0.2 * Math.abs(Math.sin(t * 2.4));
    case 'connecting':
      return 0.12 + 0.1 * Math.abs(Math.sin(t * 1.6));
    case 'error':
      return 0.2;
    default:
      return 0;
  }
};

/** Frame-rate independent easing toward a target. */
export const approach = (current, target, rate, dt) => current + (target - current) * (1 - Math.exp(-rate * dt));

/** Cross-fades state weights so a change of state blends rather than jumps. */
export const createStateMix = (initial = 'idle') => {
  const weights = Object.fromEntries(orbStates.map((key) => [ key, key === initial ? 1 : 0 ]));
  const update = (state, dt, rate = 6) => {
    let total = 0;
    for (const key of orbStates) {
      const target = key === state ? 1 : 0;
      const next = approach(weights[key], target, rate, dt);
      weights[key] = target === 0 && next < 0.001 ? 0 : next;
      total += weights[key];
    }
    if (total > 0) for (const key of orbStates) weights[key] /= total;
    return weights;
  };
  return { update };
};

/** A live level from the host's ref, when it holds a number in 0..1. */
export const readLevel = (levelRef) => {
  const live = levelRef?.current;
  return typeof live === 'number' && live >= 0 ? clampLevel(live) : null;
};
