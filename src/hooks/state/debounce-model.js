/**
 * A plain debouncer: `schedule(...args)` restarts the timer and the callback runs once, `delay` ms
 * after the last call, with the latest arguments. `flush()` runs pending work now; `cancel()` drops it.
 */
export function createDebouncer(callback, delay = 300, { setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  let timer = null;
  let pending = null;
  const cancel = () => {
    if (timer !== null) clearTimer(timer);
    timer = null;
    pending = null;
  };
  const flush = () => {
    const args = pending;
    // Release the completed work before calling the host, which may schedule more.
    cancel();
    if (args) callback(...args);
  };
  const schedule = (...args) => {
    if (timer !== null) clearTimer(timer);
    pending = args;
    timer = setTimer(flush, delay);
  };
  return { schedule, flush, cancel, isPending: () => pending !== null };
}
