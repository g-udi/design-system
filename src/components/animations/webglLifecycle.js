// Keep attached canvases usable across StrictMode and effect reconfiguration.
// Detached renderers can release their GPU context without waiting for GC.
export function releaseDetachedWebGLContext(gl) {
  if (!gl.canvas.isConnected && !gl.isContextLost()) gl.getExtension('WEBGL_lose_context')?.loseContext();
}
