'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';
import { writeToClipboard } from './clipboard-model.js';

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
