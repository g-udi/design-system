import { expect, fireEvent, waitFor } from 'storybook/test';

/** Verify that a real pointer plume is uploaded, remains in motion, and clears without new input. */
export async function checkLiquidEther(effect) {
  const gl = effect.querySelector('canvas').getContext('webgl');
  const descriptor = Object.getOwnPropertyDescriptor(gl, 'texSubImage2D');
  const upload = gl.texSubImage2D;
  let latest, uploads = 0;
  gl.texSubImage2D = function (...args) {
    const pixels = args.at(-1);
    if (ArrayBuffer.isView(pixels)) {
      latest = 0;
      for (let i = 0; i < pixels.length; i += 4) latest += pixels[i] + pixels[i + 1] + pixels[i + 2];
      uploads += 1;
    }
    return upload.apply(this, args);
  };
  const rect = effect.getBoundingClientRect();
  const move = (x, y) => fireEvent.pointerMove(effect, { clientX: rect.left + rect.width * x, clientY: rect.top + rect.height * y, pointerType: 'mouse' });
  try {
    move(0.2, 0.65);
    await waitFor(() => expect(uploads).toBeGreaterThan(2));
    move(0.75, 0.35);
    await waitFor(() => expect(latest).toBeGreaterThan(500));
    // Allow the shared smoothed pointer to settle before measuring an unforced plume.
    await new Promise(resolve => setTimeout(resolve, 1100));
    const stoppedMass = latest, stoppedUploads = uploads;
    expect(stoppedMass).toBeGreaterThan(0);
    await waitFor(() => expect(uploads).toBeGreaterThan(stoppedUploads + 5));
    await waitFor(() => expect(latest).toBeLessThan(stoppedMass * 0.8), { timeout: 2500 });
    expect(latest).toBeGreaterThan(0);
  } finally {
    if (descriptor) Object.defineProperty(gl, 'texSubImage2D', descriptor);
    else delete gl.texSubImage2D;
    fireEvent.pointerLeave(effect);
  }
}
