'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { useLatestRef } from '../../../../hooks/shared/use-latest-ref.js';
import { classifyMediaError, getSpeechRecognition, openMicrophone, stopStream, useAudioLevel, voiceSupport } from './voice-media.js';

const DEFAULT_LABELS = {
  start: 'Start voice input',
  stop: 'Stop voice input',
  processing: 'Transcribing',
  listening: 'Listening',
  stopped: 'Voice input stopped',
  unsupported: 'Voice input is not available in this browser.',
  denied: 'Microphone access is blocked. Allow it in your browser’s site settings, then try again.',
  'no-device': 'No microphone was found. Connect one and try again.',
  failed: 'Voice input stopped unexpectedly. Try again.'
};

const speechInputStates = [ 'idle', 'listening', 'processing' ];

const noop = () => () => {};
// Capabilities are read after hydration, so server and first client render agree (disabled).
const useSupport = () => useSyncExternalStore(noop, () => supportKey(), () => 'server');
const supportKey = () => {
  const support = voiceSupport();
  return `${support.speech ? 's' : ''}${support.recorder ? 'r' : ''}${support.media ? 'm' : ''}`;
};

const pickMimeType = () => {
  const Recorder = typeof window !== 'undefined' ? window.MediaRecorder : undefined;
  if (!Recorder?.isTypeSupported) return undefined;
  return [ 'audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg' ].find((type) => Recorder.isTypeSupported(type));
};

/**
 * A microphone button for the composer's mic slot. Press it (or Space / Enter) to listen, press
 * again or Escape to stop. With the Web Speech API it transcribes live: `onInterim(text)` while the
 * reader speaks and `onTranscript(text)` for each final phrase. Where speech recognition is missing
 * it records with MediaRecorder and hands the Blob to `onAudio(blob)`; return the transcript (or a
 * promise of it) to have it passed to `onTranscript`. With neither, the button is disabled and says
 * why. `mode` forces `speech` or `recorder`; `deviceId` comes from MicSelector. The ring follows the
 * live input level while listening, and every state change is announced politely.
 */
function SpeechInput({
  mode = 'auto',
  lang = 'en-US',
  deviceId,
  onTranscript,
  onInterim,
  onAudio,
  onStateChange,
  onError,
  onLevel,
  showLevel = true,
  labels: labelOverrides,
  size = 'icon',
  variant = 'ghost',
  disabled = false,
  className,
  ...props
}) {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...labelOverrides }), [ labelOverrides ]);
  const supportFlags = useSupport();
  const [ state, setState ] = useState('idle');
  const [ problem, setProblem ] = useState(null);
  const [ stream, setStream ] = useState(null);
  const [ announcement, setAnnouncement ] = useState('');
  const buttonRef = useRef(null);
  const session = useRef(null);
  const callbacks = useLatestRef({ onTranscript, onInterim, onAudio, onStateChange, onError, onLevel });
  const hintId = useId();

  const speech = supportFlags.includes('s');
  const recorder = supportFlags.includes('r') && typeof onAudio === 'function';
  const engine = mode === 'speech' ? (speech ? 'speech' : null) : mode === 'recorder' ? (recorder ? 'recorder' : null) : speech ? 'speech' : recorder ? 'recorder' : null;
  const unsupported = supportFlags !== 'server' && !engine;

  const writeLevel = useCallback((level) => {
    buttonRef.current?.style.setProperty('--ds-voice-level', level.toFixed(3));
    callbacks.current.onLevel?.(level);
  }, [ callbacks ]);
  useAudioLevel(showLevel ? stream : null, { onLevel: writeLevel });

  const move = useCallback((next, message) => {
    setState(next);
    if (message) setAnnouncement(message);
    callbacks.current.onStateChange?.(next);
  }, [ callbacks ]);

  const fail = useCallback((cause) => {
    const kind = classifyMediaError(cause);
    setProblem(kind);
    setAnnouncement(labels[kind] || labels.failed);
    callbacks.current.onError?.(kind, cause);
  }, [ callbacks, labels ]);

  const release = useCallback(() => {
    const current = session.current;
    session.current = null;
    if (current?.levelStream) stopStream(current.levelStream);
    if (current?.stream) stopStream(current.stream);
    setStream(null);
  }, []);

  const startSpeech = useCallback(async () => {
    const Recognition = getSpeechRecognition();
    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    const current = { recognition, stopping: false };
    session.current = current;
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? '';
        if (result.isFinal) {
          const finalText = text.trim();
          if (finalText) callbacks.current.onTranscript?.(finalText, { final: true });
        } else interim += text;
      }
      callbacks.current.onInterim?.(interim.trim());
    };
    recognition.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') return;
      fail(event.error);
    };
    recognition.onend = () => {
      if (session.current !== current) return;
      release();
      callbacks.current.onInterim?.('');
      move('idle', labels.stopped);
    };
    recognition.start();
    move('listening', labels.listening);
    // A second stream only feeds the level ring; recognition keeps its own microphone.
    if (showLevel && voiceSupport().media) {
      openMicrophone(deviceId).then((levelStream) => {
        if (session.current !== current) return stopStream(levelStream);
        current.levelStream = levelStream;
        setStream(levelStream);
        return undefined;
      }).catch(() => {});
    }
  }, [ callbacks, deviceId, fail, labels.listening, labels.stopped, lang, move, release, showLevel ]);

  const startRecorder = useCallback(async () => {
    const micStream = await openMicrophone(deviceId);
    const mimeType = pickMimeType();
    const mediaRecorder = new window.MediaRecorder(micStream, mimeType ? { mimeType } : undefined);
    const chunks = [];
    const current = { recorder: mediaRecorder, stream: micStream };
    session.current = current;
    mediaRecorder.ondataavailable = (event) => {
      if (event.data?.size) chunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
      release();
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType || mimeType || 'audio/webm' });
      move('processing', labels.processing);
      try {
        const text = await callbacks.current.onAudio?.(blob);
        if (typeof text === 'string' && text.trim()) callbacks.current.onTranscript?.(text.trim(), { final: true });
        move('idle', labels.stopped);
      } catch (cause) {
        fail(cause);
        move('idle');
      }
    };
    mediaRecorder.start();
    setStream(micStream);
    move('listening', labels.listening);
  }, [ callbacks, deviceId, fail, labels.listening, labels.processing, labels.stopped, move, release ]);

  const stop = useCallback(() => {
    const current = session.current;
    if (!current) return;
    if (current.recognition) {
      current.stopping = true;
      current.recognition.stop();
    } else if (current.recorder?.state === 'recording') current.recorder.stop();
  }, []);

  const start = useCallback(async () => {
    setProblem(null);
    try {
      if (engine === 'speech') await startSpeech();
      else if (engine === 'recorder') await startRecorder();
    } catch (cause) {
      release();
      fail(cause);
      move('idle');
    }
  }, [ engine, fail, move, release, startRecorder, startSpeech ]);

  // Stop listening and release the microphone on unmount.
  useEffect(() => () => {
    const current = session.current;
    session.current = null;
    current?.recognition?.abort?.();
    if (current?.recorder?.state === 'recording') {
      current.recorder.onstop = null;
      current.recorder.stop();
    }
    stopStream(current?.stream);
    stopStream(current?.levelStream);
  }, []);

  const listening = state === 'listening';
  const processing = state === 'processing';
  const blocked = disabled || unsupported || supportFlags === 'server';
  const hint = unsupported ? labels.unsupported : problem ? labels[problem] || labels.failed : null;
  const label = processing ? labels.processing : listening ? labels.stop : labels.start;
  const icon = processing ? 'LoaderCircle' : problem ? 'TriangleAlert' : listening ? 'Square' : 'Mic';

  return (
    <>
      <Button
        ref={buttonRef}
        type='button'
        size={size}
        variant={listening ? 'soft' : variant}
        tone={listening ? 'accent' : problem ? 'danger' : undefined}
        data-slot='speech-input'
        data-state={state}
        data-engine={engine || 'none'}
        data-problem={problem || undefined}
        aria-label={label}
        aria-pressed={listening}
        aria-busy={processing || undefined}
        aria-describedby={hint ? hintId : undefined}
        title={hint || label}
        disabled={blocked}
        onClick={() => {
          if (processing) return;
          if (listening) stop();
          else start();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && listening) {
            event.preventDefault();
            stop();
          }
        }}
        className={cn('ds-part-speech-input', className)}
        {...props}
      >
        <RegistryIcon lucide={icon} className={processing ? 'ds-part-speech-input-spinner' : undefined} />
      </Button>
      {hint ? <span id={hintId} className='sr-only'>{hint}</span> : null}
      <span role='status' aria-live='polite' className='sr-only'>{announcement}</span>
    </>
  );
}

export { SpeechInput, speechInputStates, DEFAULT_LABELS as speechInputLabels };
