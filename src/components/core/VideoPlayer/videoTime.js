export function formatVideoTime(seconds) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor(value / 60) % 60;
  return `${hours ? `${hours}:` : ''}${String(minutes).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

export function videoSnapshot(video) {
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
  return {
    duration,
    currentTime: Math.min(duration, Math.max(0, video.currentTime || 0)),
    paused: video.paused,
    ended: video.ended,
    muted: video.muted,
    volume: video.volume,
    playbackRate: video.playbackRate,
    buffered: duration ? Array.from({ length: video.buffered.length }, (_, index) => ({
      start: Math.max(0, Math.min(100, video.buffered.start(index) / duration * 100)),
      end: Math.max(0, Math.min(100, video.buffered.end(index) / duration * 100))
    })) : []
  };
}
