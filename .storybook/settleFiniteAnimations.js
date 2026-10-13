// Browser-only body, also serializable through Playwright's frame.evaluate.
export async function settleFiniteAnimations() {
  const animations = document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity);
  if (!animations.length) return true;
  let timeout;
  try {
    return await Promise.race([
      Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => true),
      new Promise(resolve => { timeout = setTimeout(() => resolve(false), 2000); })
    ]);
  } finally { clearTimeout(timeout); }
}
