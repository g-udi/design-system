'use client';

import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Button from '../Button/index.js';
import Icon from '../Icon/index.js';
import { useElementSize } from '../../../hooks/layout/use-element-size.js';
import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { cn } from '../../../utilities/cn/index.js';
import { MapMarker } from './MapMarker.jsx';
import { readView, syncRoutes } from './mapModel.js';

const initialView = { center: [0, 0], zoom: 2 };
const noItems = [];
const defaultLabels = {
  loading: 'Loading map…', unavailable: 'Map unavailable. Try again or use the location list.',
  retry: 'Retry map', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Reset map view'
};

/** MapLibre owns the camera and gestures; applications supply geography and prepared overlays. */
export function Map({
  ref, mapStyle, initialViewState = initialView, markers = noItems, routes = noItems,
  selectedMarkerId, onMarkerClick, onViewStateChange, onLoad, onError,
  label = 'Map', labels: suppliedLabels, interactive = true, controls = true,
  scrollZoom = false, minZoom = 0, maxZoom = 20, children, fallback, className, style
}) {
  const host = useRef(null);
  const engineRef = useRef(null);
  const currentStyle = useRef(mapStyle);
  const restoreFocus = useRef(false);
  const [engine, setEngine] = useState(null);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const latest = useLatestRef({ mapStyle, initialViewState, interactive, scrollZoom, minZoom, maxZoom, routes, onLoad, onError, onViewStateChange });
  const reduced = usePrefersReducedMotion();
  const labels = { ...defaultLabels, ...suppliedLabels };
  const [sizeRef] = useElementSize({ onResize: () => engineRef.current?.map.resize() });

  useImperativeHandle(ref, () => ({
    flyTo: (view) => engineRef.current?.map.flyTo({ ...view, duration: reduced ? 0 : 600 }),
    fitBounds: (bounds, options = {}) => engineRef.current?.map.fitBounds(bounds, { padding: 48, ...options, duration: reduced ? 0 : 600 }),
    reset: () => engineRef.current?.map.flyTo({ ...latest.current.initialViewState, duration: reduced ? 0 : 600 }),
    getViewState: () => engineRef.current ? readView(engineRef.current.map) : null
  }), [latest, reduced]);

  useEffect(() => {
    let cancelled = false;
    let failed = false;
    let notified = false;
    let current;
    setStatus('loading');
    setEngine(null);
    const fail = (error) => {
      if (cancelled) return;
      failed = true;
      setStatus('error');
      latest.current.onError?.(error);
    };
    import('maplibre-gl').then(({ Map: NativeMap, Marker }) => {
      if (cancelled) return;
      try {
        current = new NativeMap({
          container: host.current, style: latest.current.mapStyle,
          ...latest.current.initialViewState, interactive: latest.current.interactive,
          scrollZoom: latest.current.scrollZoom, minZoom: latest.current.minZoom, maxZoom: latest.current.maxZoom, attributionControl: { compact: true },
          dragRotate: false, touchPitch: false, renderWorldCopies: false
        });
        currentStyle.current = latest.current.mapStyle;
        current.touchZoomRotate.disableRotation();
        current.getCanvas().setAttribute('aria-label', `${label}. Use arrow keys to pan and plus or minus to zoom.`);
        if (!latest.current.interactive) current.getCanvas().tabIndex = -1;
        engineRef.current = { map: current, Marker };
        current.on('error', event => fail(event.error));
        current.on('style.load', () => {
          failed = false;
          notified = false;
          syncRoutes(current, latest.current.routes);
          setEngine(engineRef.current);
          setStatus('loading');
        });
        current.on('idle', () => {
          if (cancelled || failed) return;
          setStatus('ready');
          if (!notified) { notified = true; latest.current.onLoad?.(readView(current)); }
        });
        current.on('moveend', () => latest.current.onViewStateChange?.(readView(current)));
      } catch (error) { fail(error); }
    }).catch(fail);
    return () => { cancelled = true; engineRef.current = null; current?.remove(); };
    // The initial camera is deliberately read only on mount/retry. Use the ref for later camera changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  useEffect(() => {
    if (!engine) return;
    for (const handler of ['boxZoom', 'dragPan', 'keyboard', 'doubleClickZoom', 'touchZoomRotate']) engine.map[handler][interactive ? 'enable' : 'disable']();
    engine.map.touchZoomRotate.disableRotation();
    engine.map.scrollZoom[interactive && scrollZoom ? 'enable' : 'disable']();
    engine.map.getCanvas().tabIndex = interactive ? 0 : -1;
    engine.map.setMinZoom(minZoom);
    engine.map.setMaxZoom(maxZoom);
  }, [engine, interactive, scrollZoom, minZoom, maxZoom]);

  useEffect(() => {
    const current = engineRef.current;
    if (!current || currentStyle.current === mapStyle) return;
    restoreFocus.current = Boolean(host.current?.parentElement.querySelector('.ds-map-state')?.contains(document.activeElement));
    currentStyle.current = mapStyle;
    current.map.setStyle(mapStyle, { diff: false });
  }, [engine, mapStyle]);

  useEffect(() => {
    if (engine && (engine.map.getSource('gaudi-routes') || engine.map.isStyleLoaded())) syncRoutes(engine.map, routes);
  }, [engine, routes]);
  useEffect(() => {
    engine?.map.getCanvas().setAttribute('aria-label', `${label}. Use arrow keys to pan and plus or minus to zoom.`);
  }, [engine, label]);
  useEffect(() => {
    if (status === 'ready' && engine && restoreFocus.current) {
      restoreFocus.current = false;
      engine.map.getCanvas().focus({ preventScroll: true });
    }
  }, [engine, status]);

  const move = direction => engine.map.zoomTo(engine.map.getZoom() + direction, { duration: reduced ? 0 : 200 });
  return (
    <section ref={sizeRef} className={cn('ds-map', className)} style={style} aria-label={label} data-map-status={status}>
      <div ref={host} className='ds-map-canvas' inert={status !== 'ready'} />
      {engine && status === 'ready' && <>
        {markers.map(item => <MapMarker key={item.id} engine={engine} item={item} selected={selectedMarkerId === item.id} onSelect={onMarkerClick} />)}
        {controls && interactive && <div className='ds-map-controls' role='group' aria-label='Map controls'>
          <Button type='button' size='icon' variant='outline' tone='neutral' aria-label={labels.reset} onClick={() => engine.map.flyTo({ ...latest.current.initialViewState, duration: reduced ? 0 : 600 })}><Icon name='LocateFixed' size='sm' /></Button>
          <Button type='button' size='icon' variant='outline' tone='neutral' aria-label={labels.zoomIn} onClick={() => move(1)}><Icon name='Plus' size='sm' /></Button>
          <Button type='button' size='icon' variant='outline' tone='neutral' aria-label={labels.zoomOut} onClick={() => move(-1)}><Icon name='Minus' size='sm' /></Button>
        </div>}
        {children && <div className='ds-map-overlay'>{children}</div>}
      </>}
      {status !== 'ready' && <div className='ds-map-state'>
        <p role='status'>{status === 'loading' ? labels.loading : labels.unavailable}</p>
        {status === 'error' && <>{fallback || <div className='ds-map-fallback-list'>{markers.map(item => <Button key={item.id} type='button' variant='outline' tone='neutral' aria-pressed={selectedMarkerId === item.id} onClick={() => onMarkerClick?.(item.id)}>{item.label}</Button>)}</div>}<Button type='button' variant='outline' tone='neutral' onClick={() => { restoreFocus.current = true; setAttempt(value => value + 1); }}>{labels.retry}</Button></>}
      </div>}
    </section>
  );
}
