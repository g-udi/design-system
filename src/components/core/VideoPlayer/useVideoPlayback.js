'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { videoSnapshot } from './videoTime.js';

const isCaption = track => track.kind === 'captions' || track.kind === 'subtitles';

export function useVideoPlayback({ autoPlay, defaultMuted, defaultVolume, onPlay, onPause, onEnded, onTimeUpdate, onError }) {
  const videoRef = useRef(null);
  const rootRef = useRef(null);
  const [state, setState] = useState({ duration: 0, currentTime: 0, paused: true, ended: false, muted: defaultMuted, volume: defaultVolume, playbackRate: 1, buffered: [] });
  const [notice, setNotice] = useState('');
  const [failed, setFailed] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [caption, setCaption] = useState('off');
  const [fullscreen, setFullscreen] = useState(false);
  const [pip, setPip] = useState(false);
  const [capabilities, setCapabilities] = useState({ fullscreen: false, pip: false });
  const callbacks = useLatestRef({ onPlay, onPause, onEnded, onTimeUpdate, onError });
  const alive = useRef(false);
  const request = useRef(0);

  const cancelRequest = useCallback(() => { ++request.current; }, []);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    const id = ++request.current;
    setNotice('');
    try { await video.play(); }
    catch (error) {
      if (alive.current && id === request.current && video === videoRef.current && error.name !== 'AbortError') {
        setNotice('Playback could not start. Try Play again.');
      }
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    alive.current = true;
    video.muted = defaultMuted;
    video.volume = defaultVolume;
    setCapabilities({ fullscreen: Boolean(document.fullscreenEnabled && rootRef.current?.requestFullscreen), pip: Boolean(document.pictureInPictureEnabled && video.requestPictureInPicture) });
    const sync = event => {
      setState(videoSnapshot(video));
      if (event?.type === 'playing' || event?.type === 'canplay' || video.paused) setWaiting(false);
      const callback = { play: 'onPlay', pause: 'onPause', ended: 'onEnded', timeupdate: 'onTimeUpdate' }[event?.type];
      if (callback) callbacks.current[callback]?.(event);
    };
    const error = event => { setFailed(true); setWaiting(false); callbacks.current.onError?.(event); };
    const wait = () => setWaiting(true);
    const captions = () => {
      const index = Array.from(video.textTracks).findIndex(track => isCaption(track) && track.mode === 'showing');
      setCaption(index < 0 ? 'off' : String(index));
    };
    const full = () => setFullscreen(document.fullscreenElement === rootRef.current);
    const picture = () => setPip(document.pictureInPictureElement === video);
    const events = ['loadedmetadata', 'durationchange', 'timeupdate', 'progress', 'play', 'playing', 'pause', 'ended', 'volumechange', 'ratechange', 'seeked', 'canplay'];
    events.forEach(name => video.addEventListener(name, sync));
    video.addEventListener('error', error);
    video.addEventListener('waiting', wait);
    video.textTracks.addEventListener('change', captions);
    video.addEventListener('enterpictureinpicture', picture);
    video.addEventListener('leavepictureinpicture', picture);
    document.addEventListener('fullscreenchange', full);
    sync();
    captions();
    if (video.error) error();
    if (autoPlay) play();
    return () => {
      alive.current = false;
      cancelRequest();
      events.forEach(name => video.removeEventListener(name, sync));
      video.removeEventListener('error', error);
      video.removeEventListener('waiting', wait);
      video.textTracks.removeEventListener('change', captions);
      video.removeEventListener('enterpictureinpicture', picture);
      video.removeEventListener('leavepictureinpicture', picture);
      document.removeEventListener('fullscreenchange', full);
      video.pause();
      if (document.pictureInPictureElement === video) document.exitPictureInPicture?.().catch(() => {});
    };
    // Initial playback preferences apply once to this source; media events own subsequent changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (video.paused || video.ended) play();
    else { cancelRequest(); video.pause(); }
  };
  const seek = value => {
    const video = videoRef.current;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    video.currentTime = Math.min(video.duration, Math.max(0, value));
    setState(videoSnapshot(video));
  };
  const volume = value => { const video = videoRef.current; video.volume = value; video.muted = value === 0; };
  const mute = () => {
    const video = videoRef.current;
    const unmute = video.muted || video.volume === 0;
    if (unmute && !video.volume) video.volume = defaultVolume || 1;
    video.muted = !unmute;
  };
  const chooseCaption = value => {
    Array.from(videoRef.current.textTracks).forEach((track, index) => {
      if (isCaption(track)) track.mode = String(index) === value ? 'showing' : 'disabled';
    });
    setCaption(value);
  };
  const display = async kind => {
    const video = videoRef.current;
    try {
      setNotice('');
      if (kind === 'fullscreen') {
        if (document.fullscreenElement === rootRef.current) await document.exitFullscreen();
        else await rootRef.current.requestFullscreen();
      } else if (document.pictureInPictureElement === video) await document.exitPictureInPicture();
      else await video.requestPictureInPicture();
    } catch {
      if (alive.current) setNotice(`${kind === 'fullscreen' ? 'Fullscreen' : 'Picture-in-picture'} is unavailable. You can keep watching here.`);
    }
  };
  const retry = () => { setFailed(false); setNotice(''); videoRef.current.load(); play(); };
  return { videoRef, rootRef, state, notice, failed, waiting, caption, fullscreen, pip, capabilities, toggle, seek, volume, mute, chooseCaption, display, retry };
}
