'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLatestRef } from '../../../../hooks/shared/use-latest-ref.js';

// Every browser API here is read lazily and guarded, so these helpers are safe to import and call
// during server rendering; they simply report "unsupported" there.

const hasWindow = () => typeof window !== 'undefined';

/** The Web Speech API recognition constructor, or null (Firefox, server rendering). */
export function getSpeechRecognition() {
  if (!hasWindow()) return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

const getAudioContext = () => (hasWindow() ? window.AudioContext || window.webkitAudioContext || null : null);

/** Which voice capabilities this browser offers right now. */
export function voiceSupport() {
  const media = hasWindow() && typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
  return {
    secure: hasWindow() ? window.isSecureContext !== false : false,
    speech: Boolean(getSpeechRecognition()),
    recorder: media && typeof window.MediaRecorder !== 'undefined',
    media,
    devices: media && typeof navigator.mediaDevices.enumerateDevices === 'function',
    audioContext: Boolean(getAudioContext())
  };
}

/** Opens a microphone stream, optionally on one input device. */
export function openMicrophone(deviceId) {
  if (!voiceSupport().media) return Promise.reject(Object.assign(new Error('Microphone capture is not available in this browser.'), { name: 'NotSupportedError' }));
  return navigator.mediaDevices.getUserMedia({ audio: deviceId ? { deviceId: { exact: deviceId } } : true });
}

/** Stops every track of a stream. */
export function stopStream(stream) {
  stream?.getTracks?.().forEach((track) => track.stop());
}

/** A permission error, a missing device or anything else, from a getUserMedia or recognition error. */
export function classifyMediaError(error) {
  const name = typeof error === 'string' ? error : error?.name || error?.error;
  if ([ 'NotAllowedError', 'SecurityError', 'PermissionDeniedError', 'not-allowed', 'service-not-allowed' ].includes(name)) return 'denied';
  if ([ 'NotFoundError', 'DevicesNotFoundError', 'OverconstrainedError', 'audio-capture' ].includes(name)) return 'no-device';
  if ([ 'NotSupportedError' ].includes(name)) return 'unsupported';
  return 'failed';
}

/**
 * The live loudness of a MediaStream, from an AnalyserNode. Returns `{ levelRef, waveformRef }`:
 * `levelRef.current` is 0..1 and `waveformRef.current` the latest time-domain samples, both updated
 * every animation frame without re-rendering, ready for Persona's `levelRef` / `waveformRef`.
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

/** `m:ss` (or `h:mm:ss`) for a number of seconds. */
export function formatAudioTime(seconds) {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/**
 * Peak amplitudes (0..1) for a waveform, from an AudioBuffer or a Float32Array of samples, in
 * `count` buckets. Use it once when a voice message is created and store the result with the message.
 */
export function computePeaks(input, count = 48) {
  const data = input?.getChannelData ? input.getChannelData(0) : input;
  if (!data?.length || count < 1) return [];
  const bucket = Math.max(1, Math.floor(data.length / count));
  const peaks = [];
  let max = 0;
  for (let i = 0; i < count; i += 1) {
    let peak = 0;
    const start = i * bucket;
    for (let j = start; j < Math.min(data.length, start + bucket); j += 1) peak = Math.max(peak, Math.abs(data[j]));
    peaks.push(peak);
    max = Math.max(max, peak);
  }
  return max ? peaks.map((peak) => Math.round((peak / max) * 1000) / 1000) : peaks;
}
