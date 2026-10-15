'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../core/Select/SelectPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useAudioInputs, useAudioLevel } from './voiceMedia.js';
import { classifyMediaError, openMicrophone, stopStream } from './voiceMediaModel.js';
import { micSelectorLabels as DEFAULT_LABELS } from './voiceLabels.js';

/**
 * Picks the input device for voice input. Device names appear once the reader allows the
 * microphone (`Allow microphone` asks once and releases it). The list refreshes when devices are
 * plugged in or removed, and a blocked permission explains how to recover. `meter` adds a Test
 * button that opens the chosen device and shows a small level meter until stopped, so the microphone
 * is never held open silently. `value` / `defaultValue` / `onValueChange(deviceId, device)` follow
 * the device id; pass it to ChatSpeechInput's `deviceId`.
 */
function ChatMicSelector({
  value: valueProp,
  defaultValue,
  onValueChange,
  meter = true,
  autoRequest = false,
  labels: labelOverrides,
  className,
  ...props
}) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { devices, permission, error, refresh, request } = useAudioInputs({ autoRequest });
  const [value, choose] = useControllableState({ value: valueProp, defaultValue, onChange: (next) => onValueChange?.(next, devices.find((device) => device.deviceId === next)) });
  const [ testing, setTesting ] = useState(false);
  const [ stream, setStream ] = useState(null);
  const [ testError, setTestError ] = useState(null);
  const meterRef = useRef(null);
  const labelId = useId();
  const messageId = useId();

  // Keep the choice valid: the first device, or the default, when the chosen one disappears.
  const firstId = devices[0]?.deviceId;
  const known = devices.some((device) => device.deviceId === value);
  useEffect(() => {
    if (!firstId || known || valueProp !== undefined) return;
    choose(firstId);
  }, [ firstId, known, choose, valueProp ]);

  // The meter only runs while testing, on the chosen device.
  useEffect(() => {
    if (!meter || !testing) {
      if (!meter) setTesting(false);
      return undefined;
    }
    let cancelled = false;
    let opened = null;
    setTestError(null);
    openMicrophone(value).then((next) => {
      if (cancelled) return stopStream(next);
      opened = next;
      setStream(next);
      return undefined;
    }).catch((cause) => {
      if (cancelled) return;
      setTestError(classifyMediaError(cause));
      setTesting(false);
    });
    return () => {
      cancelled = true;
      stopStream(opened);
      setStream(null);
    };
  }, [ meter, testing, value ]);

  const writeLevel = useCallback((level) => {
    meterRef.current?.style.setProperty('--ds-voice-level', level.toFixed(3));
  }, []);
  useAudioLevel(stream, { onLevel: writeLevel });

  const status = testError === 'denied' || permission === 'denied' ? 'denied' : permission === 'unsupported' ? 'unsupported' : permission === 'granted' && !devices.length ? 'empty' : permission === 'granted' ? 'ready' : 'prompt';
  const message = status === 'ready' ? (testError ? labels[testError] ?? labels.empty : null) : labels[status];

  return (
    <div data-slot='mic-selector' data-status={status} className={cn('ds-part-mic-selector', className)} {...props}>
      <span id={labelId} className='ds-part-mic-selector-label'>{labels.label}</span>
      {status === 'ready' ? (
        <div className='ds-part-mic-selector-row'>
          <Select value={known ? value : undefined} onValueChange={choose}>
            <SelectTrigger aria-labelledby={labelId} className='ds-part-mic-selector-trigger'>
              <RegistryIcon lucide='Mic' className='text-text-muted' />
              <SelectValue placeholder={labels.placeholder} />
            </SelectTrigger>
            <SelectContent position='popper'>
              {devices.map((device) => (
                <SelectItem key={device.deviceId || device.label} value={device.deviceId || device.label}>{device.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size='icon' variant='ghost' aria-label={labels.refresh} title={labels.refresh} onClick={() => refresh()}>
            <RegistryIcon lucide='RefreshCw' />
          </Button>
          {meter ? (
            <Button size='sm' variant='outline' aria-pressed={testing} onClick={() => setTesting((on) => !on)}>
              {testing ? labels.stopTest : labels.test}
            </Button>
          ) : null}
        </div>
      ) : (
        <div className='ds-part-mic-selector-row'>
          <p id={messageId} className='ds-part-mic-selector-message' data-tone={status === 'denied' ? 'danger' : undefined}>
            <RegistryIcon lucide={status === 'denied' || status === 'unsupported' ? 'TriangleAlert' : 'Mic'} />
            <span>{message}</span>
          </p>
          {status === 'prompt' || status === 'denied' ? (
            <Button size='sm' variant={status === 'prompt' ? 'solid' : 'outline'} aria-describedby={messageId} onClick={() => request()}>
              {status === 'prompt' ? labels.allow : labels.retry}
            </Button>
          ) : null}
          {status === 'empty' ? (
            <Button size='icon' variant='ghost' aria-label={labels.refresh} onClick={() => refresh()}>
              <RegistryIcon lucide='RefreshCw' />
            </Button>
          ) : null}
        </div>
      )}
      {status === 'ready' && message ? <p className='ds-part-mic-selector-message' data-tone='danger'>{message}</p> : null}
      {meter && testing ? (
        <div className='ds-part-mic-selector-meter-row'>
          <span className='text-text-muted text-xs'>{labels.level}</span>
          {/* A 60fps meter is visual feedback only; the Test button's pressed state tells assistive technology it is on. */}
          <span ref={meterRef} aria-hidden='true' className='ds-part-voice-meter'>
            {Array.from({ length: 12 }, (_, bar) => <span key={bar} className='ds-part-voice-meter-bar' style={{ '--ds-voice-bar': (bar + 1) / 12 }} />)}
          </span>
        </div>
      ) : null}
      {error && error !== 'denied' && status !== 'ready' ? <p className='ds-part-mic-selector-message' data-tone='danger'>{labels[error] ?? labels.empty}</p> : null}
    </div>
  );
}

export { ChatMicSelector };
