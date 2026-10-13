'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { useLiveAnnouncer } from '../../../hooks/a11y/use-live-announcer.js';
import { classifyMediaError, getSpeechRecognition, openMicrophone, stopStream, useAudioLevel, voiceSupport } from './voiceMedia.js';

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
 * why. `mode` forces `speech` or `recorder`; `deviceId` comes from ChatMicSelector. The ring follows the
 * live input level while listening, and every state change is announced politely.
 */
function ChatSpeechInput({
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
  const { announce } = useLiveAnnouncer();
  const buttonRef = useRef(null);
  const session = useRef(null);
  const mounted = useRef(false);
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
    if (message) announce(message);
    callbacks.current.onStateChange?.(next);
  }, [ announce, callbacks ]);

  const fail = useCallback((cause) => {
    const kind = classifyMediaError(cause);
    setProblem(kind);
    announce(labels[kind] || labels.failed);
    callbacks.current.onError?.(kind, cause);
  }, [ announce, callbacks, labels ]);

  const release = useCallback(() => {
    const current = session.current;
    session.current = null;
    if (current?.levelStream) stopStream(current.levelStream);
    if (current?.stream) stopStream(current.stream);
    setStream(null);
  }, []);

  const startSpeech = useCallback(async (current) => {
    const Recognition = getSpeechRecognition();
    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    current.recognition = recognition;
    recognition.onresult = (event) => {
      if (session.current !== current) return;
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
      if (session.current !== current) return;
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

  const startRecorder = useCallback(async (current) => {
    const micStream = await openMicrophone(deviceId);
    if (session.current !== current) { stopStream(micStream); return; }
    current.stream = micStream;
    const mimeType = pickMimeType();
    const mediaRecorder = new window.MediaRecorder(micStream, mimeType ? { mimeType } : undefined);
    const chunks = [];
    current.recorder = mediaRecorder;
    mediaRecorder.ondataavailable = (event) => {
      if (event.data?.size) chunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
      if (session.current !== current || !mounted.current) return;
      stopStream(current.stream);
      setStream(null);
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType || mimeType || 'audio/webm' });
      move('processing', labels.processing);
      try {
        const text = await callbacks.current.onAudio?.(blob);
        if (!mounted.current || session.current !== current) return;
        release();
        if (typeof text === 'string' && text.trim()) callbacks.current.onTranscript?.(text.trim(), { final: true });
        move('idle', labels.stopped);
      } catch (cause) {
        if (!mounted.current || session.current !== current) return;
        release();
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
      current.recognition.stop();
    } else if (current.recorder?.state === 'recording') current.recorder.stop();
  }, []);

  const start = useCallback(async () => {
    if (disabled || !engine || session.current) return;
    const current = {};
    session.current = current;
    setProblem(null);
    try {
      if (engine === 'speech') await startSpeech(current);
      else if (engine === 'recorder') await startRecorder(current);
    } catch (cause) {
      if (!mounted.current || session.current !== current) return;
      release();
      fail(cause);
      move('idle');
    }
  }, [ disabled, engine, fail, move, release, startRecorder, startSpeech ]);

  const announceCancellation = useCallback(() => {
    callbacks.current.onInterim?.('');
    callbacks.current.onStateChange?.('idle');
  }, [callbacks]);

  // A disabled control or changed capture configuration cancels the previous session.
  // Keep its identity through transcription so late results cannot update a new session.
  useEffect(() => {
    mounted.current = true;
    setStream(null);
    setState('idle');
    return () => {
      mounted.current = false;
      const current = session.current;
      session.current = null;
      if (current?.recognition) {
        current.recognition.onresult = null;
        current.recognition.onerror = null;
        current.recognition.onend = null;
        current.recognition.abort?.();
      }
      if (current?.recorder) {
        current.recorder.onstop = null;
        current.recorder.ondataavailable = null;
        if (current.recorder.state === 'recording') current.recorder.stop();
      }
      stopStream(current?.stream);
      stopStream(current?.levelStream);
      if (current) announceCancellation();
    };
  }, [ announceCancellation, deviceId, disabled, engine, lang ]);

  const listening = state === 'listening';
  const processing = state === 'processing';
  const blocked = disabled || unsupported || supportFlags === 'server';
  const hint = unsupported ? labels.unsupported : problem ? labels[problem] || labels.failed : null;
  const label = processing ? labels.processing : listening ? labels.stop : labels.start;
  const icon = processing ? 'LoaderCircle' : problem ? 'TriangleAlert' : listening ? 'Square' : 'Mic';

  return (
    <>
      <Button
        {...props}
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
        onClick={(event) => {
          props.onClick?.(event);
          if (event.defaultPrevented || blocked || processing) return;
          if (listening) stop();
          else start();
        }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          if (event.defaultPrevented || event.isComposing) return;
          if (event.key === 'Escape' && listening) {
            event.preventDefault();
            stop();
          }
        }}
        className={cn('ds-part-speech-input', className)}
      >
        <RegistryIcon lucide={icon} className={processing ? 'ds-part-speech-input-spinner' : undefined} />
      </Button>
      {hint ? <span id={hintId} className='sr-only'>{hint}</span> : null}
    </>
  );
}

export { ChatSpeechInput, speechInputStates, DEFAULT_LABELS as speechInputLabels };
