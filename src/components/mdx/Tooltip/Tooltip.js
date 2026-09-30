'use client';

/**
 * Tooltip Component
 *
 * @description An explanation for a term in article prose. An info button after the term opens a small
 * popover on hover, focus, or tap. It is built on the core Popover parts rather than the core Tooltip,
 * because touch readers need tap to open. Escape, a tap outside, blur, or moving the pointer away closes it
 * (WCAG 1.4.13).
 *
 * @author Ahmad Assaf
 * @version 3.0.0
 */

import { useEffect, useId, useRef, useState } from 'react';

import Icon from '../../core/Icon';
import { PopoverContentPrimitive, PopoverPrimitive, PopoverTriggerPrimitive } from '../../core/Popover';

const keepFocus = (event) => event.preventDefault();

/**
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.message] - The explanation
 * @param {React.ReactNode} [props.text] - Alias for `message`
 * @param {React.ReactNode} props.children - The term the explanation belongs to
 * @returns {JSX.Element} The term followed by its info button
 *
 * @example
 * <Tooltip message="This provides additional context">technical term</Tooltip>
 */
export default function Tooltip({ message, text, children }) {
  const [ open, setOpen ] = useState(false);
  const closeTimer = useRef(null);
  const descriptionId = useId();
  const explanation = message || text;
  const show = (next) => {
    clearTimeout(closeTimer.current);
    setOpen(next);
  };
  // The pointer can cross the gap onto the explanation and keep it open (WCAG 1.4.13 hoverable).
  const onHover = (next) => (event) => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    if (next) setOpen(true);
    else closeTimer.current = setTimeout(() => setOpen(false), 100);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <span className='inline-flex items-center align-middle'>
      {children}
      <PopoverPrimitive open={ open } onOpenChange={ show }>
        <PopoverTriggerPrimitive
          aria-label='More information'
          aria-describedby={ explanation ? descriptionId : undefined }
          className='ds-control-hit-target ml-1 inline-flex cursor-help items-center rounded-sm text-text-subtle transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
          // A tap or click always opens; closing is left to Escape, blur, and taps outside.
          onClick={ (event) => {
            event.preventDefault();
            show(true);
          } }
          onBlur={ () => show(false) }
          onFocus={ () => show(true) }
          onPointerEnter={ onHover(true) }
          onPointerLeave={ onHover(false) }
        >
          <Icon name='Info' decorative className='size-3.5' />
        </PopoverTriggerPrimitive>
        <PopoverContentPrimitive
          role='tooltip'
          side='top'
          collisionPadding={ 8 }
          className='w-max max-w-[min(20rem,90vw)] px-3 py-2 text-sm leading-6'
          onCloseAutoFocus={ keepFocus }
          onOpenAutoFocus={ keepFocus }
          onPointerEnter={ onHover(true) }
          onPointerLeave={ onHover(false) }
        >
          {explanation}
        </PopoverContentPrimitive>
      </PopoverPrimitive>
      {explanation ? <span id={ descriptionId } hidden>{explanation}</span> : null}
    </span>
  );
}
