'use client';

/**
 * Citation Popover Component
 *
 * @description Displays a popover preview of citations when hovering over citation numbers.
 * Works with data attributes added by the rehype-simple-citations plugin.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

import { useEffect, useRef, useState } from 'react';

import LatexText from '../LatexText';
import Link from '../../core/Link';
import { PopoverAnchor, PopoverContentPrimitive, PopoverPrimitive } from '../../core/Popover';

import { findBackLink as getBackLink, readCitationKeys as readJsonArray, registerPopoverClickHandler, setStoredCitation } from '../citations';

import styles from './CitationPopover.module.css';

const CITATION_TRIGGER_SELECTOR = '[data-citation-popover="true"]';

const normalizeCitationValue = (value, fallback = '') => {
  if (value === null || typeof value === 'undefined') return fallback;

  const normalized = String(value).trim();

  return normalized || fallback;
};

/**
 * Ensure grouped citations render one marker per citation number, and mark
 * every trigger as bound so consumers can detect the popover is active.
 * Idempotent, so it is safe to re-run from the MutationObserver.
 */
const prepareCitationTriggers = () => {
  const citationGroups = document.querySelectorAll(`a.citation-link.citation-group${CITATION_TRIGGER_SELECTOR}`);

  citationGroups.forEach((citationGroup) => {
    if (citationGroup.querySelector('[data-citation-marker-number]')) return;

    const numbers = readJsonArray(citationGroup.dataset.citationNumbers);

    if (!numbers.length) return;

    citationGroup.textContent = '';
    numbers.forEach((number) => {
      const marker = document.createElement('span');

      marker.dataset.citationMarkerNumber = 'true';
      marker.textContent = String(number);
      citationGroup.appendChild(marker);
    });
  });

  document.querySelectorAll(CITATION_TRIGGER_SELECTOR).forEach((trigger) => {
    trigger.dataset.citationPopoverBound = 'true';
  });
};

/**
 * Parse citation content for popover display
 */
const parseCitationContent = (citationTexts, citationNumbers, citationKeys, citationText) => {
  const fallbackContent = citationText || 'Citation not found';

  if (!citationTexts || !citationNumbers || !citationKeys)
    return { 'content': fallbackContent, 'type': 'text' };

  try {
    const texts = readJsonArray(citationTexts);
    const numbers = readJsonArray(citationNumbers);
    const keys = readJsonArray(citationKeys);

    if (texts.length === 0)
      return { 'content': fallbackContent, 'type': 'text' };

    if (texts.length === 1)
      return { 'content': normalizeCitationValue(texts[0], fallbackContent), 'type': 'single' };

    return {
      'items': texts.map((text, index) => ({
        'key': normalizeCitationValue(keys[index], null),
        'number': normalizeCitationValue(numbers[index], index + 1),
        'text': normalizeCitationValue(text, fallbackContent)
      })),
      'type': 'multiple'
    };
  } catch {
    return { 'content': citationText || 'Citation parsing error', 'type': 'text' };
  }
};


/**
 * Update back-link for a citation and make it visible
 */
const updateCitationBackLink = (citationKey, originCitationId) => {
  const backLink = getBackLink(citationKey);

  if (!backLink) return;

  // Point the back-link at the specific clicked instance and reveal it
  backLink.href = `#${originCitationId}`;
  backLink.style.display = 'inline-block';
  backLink.setAttribute('data-recently-clicked', 'true');

  if (typeof window !== 'undefined')
    setStoredCitation(citationKey, originCitationId);
};

/**
 * Hide back-link after it's been used
 */
const hideBackLink = (backLink) => {
  if (backLink.isConnected) {
    backLink.style.display = 'none';
    backLink.removeAttribute('data-recently-clicked');
  }
};

/**
 * Component that adds popover functionality to citation references.
 *
 * All interaction is handled through document-level delegated listeners
 * registered once on mount; mutable interaction state lives in refs so the
 * effect never needs to re-run.
 */
const CitationPopover = () => {
  const [ popover, setPopover ] = useState(null);
  const popoverRef = useRef(null);
  const popoverStateRef = useRef(null);
  const activeTriggerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Mirror state into a ref so the once-bound handlers always see fresh data
  useEffect(() => {
    popoverStateRef.current = popover;
  }, [ popover ]);

  useEffect(() => {
    const backLinkTimers = new Map();
    const clearBackLinkTimer = (backLink) => {
      window.clearTimeout(backLinkTimers.get(backLink));
      backLinkTimers.delete(backLink);
    };
    const clearCloseTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const closePopover = () => {
      clearCloseTimeout();
      activeTriggerRef.current?.setAttribute('aria-expanded', 'false');
      activeTriggerRef.current = null;
      setPopover(null);
    };

    const scheduleClose = (delay) => {
      clearCloseTimeout();
      timeoutRef.current = setTimeout(() => {
        if (!activeTriggerRef.current?.contains(document.activeElement) && !popoverRef.current?.contains(document.activeElement)) closePopover();
      }, delay);
    };

    const openPopoverFor = (target) => {
      clearCloseTimeout();

      const { citationText, citationTexts, citationNumbers, citationKeys } = target.dataset;
      const parsedContent = parseCitationContent(citationTexts, citationNumbers, citationKeys, citationText);

      if (!parsedContent) return;

      if (activeTriggerRef.current && activeTriggerRef.current !== target)
        activeTriggerRef.current.setAttribute('aria-expanded', 'false');

      target.setAttribute('aria-expanded', 'true');
      activeTriggerRef.current = target;

      setPopover({
        'content': parsedContent,
        'number': target.textContent?.trim() || undefined,
        'originCitationId': target.id
      });
    };

    const isInsidePopover = (node) => Boolean(node && popoverRef.current?.contains(node));

    const handlePointerOver = (event) => {
      const trigger = event.target.closest?.(CITATION_TRIGGER_SELECTOR);

      if (trigger) {
        openPopoverFor(trigger);

        return;
      }

      // Moving onto the popover itself cancels any pending close
      if (isInsidePopover(event.target)) clearCloseTimeout();
    };

    const handlePointerOut = (event) => {
      const trigger = event.target.closest?.(CITATION_TRIGGER_SELECTOR);

      if (!trigger && !isInsidePopover(event.target)) return;

      const related = event.relatedTarget;

      // Ignore moves within the trigger, into the popover, or onto another trigger
      if (related && (trigger?.contains(related) || isInsidePopover(related) || related.closest?.(CITATION_TRIGGER_SELECTOR))) return;

      scheduleClose(trigger ? 300 : 150);
    };

    const handleFocusIn = (event) => {
      const trigger = event.target.closest?.(CITATION_TRIGGER_SELECTOR);

      if (trigger) openPopoverFor(trigger);
    };

    const handleFocusOut = (event) => {
      const trigger = event.target.closest?.(CITATION_TRIGGER_SELECTOR);

      if (trigger || isInsidePopover(event.target)) scheduleClose(300);
    };

    const handleClick = (event) => {

      // 1. Clicks on a row inside a multi-citation popover
      const citationItem = event.target.closest?.('[data-citation-popover-item="multiple"]');

      if (citationItem) {
        const { citationKey } = citationItem.dataset;

        if (!citationKey) return;

        event.preventDefault();

        // Update the back-link ONLY for the specific citation that was clicked
        const originCitationId = popoverStateRef.current?.originCitationId;

        if (originCitationId) updateCitationBackLink(citationKey, originCitationId);

        const targetElement = document.getElementById(`citation-${citationKey}`);

        if (targetElement) {
          targetElement.scrollIntoView({ 'block': 'center' });
          // The selected link disappears with the popover; continue at the bibliography.
          (getBackLink(citationKey) || activeTriggerRef.current)?.focus({ preventScroll: true });
          closePopover();
        }

        return;
      }

      // 2. Clicks on citation numbers in the text
      const citationLink = event.target.closest?.('a.citation-link');

      if (citationLink) {
        // A fresh citation visit keeps its newly revealed back-link visible.
        backLinkTimers.forEach((timer) => window.clearTimeout(timer));
        backLinkTimers.clear();
        const href = citationLink.getAttribute('href');
        const citationKeys = citationLink.getAttribute('data-citation-keys');

        if (citationKeys) {
          const keys = readJsonArray(citationKeys);
          const originId = citationLink.id || citationLink.getAttribute('id');

          if (keys.length > 0 && originId) {
            keys.forEach((key) => updateCitationBackLink(key, originId));

            if (href?.startsWith('#citation-group-')) {
              event.preventDefault();
              document.getElementById(`citation-${keys[0]}`)?.scrollIntoView({ 'block': 'center' });
            }
          }
        } else if (href && href.startsWith('#citation-')) {
          const citationKey = href.replace('#citation-', '').replace(/^group-\d+-/, '');
          const originId = citationLink.id || citationLink.getAttribute('id');

          if (citationKey && originId) updateCitationBackLink(citationKey, originId);
        }

        return;
      }

      // 3. Clicks on bibliography back-links hide them after navigation
      const backLink = event.target.closest?.('a.citation-back-link');

      if (backLink) {
        clearBackLinkTimer(backLink);
        const timer = window.setTimeout(() => {
          backLinkTimers.delete(backLink);
          hideBackLink(backLink);
        }, 100);
        backLinkTimers.set(backLink, timer);
      }
    };

    prepareCitationTriggers();

    const bindTimer = window.setTimeout(prepareCitationTriggers, 0);

    // Catch late-hydrated citation markup; prepareCitationTriggers is idempotent
    const observer = new MutationObserver(prepareCitationTriggers);

    if (document.body)
      observer.observe(document.body, { 'childList': true, 'subtree': true });

    document.addEventListener('pointerover', handlePointerOver, true);
    document.addEventListener('pointerout', handlePointerOut, true);
    document.addEventListener('focusin', handleFocusIn, true);
    document.addEventListener('focusout', handleFocusOut, true);
    document.addEventListener('click', handleClick, true);

    // Tell the globally-mounted CitationTracker to stand down while this handler is live
    const unregisterClickHandler = registerPopoverClickHandler();

    return () => {
      window.clearTimeout(bindTimer);
      backLinkTimers.forEach((timer) => window.clearTimeout(timer));
      backLinkTimers.clear();
      observer.disconnect();
      unregisterClickHandler();

      document.removeEventListener('pointerover', handlePointerOver, true);
      document.removeEventListener('pointerout', handlePointerOut, true);
      document.removeEventListener('focusin', handleFocusIn, true);
      document.removeEventListener('focusout', handleFocusOut, true);
      document.removeEventListener('click', handleClick, true);

      clearCloseTimeout();

      document.querySelectorAll(CITATION_TRIGGER_SELECTOR).forEach((trigger) => {
        delete trigger.dataset.citationPopoverBound;
        trigger.removeAttribute('aria-expanded');
      });
    };
  }, []);

  return (
    <PopoverPrimitive open={ Boolean(popover) } onOpenChange={ (open) => {
      if (!open) {
        clearTimeout(timeoutRef.current);
        activeTriggerRef.current?.setAttribute('aria-expanded', 'false');
        activeTriggerRef.current = null;
        setPopover(null);
      }
    } }>
      <PopoverAnchor virtualRef={ activeTriggerRef } />
      {popover ? (
        <PopoverContentPrimitive
          ref={ popoverRef }
          data-gaudi-citation-popover-root='true'
          aria-label='Citation details'
          side='bottom'
          sideOffset={ 8 }
          collisionPadding={ 12 }
          className='w-[26.25rem] max-w-[calc(100vw-1.5rem)] max-h-(--radix-popover-content-available-height) overflow-y-auto wrap-anywhere'
          onOpenAutoFocus={ (event) => event.preventDefault() }
          onCloseAutoFocus={ (event) => event.preventDefault() }
          onEscapeKeyDown={ () => {
            if (popoverRef.current?.contains(document.activeElement)) activeTriggerRef.current?.focus({ preventScroll: true });
            clearTimeout(timeoutRef.current);
          } }
          onInteractOutside={ (event) => {
            if (event.target.closest?.(CITATION_TRIGGER_SELECTOR)) event.preventDefault();
          } }
          onFocusCapture={ () => clearTimeout(timeoutRef.current) }
        >
            <div className={ styles.body }>
              {popover.content.type === 'single' && (
                <div className={ styles.item }>
                  <LatexText>{popover.content.content}</LatexText>
                </div>
              )}

              {popover.content.type === 'multiple' && (
                popover.content.items.map((item, index) => {
                  const isInteractive = Boolean(item.key);
                  return (
                    <div
                      key={ `${item.key || item.number}-${index}` }
                      className={ `${styles.item} ${styles.entry}` }
                    >
                      {isInteractive ? (
                        <Link
                          href={ `#citation-${item.key}` }
                          variant='bare'
                          className={ styles.number }
                          aria-label={ `${item.number} ${item.text.replace(/<[^>]+>/g, '')}` }
                          data-citation-key={ item.key }
                          data-citation-popover-item='multiple'
                        >{item.number}</Link>
                      ) : <span className={ styles.number }>{item.number}</span>}
                      <div className={ styles.citationContent }>
                        <LatexText>{item.text}</LatexText>
                      </div>
                    </div>
                  );
                })
              )}

              {popover.content.type === 'text' && (
                <LatexText>{popover.content.content}</LatexText>
              )}
            </div>
        </PopoverContentPrimitive>
      ) : null}
    </PopoverPrimitive>
  );
};

export default CitationPopover;
