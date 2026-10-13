'use client';
import { Fragment, forwardRef, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInterval } from '../../../hooks/state/use-interval.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { useMousePosition } from '../../../hooks/interaction/use-mouse-position.js';
import { clamp } from '../../../utilities/clamp.js';
import { useAnimation, bounded, characters } from '../animationRuntime.js';
import { useGlyphInspectorLayout } from './useGlyphInspectorLayout.js';
import { cn } from '../../../utilities/cn';

// Letters are handled like type specimens: a short leash keeps them near their slot.
const LEASH = { x: 20, y: 28 };
const settle = { type: 'spring', stiffness: 360, damping: 34 };
const strokes = { dashed: '5 3', dotted: '1 3', solid: undefined };
const leash = ({ x, y }) => ({ x: bounded(x, 0, -LEASH.x, LEASH.x), y: bounded(y, 0, -LEASH.y, LEASH.y) });
const codePoint = letter => `U+${(letter.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0')}`;
const visibleLetter = letter => letter === ' ' ? ' ' : letter;

export const GlyphInspector = forwardRef(function GlyphInspector({
  text = 'Gaudi', autoplay = true, draggable = true, readout = true, guides = true, interval = 900,
  outline = 'dashed', accent = 'currentColor', particles = 12, tempo = 1,
  reveal = 'letter', radius = 120, paused = false, activeIndex = 0, className, style, onPointerLeave, ...props
}, forwardedRef) {
  const { ref: animationRef, active } = useAnimation(paused, forwardedRef);
  const line = useRef(null);
  const measure = useRef(null);
  const pointer = useMousePosition({ enabled: active && reveal === 'area' });
  const { ref: layoutRef, fontSize, boxes } = useGlyphInspectorLayout(line, measure, text, style);
  const ref = useMergedRefs(animationRef, layoutRef, pointer.ref);
  const [step, setStep] = useState(0);
  const [pointed, setPointed] = useState(null);
  const [held, setHeld] = useState(null);
  const letters = characters(text);
  const inked = letters.reduce((list, letter, i) => letter.trim() ? [...list, i] : list, []);
  const idle = pointed === null && !held;
  const rate = bounded(tempo, 1, 0.25, 3);
  const particleCount = Math.round(bounded(particles, 12, 0, 40));
  useInterval(() => setStep(n => n + 1), active && autoplay && idle ? bounded(interval, 900, 200, 10000) / rate : null);
  useEffect(() => { setHeld(null); setPointed(null); }, [active, text, draggable]);

  const target = held?.index ?? pointed;
  const pausedIndex = Number.isInteger(activeIndex) && activeIndex >= 0 && activeIndex < letters.length ? activeIndex : 0;
  const focus = paused ? pausedIndex : letters[target]?.trim() ? target : inked[step % Math.max(1, inked.length)];
  const box = letters.length ? boxes[focus] : undefined;
  const shift = active && held ? held.offset : { x: 0, y: 0 };
  const inspecting = Boolean(box && (paused || (active && (autoplay || !idle))));
  const transition = active ? settle : { duration: 0 };
  const dash = outline in strokes ? strokes[outline] : strokes.dashed;
  const left = boxes.length ? Math.min(...boxes.map(b => b.x)) : 0;
  const right = boxes.length ? Math.max(...boxes.map(b => b.right)) : 0;
  const canDrag = active && draggable;
  const focusX = active && reveal === 'area' && pointer.isInside ? pointer.elementX : box?.centerX;
  const focusY = active && reveal === 'area' && pointer.isInside ? pointer.elementY : box?.centerY;

  return <span {...props} ref={ref} className={cn('gaudi-glyph-inspector', className)} data-slot="glyph-inspector" data-animated={active}
    data-dragging={Boolean(active && held)} style={{ '--inspector-accent': accent, '--inspector-period': `${1.4 / rate}s`, ...style }}
    onPointerLeave={event => { onPointerLeave?.(event); if (!held) setPointed(null); }}>
    <span className="sr-only">{text}</span>
    <span className="gaudi-glyph-inspector__measure-clip" aria-hidden="true"><span ref={measure} className="gaudi-glyph-inspector__measure">{letters.map((letter, i) => <span key={i}>{visibleLetter(letter)}</span>)}</span></span>
    <span ref={line} className="gaudi-glyph-inspector__line" aria-hidden="true" data-measured={fontSize !== undefined} style={{ fontSize }}>
      {letters.map((letter, i) => {
        const measured = Boolean(boxes[i]);
        const ink = Boolean(letter.trim());
        const distance = measured ? Math.hypot(boxes[i].centerX - focusX, boxes[i].centerY - focusY) : Infinity;
        const amount = !inspecting || reveal === 'none' ? 0 : reveal === 'area'
          ? clamp((bounded(radius, 120, 20, 400) - distance) / 60, 0, 1) : Number(i === focus);
        return <motion.span key={`${i}-${letter}`} className="gaudi-glyph-inspector__letter" data-focused={Boolean(inspecting && i === focus)}
          style={{ '--inspector-reveal': amount }} animate={!canDrag ? { x: 0, y: 0 } : undefined} transition={transition}
          data-draggable={canDrag && ink} drag={canDrag && ink} dragConstraints={{ left: -LEASH.x, right: LEASH.x, top: -LEASH.y, bottom: LEASH.y }}
          dragElastic={0} dragMomentum={false} dragSnapToOrigin
          onPointerEnter={() => { if (active && ink && !held) setPointed(i); }}
          onDragStart={() => setHeld({ index: i, offset: { x: 0, y: 0 } })}
          onDrag={(_, info) => setHeld({ index: i, offset: leash(info.offset) })}
          onDragEnd={() => { setHeld(null); setPointed(null); }}>
          <span className="gaudi-glyph-inspector__fallback" data-measured={measured}>{visibleLetter(letter)}</span>
          <svg className="gaudi-glyph-inspector__glyph" data-measured={measured} width="100%" height="100%" focusable="false">
            <text className="gaudi-glyph-inspector__fill" x="0" y="0" dominantBaseline="text-before-edge" fill="currentColor">{letter}</text>
            <text className="gaudi-glyph-inspector__outline" x="0" y="0" dominantBaseline="text-before-edge" fill="none" stroke="currentColor" strokeDasharray={dash}>{letter}</text>
          </svg>
        </motion.span>;
      })}
    </span>
    {/* Snap to remeasured typography on resize; spring only between inspection targets. */}
    {inspecting && <Fragment key={JSON.stringify(boxes)}>
      {guides && <svg className="gaudi-glyph-inspector__guides" aria-hidden="true" focusable="false">
        <motion.line initial={false} animate={{ x1: left, x2: right, y1: box.y + shift.y, y2: box.y + shift.y }} transition={transition} />
        <motion.line initial={false} animate={{ x1: left, x2: right, y1: box.y + box.height + shift.y, y2: box.y + box.height + shift.y }} transition={transition} />
        {active && held && <line className="gaudi-glyph-inspector__tether" x1={box.centerX} y1={box.centerY} x2={box.centerX + shift.x} y2={box.centerY + shift.y} />}
      </svg>}
      <motion.span aria-hidden="true" className="gaudi-glyph-inspector__frame" data-slot="glyph-inspector-frame" initial={false}
        animate={{ x: box.x + shift.x, y: box.y + shift.y, width: box.width, height: box.height }} transition={transition}>
        <i /><i /><i /><i />
        {Array.from({ length: particleCount }, (_, i) => {
          const side = i % 4;
          const along = (i * 37 + focus * 19) % 100;
          return <span key={`${focus}-${i}`} className="gaudi-glyph-inspector__particle" style={{
            left: side < 2 ? `${along}%` : side === 2 ? -8 : 'calc(100% + 8px)',
            top: side >= 2 ? `${along}%` : side === 0 ? -8 : 'calc(100% + 8px)',
            '--inspector-drift-x': `${side === 2 ? -8 : side === 3 ? 8 : 0}px`,
            '--inspector-drift-y': `${side === 0 ? -8 : side === 1 ? 8 : 0}px`,
            animationDelay: `${-(i % 7) * 0.19}s`, animationDuration: `${(1.3 + i % 5 * 0.17) / rate}s`
          }} />;
        })}
      </motion.span>
      {readout && <motion.span className="gaudi-glyph-inspector__readout" aria-hidden="true" initial={false}
        animate={{ x: clamp(box.x + shift.x, 0, Math.max(0, right - 140)), y: box.y + box.height + shift.y + 24 }} transition={transition}>
        <b>{letters[focus]}</b> {codePoint(letters[focus])} <span>{active && held ? `Δ ${Math.round(shift.x)}, ${Math.round(shift.y)}` : `${Math.round(box.width)} × ${Math.round(box.height)}`}</span>
      </motion.span>}
    </Fragment>}
  </span>;
});
export default GlyphInspector;
