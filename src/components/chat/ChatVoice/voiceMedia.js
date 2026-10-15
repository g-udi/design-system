'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { classifyMediaError, getAudioContext, openMicrophone, stopStream, voiceSupport } from './voiceMediaModel.js';

/**
 * The live loudness of a MediaStream, from an AnalyserNode. Returns `{ levelRef, waveformRef }`:
 * `levelRef.current` is 0..1 and `waveformRef.current` the latest time-domain samples, both updated
 * every animation frame without re-rendering, ready for ChatPersona's `levelRef` / `waveformRef`.
 * `onLevel(level)` runs each frame for direct DOM writes (a meter width, a glow). Does nothing
 * without a stream or an AudioContext; the context closes when the stream changes or on unmount.
 */
export function useAudioLevel(stream, { onLevel, smoothing = 0.6 } = {}) {
  const levelRef = useRef(0);
  const waveformRef = useRef(new Uint8Array(0));
  const onLevelRef = useLatestRef(onLevel);

  useEffect(() => {
    const AudioContextCtor = getAudioContext();
    if (!stream || !AudioContextCtor) return undefined;
    let context;
    let raf = 0;
    const notify = (level) => onLevelRef.current?.(level);
    try {
      context = new AudioContextCtor();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = smoothing;
      source.connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      waveformRef.current = samples;
      context.resume?.().catch(() => {});
      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i += 1) {
          const value = (samples[i] - 128) / 128;
          sum += value * value;
        }
        const level = Math.min(1, Math.sqrt(sum / samples.length) * 3.2);
        levelRef.current = levelRef.current * 0.6 + level * 0.4;
        notify(levelRef.current);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } catch {
      context?.close?.().catch(() => {});
      return undefined;
    }
    return () => {
      cancelAnimationFrame(raf);
      levelRef.current = 0;
      waveformRef.current = new Uint8Array(0);
      notify(0);
      context.close?.().catch(() => {});
    };
  }, [ stream, smoothing, onLevelRef ]);

  return { levelRef, waveformRef };
}

/**
 * Audio input devices with their permission state. `permission` is unknown, prompt, granted,
 * denied or unsupported. Device names stay hidden until the reader grants access, so `request()`
 * asks once (and releases the microphone straight away). The list refreshes on `devicechange`.
 */
export function useAudioInputs({ autoRequest = false } = {}) {
  const [ devices, setDevices ] = useState([]);
  const [ permission, setPermission ] = useState('unknown');
  const [ error, setError ] = useState(null);

  const refresh = useCallback(async () => {
    if (!voiceSupport().devices) {
      setPermission('unsupported');
      return [];
    }
    try {
      const list = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === 'audioinput');
      setDevices(list.map(({ deviceId, groupId, label }, index) => ({ deviceId, groupId, label: label || `Microphone ${index + 1}`, named: Boolean(label) })));
      if (list.some((device) => device.label)) setPermission('granted');
      else setPermission((current) => (current === 'denied' ? current : 'prompt'));
      return list;
    } catch (cause) {
      setError(classifyMediaError(cause));
      return [];
    }
  }, []);

  const request = useCallback(async () => {
    setError(null);
    try {
      const stream = await openMicrophone();
      stopStream(stream);
      setPermission('granted');
      await refresh();
      return true;
    } catch (cause) {
      const kind = classifyMediaError(cause);
      setError(kind);
      if (kind === 'denied') setPermission('denied');
      if (kind === 'unsupported') setPermission('unsupported');
      return false;
    }
  }, [ refresh ]);

  useEffect(() => {
    if (!voiceSupport().devices) {
      setPermission('unsupported');
      return undefined;
    }
    let cancelled = false;
    let status;
    const onStatus = () => {
      if (cancelled || !status) return;
      if (status.state === 'denied') setPermission('denied');
      refresh();
    };
    refresh().then(() => {
      if (cancelled) return;
      navigator.permissions?.query?.({ name: 'microphone' }).then((result) => {
        if (cancelled) return;
        status = result;
        if (result.state === 'denied') setPermission('denied');
        result.addEventListener?.('change', onStatus);
      }).catch(() => {});
      if (autoRequest) request();
    });
    navigator.mediaDevices.addEventListener?.('devicechange', refresh);
    return () => {
      cancelled = true;
      status?.removeEventListener?.('change', onStatus);
      navigator.mediaDevices.removeEventListener?.('devicechange', refresh);
    };
  }, [ autoRequest, refresh, request ]);

  return { devices, permission, error, refresh, request };
}
