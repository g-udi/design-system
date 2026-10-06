'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../Button/index.js';
import Icon from '../Icon/index.js';

export function MapMarker({ engine, item, selected, onSelect }) {
  const [element, setElement] = useState(null);
  const markerRef = useRef(null);
  const { map, Marker } = engine;
  const [lng, lat] = item.coordinates;
  useEffect(() => {
    const node = document.createElement('div');
    node.className = 'ds-map-marker-anchor';
    const marker = new Marker({ element: node }).setLngLat([lng, lat]).addTo(map);
    // The React button owns interaction; MapLibre's positioning wrapper is presentational.
    node.removeAttribute('role');
    node.removeAttribute('aria-label');
    node.removeAttribute('tabindex');
    markerRef.current = marker;
    setElement(node);
    return () => { marker.remove(); markerRef.current = null; };
    // Coordinates update the existing marker without replacing its focused button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, Marker]);
  useEffect(() => { markerRef.current?.setLngLat([lng, lat]); }, [lng, lat]);
  return element && createPortal(
    <Button type='button' size='icon' variant='solid' tone={item.tone || 'accent'}
      className='ds-map-marker rounded-full' aria-label={item.label} aria-pressed={selected}
      onFocus={() => { if (!map.getBounds().contains([lng, lat])) map.jumpTo({ center: [lng, lat] }); }}
      onClick={() => onSelect?.(item.id)}>
      {item.icon || <Icon name='MapPin' size='sm' />}
      {item.badge != null && <span className='ds-map-marker-badge' aria-hidden='true'>{item.badge}</span>}
    </Button>, element);
}
