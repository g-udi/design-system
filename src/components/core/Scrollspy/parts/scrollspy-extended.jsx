// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useCallback, useEffect, useRef } from 'react';
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
  const selfRef = useRef(null);
  const anchorElementsRef = useRef(null);
  const prevIdTracker = useRef(null);
  const setActiveSection = useCallback(
    (sectionId, force = false) => {
      if (!sectionId) return;
      anchorElementsRef.current?.forEach((item) => {
        const id = item.getAttribute(`data-${dataAttribute}-anchor`);
        if (id === sectionId) {
          item.setAttribute('data-active', 'true');
        } else {
          item.removeAttribute('data-active');
        }
      });
      if (onUpdate) onUpdate(sectionId);
      if (history && (force || prevIdTracker.current !== sectionId)) {
        window.history.replaceState({}, '', `#${sectionId}`);
      }
      prevIdTracker.current = sectionId;
    },
    [anchorElementsRef, dataAttribute, history, onUpdate]
  );
  const handleScroll = useCallback(() => {
    if (!anchorElementsRef.current || anchorElementsRef.current.length === 0)
      return;
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
    anchorElementsRef.current.forEach((anchor, idx) => {
      const sectionId2 = anchor.getAttribute(`data-${dataAttribute}-anchor`);
      const sectionElement = document.getElementById(sectionId2);
      if (!sectionElement) return;
      let customOffset = offset;
      const dataOffset = anchor.getAttribute(`data-${dataAttribute}-offset`);
      if (dataOffset) customOffset = parseInt(dataOffset, 10);
      const delta = Math.abs(
        sectionElement.offsetTop - customOffset - scrollTop
      );
      if (
        sectionElement.offsetTop - customOffset <= scrollTop &&
        delta < minDelta
      ) {
        minDelta = delta;
        activeIdx = idx;
      }
    });
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight - 2) {
      activeIdx = anchorElementsRef.current.length - 1;
    }
    const activeAnchor = anchorElementsRef.current[activeIdx];
    const sectionId =
      activeAnchor?.getAttribute(`data-${dataAttribute}-anchor`) || null;
    setActiveSection(sectionId);
  }, [anchorElementsRef, targetRef, dataAttribute, offset, setActiveSection]);
  const scrollTo = useCallback(
    (anchorElement) => (event) => {
      if (event) event.preventDefault();
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
      const scrollTop = sectionElement.offsetTop - customOffset;
      if (scrollToElement && 'scrollTo' in scrollToElement) {
        scrollToElement.scrollTo({
          top: scrollTop,
          left: 0,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
      setActiveSection(sectionId, true);
    },
    [dataAttribute, offset, smooth, targetRef, setActiveSection]
  );
  const scrollToHashSection = useCallback(() => {
    const hash = CSS.escape(window.location.hash.replace('#', ''));
    if (hash) {
      const targetElement = document.querySelector(
        `[data-${dataAttribute}-anchor="${hash}"]`
      );
      if (targetElement) {
        scrollTo(targetElement)();
      }
    }
  }, [dataAttribute, scrollTo]);
  useEffect(() => {
    if (selfRef.current) {
      anchorElementsRef.current = Array.from(
        selfRef.current.querySelectorAll(`[data-${dataAttribute}-anchor]`)
      );
    }
    const clickHandlers = (anchorElementsRef.current ?? []).map((item) => [item, scrollTo(item)]);
    clickHandlers.forEach(([item, handler]) => item.addEventListener('click', handler));
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
      clickHandlers.forEach(([item, handler]) => item.removeEventListener('click', handler));
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
    <div data-slot='scrollspy' className={className} ref={selfRef}>
      {children}
    </div>
  );
}
