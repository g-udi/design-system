'use client';
import { memo, useEffect, useId, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import { useElementSize } from '../../../hooks/layout/use-element-size.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { isTextEntryTarget } from '../../../hooks/shared/dom.js';
import { cn } from '../../../utilities/cn/index.js';
import {
  useSignaturePad,
  useSignaturePadConfig,
} from './signaturePadContext.js';
import {
  round,
  sameStrokes,
  getSignaturePadBounds,
  getSignaturePadStrokePath,
  serializeSignaturePad,
} from './signaturePadModel.js';

const StrokePath = memo(function StrokePath({ stroke }) {
  return (
    <path
      data-slot="signature-pad-stroke"
      d={getSignaturePadStrokePath(stroke)}
      fill={stroke.color ?? 'currentColor'}
    />
  );
});

function SignaturePadArea({
  ref,
  variant = 'default',
  className,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onKeyDown,
  onContextMenu,
  'aria-describedby': describedBy,
  ...props
}) {
  const api = useSignaturePad();
  const config = useSignaturePadConfig('SignaturePadArea');
  const liveRef = useRef(null);
  const pathRef = useRef(null);
  const inputRef = useRef(null);
  const formValueRef = useRef(null);
  const frameRef = useRef(0);
  const resetRef = useLatestRef(config.resetToDefault);
  const areaRef = useRef(null);
  const [measureArea, size] = useElementSize();
  const areaRefCallback = useMergedRefs(
    ref,
    areaRef,
    config.setArea,
    measureArea,
  );
  const width = areaRef.current?.clientWidth || size.width;
  const height = areaRef.current?.clientHeight || size.height;
  const bounds = getSignaturePadBounds(api.strokes);
  // Preserve the signature's proportions when its container shrinks. Stored
  // points stay unchanged; new pointer samples use the same SVG coordinate space.
  const scale =
    width && height && bounds
      ? Math.max(
          1,
          (bounds.x + bounds.width + 4) / width,
          (bounds.y + bounds.height + 4) / height,
        )
      : 1;
  useIsomorphicLayoutEffect(() => {
    const live = liveRef.current;
    if (
      live &&
      (!config.interactive ||
        !api.isDrawing ||
        !sameStrokes(live.value, api.strokes) ||
        live.width !== width ||
        live.height !== height ||
        (config.pointerTypes &&
          !config.pointerTypes.includes(live.pointerType)))
    ) {
      finish(live.pointerId, false);
    }
  });
  useIsomorphicLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const cached = formValueRef.current;
    if (
      !cached ||
      cached.strokes !== api.strokes ||
      cached.format !== config.format
    ) {
      formValueRef.current = {
        strokes: api.strokes,
        format: config.format,
        value: serializeSignaturePad(api.strokes, config.format),
      };
    }
    // Native reset also changes the DOM field when the default strokes are
    // unchanged. Restore the accepted value without rasterizing it again.
    input.value = formValueRef.current.value;
  });
  useEffect(() => {
    const root = inputRef.current?.getRootNode();
    if (!root) return;
    let pending = 0;
    const onReset = (event) => {
      if (event.target !== inputRef.current?.form) return;
      window.clearTimeout(pending);
      pending = window.setTimeout(() => {
        if (!event.defaultPrevented) resetRef.current();
      });
    };
    root.addEventListener('reset', onReset, true);
    return () => {
      root.removeEventListener('reset', onReset, true);
      window.clearTimeout(pending);
    };
  }, [config.name, resetRef]);
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);
  const paint = () => {
    frameRef.current = 0;
    const live = liveRef.current;
    pathRef.current?.setAttribute(
      'd',
      live ? getSignaturePadStrokePath({ points: live.points }) : '',
    );
  };
  const schedulePaint = () => {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
  };
  const addSample = (live, clientX, clientY, pressure, time) => {
    const x = Math.max(
      0,
      Math.min(live.width * live.zoom, (clientX - live.left) * live.scaleX),
    );
    const y = Math.max(
      0,
      Math.min(live.height * live.zoom, (clientY - live.top) * live.scaleY),
    );
    live.rawX = x;
    live.rawY = y;
    const { sizing, smoothing } = config;
    const minWidth = config.minWidth * live.zoom;
    const maxWidth = config.maxWidth * live.zoom;
    const usePressure =
      sizing === 'pressure' ||
      (sizing === 'auto' && live.pointerType === 'pen');
    const pressed =
      minWidth + (maxWidth - minWidth) * Math.max(0, Math.min(pressure, 1));
    const previous = live.points[live.points.length - 1];
    if (!previous) {
      live.size = usePressure
        ? pressed
        : minWidth + (maxWidth - minWidth) * 0.8;
      live.time = time;
      live.points.push([round(x), round(y), round(live.size)]);
      return;
    }
    const follow = 1 - smoothing * 0.85;
    const sx = previous[0] + (x - previous[0]) * follow;
    const sy = previous[1] + (y - previous[1]) * follow;
    const distance = Math.hypot(sx - previous[0], sy - previous[1]);
    if (distance < 0.75) return;
    const speed = distance / Math.max(time - live.time, 1);
    live.velocity = live.velocity * 0.3 + speed * 0.7;
    live.time = time;
    const target = usePressure
      ? pressed
      : Math.max(maxWidth / (live.velocity + 1), minWidth);
    live.size += (target - live.size) * 0.35;
    live.points.push([round(sx), round(sy), round(live.size)]);
  };
  const finish = (pointerId, commit = true) => {
    const live = liveRef.current;
    if (!live || live.pointerId !== pointerId) return;
    liveRef.current = null;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    pathRef.current?.setAttribute('d', '');
    config.setDrawing(false);
    const area = areaRef.current;
    if (area?.hasPointerCapture(pointerId))
      area.releasePointerCapture(pointerId);
    if (!commit || !config.interactive) return;
    const last = live.points[live.points.length - 1];
    if (last && Math.hypot(live.rawX - last[0], live.rawY - last[1]) >= 0.5) {
      live.points.push([round(live.rawX), round(live.rawY), round(live.size)]);
    }
    config.commitStroke(
      live.color === undefined
        ? { points: live.points }
        : { points: live.points, color: live.color },
    );
  };
  const handlePointerDown = (event) => {
    onPointerDown?.(event);
    const area = event.currentTarget;
    const pointerType = event.pointerType;
    if (
      event.defaultPrevented ||
      !config.interactive ||
      event.target !== area ||
      !event.isPrimary ||
      (pointerType === 'mouse' && event.button !== 0) ||
      (config.pointerTypes && !config.pointerTypes.includes(pointerType))
    ) {
      return;
    }
    const live = liveRef.current;
    if (live) {
      if (live.pointerType !== 'touch' || pointerType !== 'pen') return;
      finish(live.pointerId, false);
    }
    try {
      area.setPointerCapture(event.pointerId);
    } catch {
      // A pointer that ended before capture can no longer be captured.
    }
    const rect = area.getBoundingClientRect();
    const next = {
      pointerId: event.pointerId,
      pointerType,
      points: [],
      value: api.strokes,
      color: config.color,
      width,
      height,
      zoom: scale,
      /* The ink layer starts inside the border, and a transformed ancestor
         (a zooming dialog) scales the rect but not the coordinate space. */
      left: rect.left + area.clientLeft * (rect.width / area.offsetWidth || 1),
      top: rect.top + area.clientTop * (rect.height / area.offsetHeight || 1),
      scaleX: (rect.width ? area.offsetWidth / rect.width : 1) * scale,
      scaleY: (rect.height ? area.offsetHeight / rect.height : 1) * scale,
      time: event.timeStamp,
      velocity: 0,
      size: 0,
      rawX: 0,
      rawY: 0,
    };
    liveRef.current = next;
    addSample(
      next,
      event.clientX,
      event.clientY,
      event.pressure,
      event.timeStamp,
    );
    schedulePaint();
    config.setDrawing(true);
    config.onStrokeStart?.({ pointerType });
  };
  const handlePointerMove = (event) => {
    onPointerMove?.(event);
    const live = liveRef.current;
    if (
      event.defaultPrevented ||
      !config.interactive ||
      !live ||
      live.pointerId !== event.pointerId
    )
      return;
    const samples = event.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const sample of samples.length ? samples : [event.nativeEvent]) {
      addSample(
        live,
        sample.clientX,
        sample.clientY,
        sample.pressure,
        sample.timeStamp,
      );
    }
    schedulePaint();
  };
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      !config.interactive ||
      event.nativeEvent?.isComposing ||
      isTextEntryTarget(event.target)
    )
      return;
    if (event.key === 'Escape' && liveRef.current) {
      event.preventDefault();
      finish(liveRef.current.pointerId, false);
      return;
    }
    if (api.isDrawing) return;
    if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
    const typed = event.key.toLowerCase();
    const key = /^[a-z]$/.test(typed)
      ? typed
      : event.code.replace(/^Key/, '').toLowerCase();
    const fromControl = event.target !== event.currentTarget;
    if (key === 'z' && !event.shiftKey && api.canUndo) {
      event.preventDefault();
      api.undo();
      if (fromControl) api.focus();
    } else if (
      (key === 'y' || (key === 'z' && event.shiftKey)) &&
      api.canRedo
    ) {
      event.preventDefault();
      api.redo();
      if (fromControl) api.focus();
    }
  };
  const labelled = props['aria-label'] ?? props['aria-labelledby'];
  const statusId = useId();
  return (
    <div
      ref={areaRefCallback}
      role="application"
      aria-roledescription={config.labels.role}
      aria-label={labelled ? undefined : config.labels.area}
      aria-disabled={api.disabled || undefined}
      aria-invalid={config.invalid || undefined}
      aria-describedby={describedBy ? `${describedBy} ${statusId}` : statusId}
      tabIndex={config.interactive ? 0 : -1}
      data-slot="signature-pad-area"
      data-variant={variant}
      data-empty={api.isEmpty || undefined}
      data-drawing={api.isDrawing || undefined}
      data-disabled={api.disabled || undefined}
      data-readonly={api.readOnly || undefined}
      className={cn('ds-signature-pad-area', className)}
      {...props}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (
          !event.defaultPrevented &&
          config.interactive &&
          liveRef.current?.pointerId === event.pointerId
        ) {
          addSample(
            liveRef.current,
            event.clientX,
            event.clientY,
            event.pressure,
            event.timeStamp,
          );
        }
        finish(event.pointerId, !event.defaultPrevented);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        finish(event.pointerId, false);
      }}
      onLostPointerCapture={(event) => {
        onLostPointerCapture?.(event);
        finish(event.pointerId, false);
      }}
      onKeyDown={handleKeyDown}
      onContextMenu={(event) => {
        onContextMenu?.(event);
        if (liveRef.current) event.preventDefault();
      }}
    >
      {children}
      {/* The ink is invisible to assistive tech, so its state is spoken here. */}
      <span id={statusId} className="sr-only">
        {api.isEmpty ? config.labels.empty : config.labels.filled}
        {api.readOnly
          ? `. ${config.labels.readOnly}`
          : `. ${config.labels.instructions}`}
      </span>
      <svg
        data-slot="signature-pad-canvas"
        viewBox={
          width && height ? `0 0 ${width * scale} ${height * scale}` : undefined
        }
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        {api.strokes.map((stroke, index) => (
          <StrokePath key={index} stroke={stroke} />
        ))}
        <path
          ref={pathRef}
          fill={liveRef.current?.color ?? config.color ?? 'currentColor'}
        />
      </svg>
      {config.name && (
        <input
          ref={inputRef}
          type="text"
          name={config.name}
          form={config.form}
          required={config.required}
          disabled={api.disabled}
          defaultValue=""
          tabIndex={-1}
          aria-hidden="true"
          onFocus={() => api.focus()}
          className="pointer-events-none absolute bottom-0 left-1/2 size-px opacity-0"
        />
      )}
    </div>
  );
}

export { SignaturePadArea };
