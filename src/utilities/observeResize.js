/** Defer size-dependent writes until after ResizeObserver delivery. */
export function observeResize(callback) {
  let frame;
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(callback);
  });
  return {
    observe: (element) => observer.observe(element),
    disconnect: () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    }
  };
}
