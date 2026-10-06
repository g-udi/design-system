'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '../Button/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

export function ColorPickerEyeDropper({ label, color, disabled, onPick }) {
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(null);
  const current = useRef({ color, disabled, onPick });
  current.current = { color, disabled, onPick };
  useEffect(() => {
    setAvailable(typeof window.EyeDropper === 'function' && window.isSecureContext);
    return () => { request.current?.abort(); request.current = null; };
  }, []);
  useEffect(() => { request.current?.abort(); }, [color, disabled]);
  const pick = async () => {
    if (!available || disabled || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError('');
    try {
      const result = await new window.EyeDropper().open({ signal: controller.signal });
      if (!controller.signal.aborted && !current.current.disabled && current.current.color === color) current.current.onPick(result.sRGBHex);
    } catch (cause) {
      if (!controller.signal.aborted && cause?.name !== 'AbortError') setError('Could not sample a color. Try again.');
    } finally {
      if (request.current === controller) {
        request.current = null;
        setBusy(false);
      }
    }
  };
  return (
    <span className='ds-color-picker-eyedropper' title={available ? 'Pick a color from your screen' : 'Screen sampling is not supported in this browser'}>
      <Button variant='outline' size='icon' aria-label={`${label}: pick from screen`} aria-busy={busy || undefined}
        disabled={disabled || !available || busy} onClick={pick}>
        <RegistryIcon lucide='PipetteIcon' aria-hidden='true' />
      </Button>
      {error && <span role='alert' className='ds-color-picker-eyedropper-error text-xs text-danger'>{error}</span>}
    </span>
  );
}
