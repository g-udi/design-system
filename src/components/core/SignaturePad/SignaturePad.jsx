'use client';
import { useState, useRef, useImperativeHandle, useCallback } from 'react';
import { useIsomorphicLayoutEffect as useIsoLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { cn } from '../../../utilities/cn/index.js';
import {
  SignaturePadContext,
  SignaturePadConfigContext,
} from './signaturePadContext.js';
import {
  sameStrokes,
  getSignaturePadBounds,
  signaturePadToSVG,
  signaturePadToDataURL,
  signaturePadToBlob,
  serializeSignaturePad,
  signaturePadLabels,
} from './signaturePadModel.js';

const API_KEYS = [
  'strokes',
  'isEmpty',
  'isDrawing',
  'canUndo',
  'canRedo',
  'disabled',
  'readOnly',
  'clear',
  'undo',
  'redo',
  'focus',
  'toSVG',
  'toDataURL',
  'toBlob',
  'serialize',
];

const HISTORY_LIMIT = 100;

function SignaturePad({
  value,
  defaultValue,
  onValueChange,
  onStrokeStart,
  onStrokeEnd,
  apiRef,
  color,
  minWidth = 0.8,
  maxWidth = 3.2,
  smoothing = 0.5,
  sizing = 'auto',
  pointerTypes,
  disabled = false,
  readOnly = false,
  name,
  form,
  required = false,
  format = 'svg',
  invalid = false,
  labels: labelOverrides,
  className,
  children,
  ...props
}) {
  const [strokes, updateStrokes] = useControllableState({
    value,
    defaultValue: () => defaultValue ?? [],
    onChange: onValueChange,
  });
  const [initialValue] = useState(() => defaultValue ?? []);
  const [history, setHistory] = useState(() => ({
    past: [],
    future: [],
    present: strokes,
  }));
  const pendingHistory = useRef(null);
  const [isDrawing, setDrawing] = useState(false);
  const areaRef = useRef(null);
  const setArea = useCallback((node) => {
    areaRef.current = node;
  }, []);
  const labels = { ...signaturePadLabels, ...labelOverrides };
  // Only accept history when the host accepts the proposed value. Refused
  // controlled changes must leave the current undo/redo stack intact.
  const activeHistory =
    pendingHistory.current &&
    sameStrokes(pendingHistory.current.present, strokes)
      ? pendingHistory.current
      : sameStrokes(history.present, strokes)
        ? history
        : { past: [], future: [], present: strokes };
  const { past, future } = activeHistory;
  useIsoLayoutEffect(() => {
    if (activeHistory !== history) {
      setHistory(activeHistory);
      pendingHistory.current = null;
    }
  }, [activeHistory, history]);
  const setStrokes = (next, nextHistory) => {
    pendingHistory.current = nextHistory;
    updateStrokes(next);
  };
  const commit = (next) =>
    setStrokes(next, {
      past: [...past, strokes].slice(-HISTORY_LIMIT),
      future: [],
      present: next,
    });
  const withAreaFrame = (options = {}) => {
    const area = areaRef.current;
    if (options.crop !== false || !area) return options;
    const frame = area.querySelector('[data-slot="signature-pad-canvas"]')
      ?.viewBox.baseVal;
    return {
      ...options,
      width: options.width ?? (frame?.width || area.clientWidth),
      height: options.height ?? (frame?.height || area.clientHeight),
    };
  };
  const api = {
    strokes,
    isEmpty: getSignaturePadBounds(strokes) === null,
    isDrawing,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    disabled,
    readOnly,
    clear: () => {
      if (!disabled && !readOnly && !isDrawing && strokes.length > 0)
        commit([]);
    },
    undo: () => {
      const previous = past[past.length - 1];
      if (!previous || disabled || readOnly || isDrawing) return;
      setStrokes(previous, {
        past: past.slice(0, -1),
        future: [strokes, ...future],
        present: previous,
      });
    },
    redo: () => {
      const next = future[0];
      if (!next || disabled || readOnly || isDrawing) return;
      setStrokes(next, {
        past: [...past, strokes],
        future: future.slice(1),
        present: next,
      });
    },
    focus: () => areaRef.current?.focus({ preventScroll: true }),
    toSVG: (options) => signaturePadToSVG(strokes, withAreaFrame(options)),
    toDataURL: (options) =>
      signaturePadToDataURL(strokes, withAreaFrame(options)),
    toBlob: (options) => signaturePadToBlob(strokes, withAreaFrame(options)),
    serialize: (exportFormat, options) =>
      serializeSignaturePad(strokes, exportFormat, withAreaFrame(options)),
  };
  const latestApi = useRef(null);
  const handleRef = useRef(null);
  useIsoLayoutEffect(() => {
    latestApi.current = api;
  });
  useImperativeHandle(apiRef, () => {
    const key = [strokes, history, isDrawing, disabled, readOnly];
    const cached = handleRef.current;
    if (cached && cached.key.every((item, i) => Object.is(item, key[i]))) {
      return cached.handle;
    }
    const handle = {};
    for (const key of API_KEYS) {
      Object.defineProperty(handle, key, {
        enumerable: true,
        get: () => latestApi.current[key],
      });
    }
    handleRef.current = { key, handle };
    return handle;
  }, [strokes, history, isDrawing, disabled, readOnly]);
  const config = {
    color,
    minWidth: Math.max(0.1, Number.isFinite(minWidth) ? minWidth : 0.8),
    maxWidth: Math.max(
      0.1,
      Number.isFinite(minWidth) ? minWidth : 0.8,
      Number.isFinite(maxWidth) ? maxWidth : 3.2,
    ),
    smoothing: Math.min(
      Math.max(Number.isFinite(smoothing) ? smoothing : 0.5, 0),
      1,
    ),
    sizing,
    pointerTypes,
    name,
    form,
    required,
    invalid,
    labels,
    format,
    interactive: !disabled && !readOnly,
    undoDepth: past.length,
    redoDepth: future.length,
    setArea,
    setDrawing,
    commitStroke: (stroke) => {
      if (disabled || readOnly) return;
      commit([...strokes, stroke]);
      onStrokeEnd?.(stroke);
    },
    resetToDefault: () => {
      setDrawing(false);
      pendingHistory.current = null;
      setHistory({ past: [], future: [], present: initialValue });
      if (!sameStrokes(strokes, initialValue)) updateStrokes(initialValue);
    },
    onStrokeStart,
  };
  return (
    <SignaturePadContext.Provider value={api}>
      <SignaturePadConfigContext.Provider value={config}>
        <div
          data-slot="signature-pad"
          data-empty={api.isEmpty || undefined}
          data-drawing={isDrawing || undefined}
          data-disabled={disabled || undefined}
          data-readonly={readOnly || undefined}
          className={cn('ds-signature-pad', className)}
          {...props}
        >
          {children}
        </div>
      </SignaturePadConfigContext.Provider>
    </SignaturePadContext.Provider>
  );
}

export { SignaturePad };
