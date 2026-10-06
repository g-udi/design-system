'use client';
import { Children, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import {
  useIsomorphicLayoutEffect as useIsoLayoutEffect
} from '../../../../hooks/state/use-isomorphic-layout-effect.js';
import { TOKEN_COLOR_CLASS, TOKEN_MOTION_CLASS, CodeBlockLineRow } from './CodeBlockLine.jsx';
function containsElementType(node, type) {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue;
    if (child.type === type) return true;
    const inner = child.props.children;
    if (inner && containsElementType(inner, type)) return true;
  }
  return false;
}
function CodeBlockSurface({
  lines,
  wrap,
  startLine,
  showLineNumbers,
  focusMode,
  selectable,
  selectedSet,
  toggleLine,
  visibleLines,
  gutterMax,
  foldable,
  gutterChannel,
  actionsSide,
  foldStarts,
  foldedSet,
  onToggleFold,
  expandClearance,
  streaming,
  label,
  contentId,
  actions,
  completeAnnouncement,
  scroll = true,
  className
}) {
  const viewportRef = useRef(null);
  const preRef = useRef(null);
  const [activeLine, setActiveLine] = useState(null);
  const stickRef = useRef(true);
  const [announcement, setAnnouncement] = useState('');
  const wasStreaming = useRef(streaming);
  useEffect(() => {
    if (wasStreaming.current && !streaming) {
      setAnnouncement(
        completeAnnouncement ??
          `Code generation complete, ${lines.length} lines.`
      );
    }
    wasStreaming.current = streaming;
  }, [streaming, lines.length, completeAnnouncement]);
  const resolveScroller = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return null;
    if (viewport.scrollHeight > viewport.clientHeight + 1) return viewport;
    let node = viewport.parentElement;
    while (node && node !== document.body) {
      const overflowY = getComputedStyle(node).overflowY;
      if (
        (overflowY === 'auto' ||
          overflowY === 'scroll' ||
          overflowY === 'overlay') &&
        node.scrollHeight > node.clientHeight + 1
      ) {
        return node;
      }
      node = node.parentElement;
    }
    const page = document.scrollingElement;
    if (page && page.scrollHeight > page.clientHeight + 1) return page;
    return viewport;
  }, []);
  const handleScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const distance =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    stickRef.current = distance < 24;
  }, []);
  useEffect(() => {
    if (!streaming) return;
    const scroller = resolveScroller();
    if (!scroller || scroller === viewportRef.current) return;
    const onScroll = () => {
      const distance =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      stickRef.current = distance < 24;
    };
    const target = scroller === document.scrollingElement ? window : scroller;
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, [streaming, lines.length, resolveScroller]);
  useIsoLayoutEffect(() => {
    if (!streaming || !stickRef.current) return;
    const scroller = resolveScroller();
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [lines, streaming, resolveScroller]);
  const trackActive = useCallback(
    (event) => {
      if (!actions && !selectable) return;
      const target = event.target;
      const row = target?.closest?.('[data-code-line]');
      const value = row?.getAttribute('data-code-line');
      if (!value) return;
      setActiveLine(Number(value));
    },
    [actions, selectable]
  );
  const clearActive = useCallback(() => setActiveLine(null), []);
  const toggleDisplayed = useCallback(
    (displayed, extend) => toggleLine(displayed - startLine + 1, extend),
    [toggleLine, startLine]
  );
  const handleKeyDown = useCallback(
    (event) => {
      if (!selectable) return;
      // Line actions retain their native keyboard behavior inside the grid.
      if (event.target.closest('button, a, input, select, textarea')) return;
      if (event.key === 'Escape') {
        setActiveLine(null);
        return;
      }
      if ((event.key === 'Enter' || event.key === ' ') && activeLine !== null) {
        event.preventDefault();
        toggleDisplayed(activeLine, event.shiftKey);
        return;
      }
      const isArrow = event.key === 'ArrowDown' || event.key === 'ArrowUp';
      if (!isArrow && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      let next;
      if (event.key === 'Home') {
        next = lines[0]?.number ?? startLine;
      } else if (event.key === 'End') {
        next = lines[lines.length - 1]?.number ?? startLine;
      } else {
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const index = lines.findIndex((line) => line.number === activeLine);
        const nextIndex =
          index === -1
            ? step === 1
              ? 0
              : lines.length - 1
            : Math.min(lines.length - 1, Math.max(0, index + step));
        next = lines[nextIndex]?.number ?? startLine;
      }
      setActiveLine(next);
      const row = preRef.current?.querySelector(`[data-code-line="${next}"]`);
      row?.scrollIntoView({ block: 'nearest' });
      if (isArrow && event.shiftKey) toggleDisplayed(next, true);
    },
    [selectable, lines, startLine, activeLine, toggleDisplayed]
  );
  const lastLineNumber = lines[lines.length - 1]?.number;
  const gutterDigits = Math.max(
    2,
    String(gutterMax ?? startLine).length,
    ...lines.map((line) => line.gutter?.length ?? 0)
  );
  const surfaceStyle = {
    '--code-block-gutter-width': gutterChannel
      ? `calc(${gutterDigits}ch + var(--code-block-fold-width) + var(--code-block-gutter-gap) + var(--code-block-padding))`
      : `calc(${gutterDigits}ch + var(--code-block-gutter-gap) + var(--code-block-padding))`,
    counterReset: `cb-line ${startLine - 1}`
  };
  return (
    <div
      data-slot='code-block-content'
      className={cn(
        'relative min-w-0 rounded-[inherit]',
        /* Clipping is the scroll-mode contract only: composed, a clipped pre
         would hide its own width from the ancestor's viewport and the
         horizontal scrollbar would never render. */
        scroll && 'flex-1 overflow-hidden'
      )}
    >
      {/* A polite status, deliberately NOT an aria-live region on the code
       itself: a live region over streaming code narrates every token. */}
      <span role='status' aria-live='polite' className='sr-only'>
        {announcement}
      </span>
      {/* A plain overflow container, deliberately not a ScrollArea primitive.
       The scroll must stay INSIDE the block (the sticky gutter, the
       stick-to-bottom stream and `maxLines` all anchor to it), but nothing
       here needs custom scrollbar machinery, and dropping it leaves the
       block with no UI-library dependency at all - which is why both twins
       are the same file. Compose Card, Frame, or your own ScrollArea
       around the block for outer framing. */}
      <div
        ref={viewportRef}
        data-slot='code-block-viewport'
        id={contentId}
        role={selectable ? 'grid' : 'region'}
        aria-label={label}
        aria-multiselectable={selectable || void 0}
        aria-busy={streaming || void 0}
        aria-activedescendant={
          selectable && activeLine !== null
            ? `${contentId}-L${activeLine}`
            : void 0
        }
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className={cn(
          'focus-visible:ring-ui-primary relative min-w-0 rounded-[inherit] outline-none focus-visible:ring-[3px]',
          /* Composed under an ancestor scroller the surface scrolls NOTHING
         itself: both axes belong to the ancestor, whose viewport picks up
         the pre's overflowing width, and the sticky number cell anchors
         to that viewport instead. Mixed ownership shipped once and read
         as two scrollbar styles on one block. */
          scroll && '[scrollbar-width:thin] overflow-auto',
          scroll && visibleLines && 'max-h-(--cb-max-height)',
          className
        )}
        style={
          scroll && visibleLines
            ? {
                '--cb-max-height': `calc(${visibleLines} * var(--code-block-line-height) + 2 * var(--code-block-padding))`
              }
            : void 0
        }
      >
        <pre
          ref={preRef}
          dir='ltr'
          data-code-line-numbers={showLineNumbers || void 0}
          data-wrap={wrap || void 0}
          role={selectable ? 'presentation' : void 0}
          data-selectable={selectable || void 0}
          onPointerOver={trackActive}
          onPointerLeave={clearActive}
          onFocus={trackActive}
          className={cn(
            'w-max min-w-full py-(--code-block-padding) font-mono text-(length:--code-block-font-size)',
            TOKEN_COLOR_CLASS,
            TOKEN_MOTION_CLASS,
            /* `min-w-0` must beat the `min-w-full` above, or the pre keeps
             a floor of 100% of a scroll container that is itself wider
             than the viewport, and wrapping still leaves a stray
             horizontal scrollbar. */
            wrap && 'w-full max-w-full min-w-0 break-words whitespace-pre-wrap',
            showLineNumbers && 'pl-(--code-block-gutter-width)',
            /* The expand control floats over the surface in BOTH states, so
             an expanded block reserves a row of clearance rather than
             growing a bordered footer under the code. */
            expandClearance && 'pb-(--code-block-expand-clearance)'
          )}
          style={surfaceStyle}
        >
          {/* `content-visibility: auto` is a measured dead end on BOTH axes:
           its style containment breaks the shared gutter counter
           (every number renders as 1), and per-row it still fails -
           the paint containment clips the number cell, which is
           deliberately pulled left OUT of the row's box (verified in
           Chrome: forcing one row visible restored only that row's
           number). Windowing here means rendering fewer rows, not
           containing them. */}
          {/* Presentation wrappers leave selectable rows owned by the grid. */}
          <code
            data-slot='code-block-code'
            role={selectable ? 'presentation' : void 0}
          >
            {lines.map((line) => (
              <CodeBlockLineRow
                key={line.number}
                line={line}
                selectable={selectable}
                selected={selectedSet.has(line.number - startLine + 1)}
                focusMode={focusMode}
                active={activeLine === line.number}
                caret={streaming && line.number === lastLineNumber}
                actions={activeLine === line.number ? actions : null}
                actionsSide={actionsSide}
                domIdBase={contentId}
                startLine={startLine}
                onSelect={toggleDisplayed}
                foldable={foldable}
                foldRegion={foldStarts.get(line.number - startLine + 1)}
                folded={foldedSet.has(line.number - startLine + 1)}
                onToggleFold={onToggleFold}
              />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
export { containsElementType, CodeBlockSurface };
