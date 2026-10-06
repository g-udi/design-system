// Bounded input history shared by the decorative background shaders.
export function createBackgroundPointer() {
  const pointer = [0.5, 0.5];
  const previousPointer = [...pointer];
  const target = [...pointer];
  const trail = new Float32Array(16 * 4);
  const clicks = new Float32Array(4 * 4);
  let inside = false;
  let held = false;
  let pointerActive = 0;
  let pressed = 0;
  let lastTrailTime = -1;
  let lastTrailPosition = [...pointer];
  const push = (array, position, time, strength) => {
    array.copyWithin(4, 0, array.length - 4);
    array.set([position[0], position[1], time, strength], 0);
  };
  return {
    pointer, previousPointer, trail, clicks,
    get pointerActive() { return pointerActive; },
    get pressed() { return pressed; },
    move(position) { target.splice(0, 2, ...position); inside = true; },
    down(time) { held = true; push(clicks, target, time, 1); },
    release() { held = false; },
    leave() { inside = false; held = false; target.splice(0, 2, 0.5, 0.5); },
    reset() {
      this.leave();
      pointer.splice(0, 2, 0.5, 0.5);
      previousPointer.splice(0, 2, ...pointer);
      pointerActive = pressed = 0;
      trail.fill(0); clicks.fill(0);
      lastTrailTime = -1;
      lastTrailPosition = [...pointer];
    },
    step(delta, time) {
      previousPointer.splice(0, 2, ...pointer);
      if (delta <= 0) return;
      const follow = 1 - Math.exp(-delta * 14);
      pointer[0] += (target[0] - pointer[0]) * follow;
      pointer[1] += (target[1] - pointer[1]) * follow;
      pointerActive += ((inside ? 1 : 0) - pointerActive) * follow;
      pressed += ((held ? 1 : 0) - pressed) * follow;
      const distance = Math.hypot(pointer[0] - lastTrailPosition[0], pointer[1] - lastTrailPosition[1]);
      if (inside && time - lastTrailTime >= 0.065 && distance > 0.004) {
        push(trail, pointer, time, Math.min(1, distance * 12 + 0.2));
        lastTrailPosition = [...pointer];
        lastTrailTime = time;
      }
    }
  };
}
