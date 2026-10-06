'use client';

import { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import Button from '../Button/index.js';
import Icon from '../Icon/index.js';
import Dialog from '../Dialog/index.js';
import { Pointer } from '../Pointer/index.js';
import { Slider } from '../Slider/index.js';
import { NativeSelect, NativeSelectOption } from '../Select/index.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { cn } from '../../../utilities/cn/index.js';
import { useVideoPlayback } from './useVideoPlayback.js';
import { formatVideoTime } from './videoTime.js';

const emptyTracks = [];
function Control({ label, icon, ...props }) {
  return <Button type='button' variant='ghost' tone='neutral' size='icon' aria-label={label} title={label} {...props}><Icon name={icon} size='sm' decorative /></Button>;
}

function Timeline({ player, elastic }) {
  const { state, seek } = player;
  const [preview, setPreview] = useState(null);
  const reducedMotion = usePrefersReducedMotion();
  const stretch = useSpring(0, { stiffness: 320, damping: 28 });
  const reset = () => { setPreview(null); stretch.set(0); };
  return <motion.div className='ds-video-timeline' style={{ x: reducedMotion ? 0 : stretch }}
    onPointerMove={event => {
      if (!state.duration || event.pointerType === 'touch') return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      setPreview({ fraction, time: fraction * state.duration });
      if (elastic && event.buttons) stretch.set(Math.max(-12, Math.min(12, (event.clientX - Math.max(bounds.left, Math.min(bounds.right, event.clientX))) * 0.12)));
    }} onPointerLeave={reset} onPointerUp={() => stretch.set(0)} onPointerCancel={reset}>
    <div className='ds-video-buffer' aria-hidden='true'>{state.buffered.map((range, index) => <span key={index} style={{ left: `${range.start}%`, width: `${range.end - range.start}%` }} />)}</div>
    <Slider dir='ltr' aria-label='Seek video' min={0} max={state.duration || 1} step={0.1} disabled={!state.duration || player.failed}
      value={[state.currentTime]} onValueChange={([value]) => seek(value)} getValueText={value => `${formatVideoTime(value)} of ${formatVideoTime(state.duration)}`} />
    {preview && <span className='ds-video-preview-time' aria-hidden='true' style={{ left: `clamp(24px, ${preview.fraction * 100}%, calc(100% - 24px))` }}>{formatVideoTime(preview.time)}</span>}
  </motion.div>;
}

function Playback({ src, poster, title, variant, aspectRatio, fit, tracks, autoPlay, loop, preload, defaultMuted, defaultVolume, nativeControls, videoRef, onPlay, onPause, onEnded, onTimeUpdate, onError }) {
  const player = useVideoPlayback({ autoPlay, defaultMuted, defaultVolume, onPlay, onPause, onEnded, onTimeUpdate, onError });
  const ref = useMergedRefs(player.videoRef, videoRef);
  const { state, failed, waiting, notice } = player;
  const minimal = variant === 'minimal';
  const playLabel = state.ended ? 'Replay' : state.paused ? 'Play' : 'Pause';
  const playIcon = state.ended ? 'RotateCcw' : state.paused ? 'Play' : 'Pause';
  const disabled = !src || failed;
  const captions = tracks.map((track, index) => ({ ...track, index })).filter(track => !track.kind || ['captions', 'subtitles'].includes(track.kind));
  return <div ref={player.rootRef} className='ds-video-playback' data-variant={minimal ? 'minimal' : 'standard'} data-native={nativeControls || undefined} data-captioned={player.caption !== 'off' || undefined} data-paused={state.paused || undefined} role='region' aria-label={`${title} player`}>
    <div className='ds-video-stage' style={{ aspectRatio }}>
      <video ref={ref} src={src || undefined} poster={poster} preload={preload} loop={loop} playsInline controls={nativeControls} aria-label={title} style={{ objectFit: fit }}>
        {tracks.map((track, index) => <track key={`${track.src}-${index}`} kind='captions' {...track} />)}
      </video>
      {!nativeControls && src && !failed && <Button type='button' variant='ghost' tone='neutral' className='ds-video-stage-action' aria-label={`${playLabel} ${title}`} onClick={player.toggle}>
        {state.paused && <span className='ds-video-play-mark' data-slot='video-play-mark'><Icon name={playIcon} decorative /></span>}
      </Button>}
      {(!src || failed) && <div className='ds-video-empty' role='status'>
        <Icon name='VideoOff' decorative /><span>{src ? 'This video could not load.' : 'No video selected.'}</span>
        {src && <Button type='button' variant='outline' size='sm' onClick={player.retry}>Retry video</Button>}
      </div>}
      {waiting && !state.paused && <span className='ds-video-loading' role='status'>Buffering…</span>}
    </div>
    {!nativeControls && <div className='ds-video-controls'>
      <Control label={playLabel} icon={playIcon} disabled={disabled} onClick={player.toggle} />
      <time className='ds-video-time' aria-label='Elapsed time'>{formatVideoTime(state.currentTime)}</time>
      <Timeline player={player} elastic={minimal} />
      <time className='ds-video-time' aria-label='Duration'>{formatVideoTime(state.duration)}</time>
      <div className='ds-video-secondary'>
        <div className='ds-video-audio'>
          <Control label={state.muted || !state.volume ? 'Unmute' : 'Mute'} icon={state.muted || !state.volume ? 'VolumeX' : 'Volume2'} disabled={disabled} onClick={player.mute} />
          {!minimal && <Slider dir='ltr' className='ds-video-volume' aria-label='Volume' min={0} max={1} step={0.05} value={[state.muted ? 0 : state.volume]} disabled={disabled} onValueChange={([value]) => player.volume(value)} getValueText={value => `${Math.round(value * 100)}%`} />}
        </div>
        {captions.length > 0 && <NativeSelect className='ds-video-select' size='sm' aria-label='Captions' value={player.caption} disabled={disabled} onChange={event => player.chooseCaption(event.target.value)}>
          <NativeSelectOption value='off'>CC off</NativeSelectOption>
          {captions.map(track => <NativeSelectOption key={track.index} value={String(track.index)}>{track.label || track.srcLang || `Track ${track.index + 1}`}</NativeSelectOption>)}
        </NativeSelect>}
        {!minimal && <NativeSelect className='ds-video-select' size='sm' aria-label='Playback speed' value={state.playbackRate} disabled={disabled} onChange={event => { player.videoRef.current.playbackRate = Number(event.target.value); }}>
          {[0.5, 1, 1.5, 2].map(rate => <NativeSelectOption key={rate} value={rate}>{rate}×</NativeSelectOption>)}
        </NativeSelect>}
        {!minimal && player.capabilities.pip && <Control label={player.pip ? 'Exit picture-in-picture' : 'Picture-in-picture'} icon='PictureInPicture2' disabled={disabled || !state.duration} onClick={() => player.display('pip')} />}
        {player.capabilities.fullscreen && <Control label={player.fullscreen ? 'Exit fullscreen' : 'Fullscreen'} icon={player.fullscreen ? 'Minimize' : 'Maximize'} disabled={disabled} onClick={() => player.display('fullscreen')} />}
      </div>
    </div>}
    <div className='ds-video-notice' role='status'>{notice}</div>
  </div>;
}

/** Native media playback with a full toolbar, an elastic minimal timeline, or a poster-to-dialog flow. */
export function VideoPlayer({
  src, poster, title = 'Video', variant = 'standard', aspectRatio = '16 / 9', fit = 'contain', tracks = emptyTracks,
  autoPlay = false, loop = false, preload = 'metadata', defaultMuted = false, defaultVolume = 1, nativeControls = false,
  open, defaultOpen = false, onOpenChange, onPlay, onPause, onEnded, onTimeUpdate, onError, ref, className, style
}) {
  const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const props = { src, poster, title, aspectRatio, fit, tracks, autoPlay, loop, preload, defaultMuted, defaultVolume: Number.isFinite(defaultVolume) ? Math.max(0, Math.min(1, defaultVolume)) : 1, nativeControls, videoRef: ref, onPlay, onPause, onEnded, onTimeUpdate, onError };
  return <div data-slot='video-player' className={cn('ds-video-player', className)} style={style}>
    {variant === 'dialog' ? <>
      <Pointer variant='label' label='Play' tracking='spring'>
        <Button ref={triggerRef} type='button' variant='ghost' tone='neutral' className='ds-video-poster' style={{ aspectRatio }} aria-label={`Play ${title}`} disabled={!src} onClick={() => setOpen(true)}>
          {poster && <img src={poster} alt='' style={{ objectFit: fit }} />}
          <span className='ds-video-play-mark' data-slot='video-play-mark'><Icon name='Play' decorative /></span>
          <span className='ds-video-poster-title'>{title}</span>
        </Button>
      </Pointer>
      <Dialog variant='bare' title={title} open={isOpen} onOpenChange={setOpen} initialFocusRef={closeRef} restoreFocusRef={triggerRef} className='ds-video-dialog'>
        <div className='ds-video-dialog-content'>
          <header><span>{title}</span><Control ref={closeRef} className='text-text-inverse hover:text-text-inverse focus-visible:outline-text-inverse' label='Close video' icon='X' onClick={() => setOpen(false)} /></header>
          <Playback key={src || 'empty'} {...props} variant='standard' />
        </div>
      </Dialog>
    </> : <Playback key={src || 'empty'} {...props} variant={variant} />}
  </div>;
}
