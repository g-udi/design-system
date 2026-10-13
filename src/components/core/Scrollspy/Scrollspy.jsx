'use client';
import { useCallback, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { useEventListener } from '../../../hooks/interaction/use-event-listener.js';

// Position within the actual scrolling viewport, independent of the section's offset parent.
const sectionTop = (section, viewport) => viewport === window || viewport === document.documentElement
  ? section.getBoundingClientRect().top + window.scrollY
  : section.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop - viewport.clientTop;

// A ref may name a ScrollArea wrapper or its viewport. Never substitute a
// nested navigator's viewport for an already-scrollable article boundary.
const scrollViewport = targetRef => {
  const element = targetRef ? targetRef.current : document.documentElement;
  if (element === window || element === document) return document.documentElement;
  if (!(element instanceof HTMLElement) || element === document.documentElement) return element;
  if (element.matches('[data-slot="scroll-area-viewport"]') || ['auto', 'scroll', 'overlay'].includes(getComputedStyle(element).overflowY)) return element;
  return element.querySelector('[data-slot="scroll-area-viewport"]') || element;
};
export function Scrollspy({
  children,
  targetRef,
  onUpdate,
  className,
  offset = 0,
  smooth = true,
  dataAttribute = 'scrollspy',
  history = false,
  fallbackToFirst = true
}) {
  const reduceMotion = usePrefersReducedMotion();
  const selfRef = useRef(null);
  const prevIdTracker = useRef(null);
  const clickedDestination = useRef(null);
  const setActiveSection = useCallback(
    (sectionId, force = false) => {
      selfRef.current?.querySelectorAll(`[data-${dataAttribute}-anchor]`).forEach((item) => {
        const id = item.getAttribute(`data-${dataAttribute}-anchor`);
        if (id === sectionId) {
          item.setAttribute('data-active', 'true');
          item.setAttribute('aria-current', 'location');
        } else {
          item.removeAttribute('data-active');
          item.removeAttribute('aria-current');
        }
      });
      if (prevIdTracker.current !== sectionId) onUpdate?.(sectionId);
      if (sectionId && history && (force || prevIdTracker.current !== sectionId)) {
        window.history.replaceState(window.history.state, '', `#${sectionId}`);
      }
      prevIdTracker.current = sectionId;
    },
    [dataAttribute, history, onUpdate]
  );
  const handleScroll = useCallback(() => {
    const anchors = selfRef.current?.querySelectorAll(`[data-${dataAttribute}-anchor]`);
    if (!anchors?.length) return;
    const scrollElement = scrollViewport(targetRef);
    if (!scrollElement) return;
    const scrollTop =
      scrollElement === document.documentElement
        ? window.scrollY || document.documentElement.scrollTop
        : scrollElement.scrollTop;
    const clicked = clickedDestination.current;
    if (clicked && [...anchors].some(anchor => anchor.getAttribute(`data-${dataAttribute}-anchor`) === clicked.id)) {
      if (Math.abs(scrollTop - clicked.top) <= 1) {
        clicked.arrived = true;
        setActiveSection(clicked.id);
        return;
      }
      if (clicked.arrived) clickedDestination.current = null;
    } else clickedDestination.current = null;
    let activeIdx = fallbackToFirst ? 0 : -1;
    let minDelta = Infinity;
    anchors.forEach((anchor, idx) => {
      const sectionId2 = anchor.getAttribute(`data-${dataAttribute}-anchor`);
      const sectionElement = document.getElementById(sectionId2);
      if (!sectionElement) return;
      let customOffset = offset;
      const dataOffset = anchor.getAttribute(`data-${dataAttribute}-offset`);
      if (dataOffset) customOffset = parseInt(dataOffset, 10);
      const top = sectionTop(sectionElement, scrollElement) - customOffset;
      const delta = Math.abs(top - scrollTop);
      if (
        // Scroll positions can round down while heading geometry retains subpixels.
        top <= scrollTop + 1 &&
        delta < minDelta
      ) {
        minDelta = delta;
        activeIdx = idx;
      }
    });
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;
    if (scrollHeight > clientHeight + 1 && scrollTop + clientHeight >= scrollHeight - 2) {
      activeIdx = anchors.length - 1;
    }
    const activeAnchor = anchors[activeIdx];
    const sectionId =
      activeAnchor?.getAttribute(`data-${dataAttribute}-anchor`) || null;
    setActiveSection(sectionId);
  }, [targetRef, dataAttribute, offset, fallbackToFirst, setActiveSection]);
  const scrollTo = useCallback(
    (anchorElement) => (event) => {
      if (event && (event.defaultPrevented || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)) return;
      const sectionId =
        anchorElement
          .getAttribute(`data-${dataAttribute}-anchor`)
          ?.replace('#', '') || null;
      if (!sectionId) return;
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) return;
      const viewport = scrollViewport(targetRef);
      const scrollToElement = viewport === document.documentElement ? window : viewport;
      let customOffset = offset;
      const dataOffset = anchorElement.getAttribute(
        `data-${dataAttribute}-offset`
      );
      if (dataOffset) {
        customOffset = parseInt(dataOffset, 10);
      }
      if (!scrollToElement) return;
      event?.preventDefault();
      const scrollTop = sectionTop(sectionElement, scrollToElement) - customOffset;
      clickedDestination.current = {
        id: sectionId,
        top: Math.max(0, Math.min(scrollTop, viewport.scrollHeight - viewport.clientHeight)),
        arrived: false
      };
      if (scrollToElement && 'scrollTo' in scrollToElement) {
        scrollToElement.scrollTo({
          top: scrollTop,
          left: 0,
          behavior: smooth && !reduceMotion ? 'smooth' : 'auto'
        });
      }
      setActiveSection(sectionId, true);
    },
    [dataAttribute, offset, smooth, reduceMotion, targetRef, setActiveSection]
  );
  const scrollToHashSection = useCallback(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetElement = [...(selfRef.current?.querySelectorAll(`[data-${dataAttribute}-anchor]`) || [])]
        .find(anchor => anchor.getAttribute(`data-${dataAttribute}-anchor`) === hash);
      if (targetElement) {
        scrollTo(targetElement)();
      }
    }
  }, [dataAttribute, scrollTo]);
  useEffect(() => { handleScroll(); }, [children, handleScroll]);
  useEventListener('scroll', (event) => {
    const scrollElement = scrollViewport(targetRef);
    if (scrollElement === document.documentElement || (scrollElement instanceof HTMLElement && scrollElement.contains(event.target))) handleScroll();
  }, 'window', { capture: true, passive: true });
  useEventListener('resize', () => {
    clickedDestination.current = null;
    handleScroll();
  });
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      scrollToHashSection();
      handleScroll();
    }, 100);
    return () => {
      clearTimeout(initialTimeout);
    };
  }, [
    targetRef,
    selfRef,
    handleScroll,
    dataAttribute,
    scrollTo,
    scrollToHashSection
  ]);
  return (
    <div data-slot='scrollspy' className={className} ref={selfRef} onClick={event => {
      const anchor = event.target.closest(`[data-${dataAttribute}-anchor]`);
      if (anchor && event.currentTarget.contains(anchor)) scrollTo(anchor)(event);
    }}>
      {children}
    </div>
  );
}
