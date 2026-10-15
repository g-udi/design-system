/**
 * A plain throttler: the first call runs at once (`leading`); later calls inside the window fold
 * into one trailing call with the latest arguments (`trailing`).
 */
export function createThrottler(callback, wait = 200, {
  leading = true,
  trailing = true,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout
} = {}) {
  let last = -Infinity;
  let timer = null;
  let pending = null;
  const invoke = (args) => {
    last = now();
    callback(...args);
  };
  const cancel = () => {
    if (timer !== null) clearTimer(timer);
    timer = null;
    pending = null;
  };
  const flush = () => {
    const args = pending;
    cancel();
    if (args) invoke(args);
  };
  const schedule = (...args) => {
    if (timer === null && now() - last >= wait) {
      if (leading) {
        invoke(args);
        return;
      }
      last = now();
    }
    if (!trailing) return;
    pending = args;
    if (timer === null) timer = setTimer(flush, Math.max(0, wait - (now() - last)));
  };
  return { schedule, flush, cancel };
}
