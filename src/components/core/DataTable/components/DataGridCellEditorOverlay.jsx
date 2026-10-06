'use client';
import { useInputCaret } from '../../Field/hooks/useInputCaret.js';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../../utilities/cn/index.js';
import { DATA_GRID_BUILT_IN_OVERLAY_CONTROLS, DataGridCellEditorControl } from './DataGridCellEditors.jsx';
function measureDataGridCellEditorStyle(viewport) {
  const cell = viewport.querySelector('td[data-cell-focused]');
  if (!cell) return null;
  const cellRect = cell.getBoundingClientRect();
  const viewportRect = viewport.getBoundingClientRect();
  const cellStyle = getComputedStyle(cell);
  const lineHeight =
    Number.parseFloat(cellStyle.lineHeight) ||
    Number.parseFloat(cellStyle.fontSize) * 1.5 ||
    20;
  const centeredBlockPadding = Math.max(
    Number.parseFloat(cellStyle.paddingTop) || 0,
    (cellRect.height - lineHeight) / 2
  );
  return {
    // Rect deltas are visual; when the viewport itself is the scroll
    // container (the standalone virtual layout), absolute children live in
    // content coordinates, so the scroll offset must be added back. The box
    // matches the cell exactly - editing must not change the cell's
    // geometry - and the cell's own overlay chrome hides for the session
    // (data-cell-editing), so the editor's outline is the ONE border.
    left: cellRect.left - viewportRect.left + viewport.scrollLeft,
    top: cellRect.top - viewportRect.top + viewport.scrollTop,
    width: cellRect.width,
    minHeight: cellRect.height,
    // The font shorthand can serialize empty (Firefox); the longhands after
    // it win where set and cover that case.
    font: cellStyle.font || void 0,
    fontFamily: cellStyle.fontFamily,
    fontSize: cellStyle.fontSize,
    fontWeight: cellStyle.fontWeight,
    fontStyle: cellStyle.fontStyle,
    lineHeight: cellStyle.lineHeight,
    letterSpacing: cellStyle.letterSpacing,
    textAlign: cellStyle.textAlign,
    paddingLeft: cellStyle.paddingLeft,
    paddingRight: cellStyle.paddingRight,
    paddingTop: centeredBlockPadding,
    paddingBottom: centeredBlockPadding
  };
}
function DataGridCellEditorOverlay({
  viewport,
  session,
  enterAdvance,
  onCommit,
  onCancel
}) {
  const [style] = useState(() => measureDataGridCellEditorStyle(viewport));
  const finishedRef = useRef(false);
  const placeCaretAtEnd = (element) => {
    if (!element) return;
    const end = element.value.length;
    element.setSelectionRange?.(end, end);
  };
  const caretRef = useInputCaret(undefined, placeCaretAtEnd);
  useEffect(() => {
    if (!style) onCancel();
  }, [style, onCancel]);
  useEffect(() => {
    const body = viewport.querySelector('tbody');
    if (!body) return;
    const observer = new MutationObserver(() => {
      if (!finishedRef.current) onCancel();
    });
    observer.observe(body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [viewport, onCancel]);
  if (!style) return null;
  const finish = (element, commit, advance = null, refocus = true) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (commit) onCommit(element.value, advance, refocus);
    else onCancel();
  };
  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
    const element = event.currentTarget;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      finish(element, false);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      finish(element, true, event.shiftKey ? 'left' : 'right');
      return;
    }
    if (event.key !== 'Enter') return;
    if (session.control === 'textarea' && (event.shiftKey || event.altKey)) {
      return;
    }
    event.preventDefault();
    finish(
      element,
      true,
      enterAdvance ? (event.shiftKey ? 'up' : 'down') : null
    );
  };
  if (DATA_GRID_BUILT_IN_OVERLAY_CONTROLS.has(session.control)) {
    return createPortal(
      <DataGridCellEditorControl
        session={session}
        style={style}
        enterAdvance={enterAdvance}
        onCommit={(raw, advance, refocus, typed) => {
          if (finishedRef.current) return;
          finishedRef.current = true;
          onCommit(raw, advance, refocus, typed);
        }}
        onCancel={() => {
          if (finishedRef.current) return;
          finishedRef.current = true;
          onCancel();
        }}
      />,
      viewport
    );
  }
  const sharedClassName =
    'text-ui-foreground bg-ui-background absolute z-[35] box-border resize-none shadow-[inset_0_0_0_1px_var(--primary)] aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)]';
  const errorProps = session.error
    ? { 'aria-invalid': true, 'aria-describedby': session.errorId }
    : null;
  return createPortal(
    session.control === 'textarea' ? (
      <textarea
        data-slot='data-grid-cell-editor'
        ref={caretRef}
        autoFocus
        {...errorProps}
        aria-label={session.label}
        defaultValue={session.initialValue}
        rows={1}
        style={style}
        className={cn(sharedClassName, 'field-sizing-content overflow-hidden')}
        onKeyDown={handleKeyDown}
        onBlur={(event) => finish(event.currentTarget, true, null, false)}
      />
    ) : (
      <input
        data-slot='data-grid-cell-editor'
        ref={caretRef}
        autoFocus
        {...errorProps}
        aria-label={session.label}
        defaultValue={session.initialValue}
        style={style}
        className={sharedClassName}
        onKeyDown={handleKeyDown}
        onBlur={(event) => finish(event.currentTarget, true, null, false)}
      />
    ),
    viewport
  );
}
export { DataGridCellEditorOverlay };
