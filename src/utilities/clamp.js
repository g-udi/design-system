/** Limit `value` to the inclusive range [min, max]. */
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
