'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { formatAudioTime } from './voice-media.js';

const DEFAULT_LABELS = {
  play: 'Play',
  pause: 'Pause',
  seek: 'Seek',
  speed: 'Playback speed',
  download: 'Download',
  error: 'This audio could not be played.',
  of: 'of'
};

/**
 * A compact player for voice messages and text-to-speech replies. Play and pause, a scrubbable
 * waveform (from `peaks`, numbers in 0..1) or progress bar, elapsed and total time, a speed toggle
 * through `speeds`, and an optional download (`download`: true, or a file name). The scrubber is a
 * slider: arrow keys move five seconds, Page Up / Page Down a tenth, Home and End the ends, and it
 * reads its position as time ("0:12 of 0:45"). `duration` shows a length before metadata loads.
 */
function AudioPlayer({
  src,
  title,
  peaks,
  duration: durationHint,
  speeds = [ 1, 1.5, 2 ],
  download = false,
  autoPlay = false,
  onPlay,
  onPause,
  onEnded,
  labels: labelOverrides,
  className,
  ...props
}) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const frameRef = useRef(0);
  const [ playing, setPlaying ] = useState(false);
  const [ time, setTime ] = useState(0);
  const [ duration, setDuration ] = useState(Number.isFinite(durationHint) ? durationHint : 0);
  const [ speedIndex, setSpeedIndex ] = useState(0);
  const [ failed, setFailed ] = useState(false);
  const speed = speeds[speedIndex] ?? 1;
  const progress = duration > 0 ? Math.min(1, time / duration) : 0;

  // Smooth progress while playing; timeupdate alone ticks only about four times a second.
  const follow = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    const tick = () => {
      const audio = audioRef.current;
      if (!audio || audio.paused) return;
      setTime(audio.currentTime);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [ speed ]);

  useEffect(() => {
    setFailed(false);
    setTime(0);
    setPlaying(false);
  }, [ src ]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setFailed(true);
      }
    } else audio.pause();
  };

  const seek = (seconds) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const next = Math.max(0, Math.min(duration, seconds));
    audio.currentTime = next;
    setTime(next);
  };

  const seekFromPointer = (event) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect?.width) return;
    const ratio = (event.clientX - rect.left) / rect.width;
    const rtl = getComputedStyle(trackRef.current).direction === 'rtl';
    seek((rtl ? 1 - ratio : ratio) * duration);
  };

  const onKeyDown = (event) => {
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: duration / 10, PageDown: -duration / 10 }[event.key];
    if (step !== undefined) seek(time + step);
    else if (event.key === 'Home') seek(0);
    else if (event.key === 'End') seek(duration);
    else return;
    event.preventDefault();
  };

  const bars = Array.isArray(peaks) && peaks.length ? peaks : null;
  const valueText = `${formatAudioTime(time)} ${labels.of} ${formatAudioTime(duration)}`;
  const fileName = typeof download === 'string' ? download : true;

  return (
    <div data-slot='audio-player' data-playing={playing || undefined} data-failed={failed || undefined} className={cn('ds-part-audio-player', className)} {...props}>
      <audio
        ref={audioRef}
        src={src}
        preload='metadata'
        autoPlay={autoPlay}
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value)) setDuration(value);
          event.currentTarget.playbackRate = speed;
        }}
        onDurationChange={(event) => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value)) setDuration(value);
        }}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onPlay={() => {
          setPlaying(true);
          follow();
          onPlay?.();
        }}
        onPause={() => {
          setPlaying(false);
          onPause?.();
        }}
        onEnded={(event) => {
          setPlaying(false);
          setTime(event.currentTarget.duration || 0);
          onEnded?.();
        }}
        onError={() => setFailed(true)}
      />
      <Button
        size='icon-sm'
        variant='soft'
        tone='accent'
        aria-label={`${playing ? labels.pause : labels.play}${title ? ` ${title}` : ''}`}
        disabled={failed || !src}
        onClick={toggle}
        className='ds-part-audio-player-toggle'
      >
        <RegistryIcon lucide={playing ? 'Pause' : 'Play'} />
      </Button>
      <div className='ds-part-audio-player-body'>
        {title ? <span className='ds-part-audio-player-title'>{title}</span> : null}
        {failed ? (
          <span role='alert' className='ds-part-audio-player-error'>{labels.error}</span>
        ) : (
          <div
            ref={trackRef}
            role='slider'
            tabIndex={duration ? 0 : -1}
            aria-label={title ? `${labels.seek} ${title}` : labels.seek}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(time)}
            aria-valuetext={valueText}
            aria-disabled={!duration || undefined}
            data-variant={bars ? 'waveform' : 'bar'}
            className='ds-part-audio-player-track'
            style={{ '--ds-audio-progress': progress }}
            onKeyDown={onKeyDown}
            onPointerDown={(event) => {
              if (!duration) return;
              event.currentTarget.setPointerCapture?.(event.pointerId);
              seekFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture?.(event.pointerId)) seekFromPointer(event);
            }}
          >
            {bars ? bars.map((peak, index) => (
              <span
                key={index}
                aria-hidden='true'
                data-played={(index + 0.5) / bars.length <= progress || undefined}
                className='ds-part-audio-player-bar'
                style={{ '--ds-audio-peak': Math.max(0.08, Math.min(1, peak)) }}
              />
            )) : <span aria-hidden='true' className='ds-part-audio-player-fill' />}
          </div>
        )}
      </div>
      <span className='ds-part-audio-player-time' aria-hidden='true'>{playing || time ? formatAudioTime(time) : formatAudioTime(duration)}</span>
      {speeds.length > 1 ? (
        <Button
          size='xs'
          variant='ghost'
          aria-label={`${labels.speed} ${speed}×`}
          onClick={() => setSpeedIndex((index) => (index + 1) % speeds.length)}
          className='ds-part-audio-player-speed'
        >
          {`${speed}×`}
        </Button>
      ) : null}
      {download && src ? (
        <Button asChild size='icon-sm' variant='ghost'>
          <a href={src} download={fileName} aria-label={`${labels.download}${title ? ` ${title}` : ''}`}>
            <RegistryIcon lucide='Download' />
          </a>
        </Button>
      ) : null}
    </div>
  );
}

export { AudioPlayer, DEFAULT_LABELS as audioPlayerLabels };
