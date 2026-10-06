/** Defer size-dependent writes until after ResizeObserver delivery. */
export function observeResize(callback) {
  let frame;
  const observer = new ResizeObserver((entries) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => callback(entries));
  });
  return {
    observe: (element, options) => observer.observe(element, options),
    disconnect: () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    }
  };
}
