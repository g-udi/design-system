/*
 * Story-only stand-ins for browser media APIs, so the Voice examples run (and are tested) without a
 * real microphone, permission prompt or speech service. The fake microphone is a real MediaStream
 * from an oscillator with a syllable-like envelope, so level meters and orbs move as they would live.
 * Not exported from the package.
 */

const DEVICES = [
  { deviceId: 'default', groupId: 'built-in', label: 'Default – Built-in microphone' },
  { deviceId: 'studio-usb', groupId: 'usb', label: 'Studio USB microphone' },
  { deviceId: 'headset', groupId: 'bluetooth', label: 'Wireless headset' }
];

const PHRASE = 'Summarise my draft about the Sagrada Família in three short bullet points';

function fakeMicrophone() {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextCtor();
  const voice = context.createOscillator();
  const syllables = context.createOscillator();
  const envelope = context.createGain();
  const depth = context.createGain();
  const destination = context.createMediaStreamDestination();
  voice.type = 'sawtooth';
  voice.frequency.value = 150;
  syllables.frequency.value = 3.2;
  depth.gain.value = 0.35;
  envelope.gain.value = 0.35;
  syllables.connect(depth).connect(envelope.gain);
  voice.connect(envelope).connect(destination);
  voice.start();
  syllables.start();
  context.resume?.().catch(() => {});
  const stream = destination.stream;
  for (const track of stream.getTracks()) {
    const stop = track.stop.bind(track);
    track.stop = () => {
      stop();
      context.close().catch(() => {});
    };
  }
  return stream;
}

class FakeSpeechRecognition {
  constructor() {
    this.lang = 'en-US';
    this.continuous = false;
    this.interimResults = false;
    this.timers = [];
  }

  emit(transcript, isFinal) {
    this.heard = transcript;
    this.finished = isFinal;
    const result = Object.assign([ { transcript, confidence: 0.92 } ], { isFinal });
    this.onresult?.({ resultIndex: 0, results: [ result ] });
  }

  start() {
    const words = PHRASE.split(' ');
    words.forEach((_, index) => {
      this.timers.push(setTimeout(() => this.emit(words.slice(0, index + 1).join(' '), false), 120 * (index + 1)));
    });
    this.timers.push(setTimeout(() => this.emit(PHRASE, true), 120 * (words.length + 1)));
  }

  // Like the real service, stopping delivers what was heard so far as a final result.
  stop() {
    this.timers.forEach(clearTimeout);
    if (this.heard && !this.finished) this.emit(this.heard, true);
    setTimeout(() => this.onend?.(), 30);
  }

  abort() {
    this.timers.forEach(clearTimeout);
  }
}

/**
 * Installs the fakes and returns a cleanup that restores the real APIs. `speech: false` removes
 * speech recognition (to show the MediaRecorder path); `permission` starts as prompt or granted.
 */
export function installVoiceMocks({ speech = true, permission = 'prompt' } = {}) {
  let granted = permission === 'granted';
  const listeners = new Set();
  const mediaDevices = {
    getUserMedia: async () => {
      granted = true;
      return fakeMicrophone();
    },
    enumerateDevices: async () => DEVICES.map((device) => ({ ...device, kind: 'audioinput', label: granted ? device.label : '' })),
    addEventListener: (type, listener) => listeners.add(listener),
    removeEventListener: (type, listener) => listeners.delete(listener)
  };
  const permissions = { query: async () => ({ state: granted ? 'granted' : 'prompt', addEventListener() {}, removeEventListener() {} }) };
  const saved = {
    mediaDevices: Object.getOwnPropertyDescriptor(navigator, 'mediaDevices'),
    permissions: Object.getOwnPropertyDescriptor(navigator, 'permissions'),
    SpeechRecognition: window.SpeechRecognition,
    webkitSpeechRecognition: window.webkitSpeechRecognition
  };
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: mediaDevices });
  Object.defineProperty(navigator, 'permissions', { configurable: true, value: permissions });
  window.SpeechRecognition = speech ? FakeSpeechRecognition : undefined;
  window.webkitSpeechRecognition = speech ? FakeSpeechRecognition : undefined;
  return () => {
    for (const key of [ 'mediaDevices', 'permissions' ]) {
      if (saved[key]) Object.defineProperty(navigator, key, saved[key]);
      else delete navigator[key];
    }
    window.SpeechRecognition = saved.SpeechRecognition;
    window.webkitSpeechRecognition = saved.webkitSpeechRecognition;
  };
}

/**
 * A short, speech-like WAV (harmonics under a syllable envelope) as an object URL, with its
 * samples so the story can compute waveform peaks the way an app would after TTS.
 */
export function synthesizeReply(seconds = 6, rate = 16000) {
  const length = Math.round(seconds * rate);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const t = i / rate;
    const syllable = Math.max(0, Math.sin(Math.PI * 3.1 * t)) ** 0.6 * (0.55 + 0.45 * Math.sin(Math.PI * 0.37 * t + 1));
    const pitch = 130 + 25 * Math.sin(2 * Math.PI * 0.4 * t);
    const tone = Math.sin(2 * Math.PI * pitch * t) + 0.5 * Math.sin(4 * Math.PI * pitch * t) + 0.25 * Math.sin(6 * Math.PI * pitch * t);
    samples[i] = 0.3 * syllable * tone;
  }
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);
  const write = (offset, text) => [ ...text ].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  write(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, length * 2, true);
  for (let i = 0; i < length; i += 1) view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, samples[i])) * 0x7fff, true);
  return { url: URL.createObjectURL(new Blob([ buffer ], { type: 'audio/wav' })), samples, seconds };
}
