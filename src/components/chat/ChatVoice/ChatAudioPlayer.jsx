'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import { Slider } from '../../core/Slider/Slider.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { formatAudioTime } from './voiceMedia.js';
import { normalizeDownloadHref } from '../../../utilities/href.js';

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
 * Core Slider: arrow keys move a second, Page Up / Page Down ten seconds, Home and End the ends, and it
 * reads its position as time ("0:12 of 0:45"). `duration` shows a length before metadata loads.
 */
function ChatAudioPlayer({
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

  useEffect(() => {
    setDuration(Number.isFinite(durationHint) ? durationHint : 0);
  }, [ src, durationHint ]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        if (audioRef.current === audio) setFailed(true);
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

  const bars = Array.isArray(peaks) && peaks.length ? peaks : null;
  const valueText = `${formatAudioTime(time)} ${labels.of} ${formatAudioTime(duration)}`;
  const fileName = typeof download === 'string' ? download : true;

  return (
    <div data-slot='audio-player' data-playing={playing || undefined} data-failed={failed || undefined} className={cn('ds-part-audio-player', className)} {...props}>
      <audio
        key={src}
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
          <div className='relative min-w-0'>
            <Slider
              aria-label={title ? `${labels.seek} ${title}` : labels.seek}
              min={0}
              max={duration || 1}
              step={1}
              value={[Math.min(time, duration)]}
              onValueChange={([next]) => seek(next)}
              getValueText={() => valueText}
              disabled={!duration}
              className='ds-part-audio-player-slider absolute inset-0 z-10 h-full [&_[data-slot=slider-track]]:opacity-0 [&_[data-slot=slider-thumb]]:size-2 [&_[data-slot=slider-thumb]]:opacity-0 [&_[data-slot=slider-thumb]:focus-visible]:opacity-100'
            />
            <div
              aria-hidden='true'
              data-variant={bars ? 'waveform' : 'bar'}
              className='ds-part-audio-player-track pointer-events-none'
              style={{ '--ds-audio-progress': progress }}
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
      {download && normalizeDownloadHref(src) ? (
        <Button asChild size='icon-sm' variant='ghost'>
          <a href={normalizeDownloadHref(src)} download={fileName} aria-label={`${labels.download}${title ? ` ${title}` : ''}`}>
            <RegistryIcon lucide='Download' />
          </a>
        </Button>
      ) : null}
    </div>
  );
}

export { ChatAudioPlayer, DEFAULT_LABELS as audioPlayerLabels };
