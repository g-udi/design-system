'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

/**
 * The `execCommand` fallback for local HTTP and embedded contexts without the Clipboard API. It
 * restores the reader's focus and text selection afterwards, unless a copy handler moved focus.
 */
function copyWithSelection(text) {
  const focused = document.activeElement;
  const field = focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement ? focused : null;
  const fieldSelection = field?.selectionStart != null && field.selectionEnd != null
    ? { start: field.selectionStart, end: field.selectionEnd, direction: field.selectionDirection }
    : null;
  const selection = document.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : [];
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('aria-hidden', 'true');
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.insetInlineStart = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    const restoreFocus = document.activeElement === textarea;
    textarea.remove();
    if (restoreFocus && focused instanceof HTMLElement && focused.isConnected) {
      focused.focus({ preventScroll: true });
      if (field && fieldSelection) field.setSelectionRange(fieldSelection.start, fieldSelection.end, fieldSelection.direction ?? undefined);
      else if (selection) {
        selection.removeAllRanges();
        ranges.forEach((range) => selection.addRange(range));
      }
    }
  }
}

/**
 * Write `text` to the clipboard. Resolves `true` on success. Uses the async Clipboard API and falls
 * back to a hidden textarea; resolves `false` during server rendering or when both are blocked.
 */
export async function writeToClipboard(text, { isCurrent = () => true } = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or insecure context: try the selection fallback below.
  }
  if (!isCurrent()) return false;
  return copyWithSelection(text);
}

/**
 * Copy text with a temporary "copied" state for button feedback. `copy(text)` resolves to whether
 * the write worked; `isCopied` and `copiedText` reset after `timeout` ms (0 keeps them). Accepts
 * the options object or, for brevity, the timeout as a number.
 *
 * @param {number | { timeout?: number, onCopy?: (text: string) => void, onError?: (text: string) => void }} [options]
 */
export function useCopyToClipboard(options = {}) {
  const { timeout = 2000, onCopy, onError } = typeof options === 'number' ? { timeout: options } : options;
  const [ copiedText, setCopiedText ] = useState(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(false);
  const requestRef = useRef(0);
  const callbacks = useLatestRef({ onCopy, onError });

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const reset = useCallback(() => {
    requestRef.current += 1;
    clearTimer();
    setCopiedText(null);
  }, [ clearTimer ]);

  const copy = useCallback(async (text) => {
    if (!mountedRef.current || text == null || text === '') return false;
    const value = String(text);
    const request = ++requestRef.current;
    const isCurrent = () => mountedRef.current && requestRef.current === request;
    const copied = await writeToClipboard(value, { isCurrent });
    if (!isCurrent()) return copied;

    clearTimer();
    setCopiedText(copied ? value : null);
    if (copied) {
      callbacks.current.onCopy?.(value);
      if (timeout) timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setCopiedText(null);
      }, timeout);
    } else {
      callbacks.current.onError?.(value);
    }
    return copied;
  }, [ callbacks, clearTimer, timeout ]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
      clearTimer();
    };
  }, [ clearTimer ]);

  return { copy, copyToClipboard: copy, copiedText, isCopied: copiedText !== null, reset };
}
