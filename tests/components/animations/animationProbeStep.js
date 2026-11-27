import { waitFor } from 'storybook/test';

// Fail the current operation while its temporary root and restoration code are in scope.
export async function animationProbeStep(label, run, timeoutMs = 6000) {
  let timer;
  try {
    return await Promise.race([
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Animation browser check stalled at ${label}`)), timeoutMs);
      }),
      Promise.resolve().then(run),
    ]);
  } catch (cause) {
    throw new Error(`Animation browser check failed at ${label}: ${cause.message}`, { cause });
  } finally {
    clearTimeout(timer);
  }
}

export function waitForAnimationState(container, label, check) {
  return animationProbeStep(label, () => waitFor(check, { container, timeout: 3000 }));
}
