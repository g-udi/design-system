'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { PopoverAnchor, PopoverContentPrimitive, PopoverPrimitive } from '../../core/Popover';
import sanitizeHtml from '../../../utilities/sanitizeHtml';

const triggerSelector = '[data-footnote-popover="true"]';
const keepFocus = (event) => event.preventDefault();

/** Hydrate generated footnote anchors; Core Popover owns positioning and dismissal. */
const Footnote = () => {
  const [ popover, setPopover ] = useState(null);
  const anchorRef = useRef(null);
  const contentRef = useRef(null);
  const timerRef = useRef(null);
  const descriptionId = useId();

  const cancelClose = () => clearTimeout(timerRef.current);
  const closeSoon = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!anchorRef.current?.contains(document.activeElement) && !contentRef.current?.contains(document.activeElement)) setPopover(null);
    }, 200);
  }, []);

  useEffect(() => {
    const show = (event) => {
      const target = event.target.closest?.(triggerSelector);
      if (!target?.dataset.footnoteContent) return;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        anchorRef.current = target;
        setPopover({
          content: sanitizeHtml(target.dataset.footnoteContent),
          number: target.dataset.footnoteNumber || target.textContent
        });
      }, event.type === 'focusin' ? 0 : 300);
    };
    const hide = (event) => {
      if (!event.target.closest?.(triggerSelector)) return;
      if (contentRef.current?.contains(event.relatedTarget) || event.target.contains(event.relatedTarget)) return;
      closeSoon();
    };
    document.addEventListener('pointerover', show, true);
    document.addEventListener('pointerout', hide, true);
    document.addEventListener('focusin', show, true);
    document.addEventListener('focusout', hide, true);
    return () => {
      clearTimeout(timerRef.current);
      document.removeEventListener('pointerover', show, true);
      document.removeEventListener('pointerout', hide, true);
      document.removeEventListener('focusin', show, true);
      document.removeEventListener('focusout', hide, true);
    };
  }, [ closeSoon ]);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!popover || !anchor) return undefined;
    const previous = anchor.getAttribute('aria-describedby');
    anchor.setAttribute('aria-describedby', [ previous, descriptionId ].filter(Boolean).join(' '));
    return () => {
      if (previous === null) anchor.removeAttribute('aria-describedby');
      else anchor.setAttribute('aria-describedby', previous);
    };
  }, [ descriptionId, popover ]);

  if (!popover) return null;

  return (
    <PopoverPrimitive open onOpenChange={ (open) => { if (!open) setPopover(null); } }>
      <PopoverAnchor virtualRef={ anchorRef } />
      <PopoverContentPrimitive
        ref={ contentRef }
        aria-label={ `Footnote ${popover.number}` }
        side='top'
        sideOffset={ 8 }
        collisionPadding={ 12 }
        className='w-80 max-w-[calc(100vw-1.5rem)] max-h-(--radix-popover-content-available-height) overflow-y-auto wrap-anywhere text-sm leading-6'
        onOpenAutoFocus={ keepFocus }
        onCloseAutoFocus={ keepFocus }
        onEscapeKeyDown={ () => {
          if (!contentRef.current?.contains(document.activeElement)) return;
          anchorRef.current?.focus({ preventScroll: true });
          // Returning to the generated anchor must not schedule another focus preview.
          clearTimeout(timerRef.current);
        } }
        onInteractOutside={ (event) => {
          if (event.target.closest?.(triggerSelector)) event.preventDefault();
        } }
        onPointerEnter={ cancelClose }
        onPointerLeave={ closeSoon }
        onFocusCapture={ cancelClose }
        onBlurCapture={ (event) => {
          if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== anchorRef.current) closeSoon();
        } }
      >
        <div id={ descriptionId } dangerouslySetInnerHTML={{ __html: popover.content }} />
      </PopoverContentPrimitive>
    </PopoverPrimitive>
  );
};

export default Footnote;
