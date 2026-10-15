// Every browser API here is read lazily and guarded, so these helpers are safe to import and call
// during server rendering; they simply report "unsupported" there.

const hasWindow = () => typeof window !== 'undefined';

/** The Web Speech API recognition constructor, or null (Firefox, server rendering). */
export function getSpeechRecognition() {
  if (!hasWindow()) return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export const getAudioContext = () => (hasWindow() ? window.AudioContext || window.webkitAudioContext || null : null);

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
  if (!data?.length || !Number.isInteger(count) || count < 1) return [];
  const peaks = [];
  let max = 0;
  for (let i = 0; i < count; i += 1) {
    let peak = 0;
    const start = Math.floor(i * data.length / count);
    const end = Math.floor((i + 1) * data.length / count);
    for (let j = start; j < end; j += 1) peak = Math.max(peak, Math.abs(data[j]));
    peaks.push(peak);
    max = Math.max(max, peak);
  }
  return max ? peaks.map((peak) => Math.round((peak / max) * 1000) / 1000) : peaks;
}
