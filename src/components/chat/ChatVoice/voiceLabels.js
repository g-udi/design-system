// Server-safe default copy, states and tags for the voice components.

export const speechInputLabels = {
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

export const micSelectorLabels = {
  label: 'Microphone',
  placeholder: 'Choose a microphone',
  allow: 'Allow microphone',
  prompt: 'Allow access to list your microphones by name.',
  denied: 'Microphone access is blocked. Allow it in your browser’s site settings, then try again.',
  unsupported: 'This browser cannot list microphones.',
  empty: 'No microphone found. Connect one, then refresh.',
  refresh: 'Refresh microphones',
  test: 'Test microphone',
  stopTest: 'Stop test',
  level: 'Input level',
  retry: 'Try again'
};

export const voiceSelectorLabels = {
  label: 'Voice',
  search: 'Search voices',
  empty: 'No voice matches that search.',
  play: 'Play a sample of',
  stop: 'Stop the sample of',
  loading: 'Loading the sample of',
  previewFailed: 'The sample could not play.'
};

export const audioPlayerLabels = {
  play: 'Play',
  pause: 'Pause',
  seek: 'Seek',
  speed: 'Playback speed',
  download: 'Download',
  error: 'This audio could not be played.',
  of: 'of'
};

export const speechInputStates = [ 'idle', 'listening', 'processing' ];

const GENDER = { female: 'Female', male: 'Male', neutral: 'Neutral', 'non-binary': 'Non-binary' };

export const voiceTags = (voice) => [
  voice.gender ? GENDER[voice.gender] ?? voice.gender : null,
  voice.accent,
  voice.age,
  ...(Array.isArray(voice.style) ? voice.style : voice.style ? [ voice.style ] : [])
].filter(Boolean);
