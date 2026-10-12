'use client';
import { useCallback, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';

// Position within the actual scrolling viewport, independent of the section's offset parent.
const sectionTop = (section, viewport) => viewport === window || viewport === document.documentElement
  ? section.getBoundingClientRect().top + window.scrollY
  : section.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop - viewport.clientTop;
export function Scrollspy({
  children,
  targetRef,
  onUpdate,
  className,
  offset = 0,
  smooth = true,
  dataAttribute = 'scrollspy',
  history = false
}) {
  const reduceMotion = usePrefersReducedMotion();
  const selfRef = useRef(null);
  const prevIdTracker = useRef(null);
  const setActiveSection = useCallback(
    (sectionId, force = false) => {
      if (!sectionId) return;
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
      if (history && (force || prevIdTracker.current !== sectionId)) {
        window.history.replaceState(window.history.state, '', `#${sectionId}`);
      }
      prevIdTracker.current = sectionId;
    },
    [dataAttribute, history, onUpdate]
  );
  const handleScroll = useCallback(() => {
    const anchors = selfRef.current?.querySelectorAll(`[data-${dataAttribute}-anchor]`);
    if (!anchors?.length) return;
    let scrollElement =
      targetRef?.current === document
        ? document.documentElement
        : targetRef?.current;
    if (!scrollElement) return;
    const viewport = scrollElement.querySelector(
      '[data-slot="scroll-area-viewport"]'
    );
    if (viewport instanceof HTMLElement) {
      scrollElement = viewport;
    }
    const scrollTop =
      scrollElement === document.documentElement
        ? window.scrollY || document.documentElement.scrollTop
        : scrollElement.scrollTop;
    let activeIdx = 0;
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
        top <= scrollTop &&
        delta < minDelta
      ) {
        minDelta = delta;
        activeIdx = idx;
      }
    });
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight - 2) {
      activeIdx = anchors.length - 1;
    }
    const activeAnchor = anchors[activeIdx];
    const sectionId =
      activeAnchor?.getAttribute(`data-${dataAttribute}-anchor`) || null;
    setActiveSection(sectionId);
  }, [targetRef, dataAttribute, offset, setActiveSection]);
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
      let scrollToElement =
        targetRef?.current === document ? window : targetRef?.current;
      if (scrollToElement instanceof HTMLElement) {
        const viewport = scrollToElement.querySelector(
          '[data-slot="scroll-area-viewport"]'
        );
        if (viewport instanceof HTMLElement) {
          scrollToElement = viewport;
        }
      }
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
  useEffect(() => {
    const onScroll = (event) => {
      const scrollElement =
        targetRef?.current === document ? window : targetRef?.current;
      if (!scrollElement) return;
      if (
        scrollElement === window ||
        (scrollElement instanceof HTMLElement &&
          scrollElement.contains(event.target))
      ) {
        handleScroll();
      }
    };
    window.addEventListener('scroll', onScroll, true);
    const initialTimeout = setTimeout(() => {
      scrollToHashSection();
      handleScroll();
    }, 100);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
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
