'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders modal content into `container` (the document body by default) and isolates the container's other
 * children: they become inert and hidden, and the container stops scrolling while the portal is mounted.
 */
const DialogPortal = ({ children, container, initialFocusRef, lockScroll = true, restoreFocus = true, restoreFocusRef }) => {
  const [ portalNode, setPortalNode ] = useState(null);
  const previouslyFocusedElementRef = useRef(null);

  if (!previouslyFocusedElementRef.current && typeof document !== 'undefined')
    previouslyFocusedElementRef.current = document.activeElement;

  useEffect(() => {
    const node = document.createElement('div');

    node.dataset.dialogPortal = 'true';
    (container ?? document.body).append(node);
    setPortalNode(node);

    return () => node.remove();
  }, [ container ]);

  useEffect(() => {
    if (!portalNode) return undefined;

    const root = portalNode.parentElement;
    const backgroundElements = Array.from(root.children).filter((element) => element !== portalNode);
    const previousStates = backgroundElements.map((element) => ({
      element,
      hadInert: element.hasAttribute('inert'),
      ariaHidden: element.getAttribute('aria-hidden')
    }));
    const fallbackFocusElement = restoreFocusRef?.current;
    const previousOverflow = root.style.overflow;

    backgroundElements.forEach((element) => {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    });

    if (lockScroll) root.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => initialFocusRef?.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);

      previousStates.forEach(({ ariaHidden, element, hadInert }) => {
        if (!hadInert) element.removeAttribute('inert');
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });

      if (lockScroll) root.style.overflow = previousOverflow;

      const previouslyFocusedElement = previouslyFocusedElementRef.current;
      const focusTarget = previouslyFocusedElement instanceof HTMLElement && previouslyFocusedElement.isConnected
        ? previouslyFocusedElement
        : fallbackFocusElement;

      if (restoreFocus && focusTarget instanceof HTMLElement && focusTarget.isConnected) focusTarget.focus();
    };
  }, [ initialFocusRef, lockScroll, portalNode, restoreFocus, restoreFocusRef ]);

  return portalNode ? createPortal(children, portalNode) : null;
};

export default DialogPortal;
