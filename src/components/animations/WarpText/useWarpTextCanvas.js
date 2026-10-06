'use client';
import { useEffect, useRef, useState } from 'react';
import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { createWarpRenderer, createWarpTextMask } from './warpRenderer.js';

export function useWarpTextCanvas({ root, size, text, active, pointer, hovered, options }) {
  const canvas = useRef(null);
  const wake = useRef(null);
  const [ready, setReady] = useState(false);
  const latest = useLatestRef({ active, pointer, hovered, options });
  useEffect(() => {
    const node = canvas.current, host = root.current;
    if (!node || !host || !size.width || !size.height) return undefined;
    let renderer, frame = null, disposed = false, clock = 0, previous = 0, hover = 0;
    let point = { x: .5, y: .5 };
    const render = now => {
      frame = null;
      if (disposed || !renderer) return;
      const current = latest.current, config = current.options;
      const elapsed = previous ? Math.min((now - previous) / 1000, .05) : 1 / 60;
      previous = now;
      const follow = 1 - Math.exp(-elapsed * 14);
      const inside = current.active && current.hovered;
      hover = current.active ? hover + (Number(inside) - hover) * follow : 0;
      if (inside && current.pointer.elementX !== null) {
        point.x += (current.pointer.elementX / size.width - point.x) * follow;
        point.y += (1 - current.pointer.elementY / size.height - point.y) * follow;
      }
      if (current.active) clock += elapsed * config.speed;
      renderer.draw({ x: point.x, y: point.y, aspect: size.width / size.height, time: clock,
        ambient: current.active ? config.warpStrength : 0, scale: config.warpScale, radius: config.pointerRadius,
        strength: config.pointerStrength, hover, ripple: Number(config.ripple), refraction: config.refraction });
      if (current.active && ((config.warpStrength > 0 && config.speed > 0) || inside || hover > .001)) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (frame === null && !disposed && renderer) frame = requestAnimationFrame(render); };
    const upload = () => {
      if (disposed || !renderer || !host.isConnected) return;
      const mask = createWarpTextMask(host, text, size.width, size.height);
      if (!mask) { setReady(false); return; }
      renderer.upload(mask); schedule(); setReady(true);
    };
    const setup = () => { renderer = createWarpRenderer(node); setReady(false); upload(); };
    const lost = event => { event.preventDefault(); cancelAnimationFrame(frame); frame = null; renderer?.dispose(); renderer = null; setReady(false); };
    node.addEventListener('webglcontextlost', lost);
    node.addEventListener('webglcontextrestored', setup);
    setup(); wake.current = schedule;
    document.fonts?.ready.then(upload);
    document.fonts?.addEventListener('loadingdone', upload);
    const observer = new MutationObserver(upload);
    for (let parent = host; parent; parent = parent.parentElement) observer.observe(parent, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    return () => {
      disposed = true; wake.current = null; cancelAnimationFrame(frame); observer.disconnect();
      document.fonts?.removeEventListener('loadingdone', upload);
      node.removeEventListener('webglcontextlost', lost); node.removeEventListener('webglcontextrestored', setup);
      renderer?.dispose();
    };
  }, [root, size.width, size.height, text, latest]);
  useEffect(() => { wake.current?.(); }, [active, pointer, hovered, options]);
  return { canvas, ready };
}
