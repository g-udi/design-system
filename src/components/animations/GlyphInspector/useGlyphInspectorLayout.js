'use client';
import { useRef, useState } from 'react';
import { useElementSize } from '../../../hooks/layout/use-element-size.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';

// Measure the browser's actual SVG glyphs, including the chosen host font.
export function useGlyphInspectorLayout(line, measure, text, style) {
  const root = useRef(null);
  const [sizeRef, size] = useElementSize({ round: false });
  const ref = useMergedRefs(root, sizeRef);
  const [fontSize, setFontSize] = useState(undefined);
  const [boxes, setBoxes] = useState([]);
  useIsomorphicLayoutEffect(() => {
    if (!root.current || !measure.current || !line.current) return undefined;
    let disposed = false;
    const update = () => {
      if (disposed) return;
      const node = root.current;
      if (!node?.isConnected) return;
      const computed = getComputedStyle(node);
      const inheritedSize = parseFloat(computed.fontSize);
      if (!Number.isFinite(inheritedSize)) return;
      const available = Math.max(1, node.clientWidth - parseFloat(computed.paddingLeft) - parseFloat(computed.paddingRight));
      const natural = measure.current.getBoundingClientRect().width;
      const nextFontSize = inheritedSize * Math.min(1, available / Math.max(1, natural));
      setFontSize(previous => Math.abs((previous ?? 0) - nextFontSize) < 0.01 ? previous : nextFontSize);
      const bounds = node.getBoundingClientRect();
      const context = document.createElement('canvas').getContext('2d');
      const next = [...line.current.querySelectorAll('.gaudi-glyph-inspector__fill')].map(glyph => {
        const letter = glyph.closest('.gaudi-glyph-inspector__letter');
        const rect = glyph.getBoundingClientRect();
        // Ignore the transient drag transform when measuring the resting layout.
        const matrix = new DOMMatrix(getComputedStyle(letter).transform);
        let ink = rect;
        if (context && glyph.textContent.trim() && glyph.getNumberOfChars()) {
          const font = getComputedStyle(glyph);
          context.font = `${font.fontStyle} ${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
          const metrics = context.measureText(glyph.textContent);
          // SVG's text-before-edge baseline is not reflected in getStartPositionOfChar.
          // Start at its font box and remove the font's unused ascent/descent instead.
          ink = { left: rect.left - metrics.actualBoundingBoxLeft, top: rect.top + (metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent) - metrics.actualBoundingBoxAscent,
            width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight, height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent };
        }
        const x = ink.left - bounds.left - matrix.m41 - 4;
        const y = ink.top - bounds.top - matrix.m42 - 4;
        const width = ink.width + 8, height = ink.height + 8;
        return { x, y, width, height, right: x + width, centerX: x + width / 2, centerY: y + height / 2 };
      });
      setBoxes(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    update();
    document.fonts?.ready.then(update);
    document.fonts?.addEventListener('loadingdone', update);
    return () => { disposed = true; document.fonts?.removeEventListener('loadingdone', update); };
  }, [fontSize, line, measure, size.width, size.height, text, style]);
  return { ref, fontSize, boxes };
}
