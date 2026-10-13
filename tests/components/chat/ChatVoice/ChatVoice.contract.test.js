import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatVoice/index.js', import.meta.url));
const voices = Array.from({ length: 10 }, (_, index) => ({ id: `voice-${index}`, name: `Voice ${index}`, provider: 'Studio', accent: 'British' }));
const render = (Component, props) => renderToStaticMarkup(h(Component, props));

test('ChatSpeechInput is a named, pressed-state button that stays disabled until capabilities are known', () => {
  assert.deepEqual(api.speechInputStates, [ 'idle', 'listening', 'processing' ]);
  const html = render(api.ChatSpeechInput, { onTranscript: () => {} });
  assert.match(html, /aria-label="Start voice input"/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /data-state="idle"/);
  assert.match(html, /disabled=""/);
  // State changes and errors are spoken through the shared live region, not a per-button status.
  assert.doesNotMatch(html, /role="status"/);
  assert.match(readFileSync(new URL('../../../../src/components/chat/ChatVoice/ChatSpeechInput.jsx', import.meta.url), 'utf8'), /useLiveAnnouncer\(\)/);
  assert.match(render(api.ChatSpeechInput, { labels: { start: 'Dictate' } }), /aria-label="Dictate"/);
});

test('voice helpers are safe on the server', () => {
  const support = api.voiceSupport();
  assert.equal(support.speech, false);
  assert.equal(support.media, false);
  assert.equal(api.getSpeechRecognition(), null);
  assert.equal(api.formatAudioTime(0), '0:00');
  assert.equal(api.formatAudioTime(75.4), '1:15');
  assert.equal(api.formatAudioTime(3725), '1:02:05');
  assert.deepEqual(api.computePeaks(new Float32Array([ 0, 0.5, -1, 0.25 ]), 2), [ 0.5, 1 ]);
  assert.deepEqual(api.computePeaks(null), []);
});

test('ChatMicSelector starts by asking for access and names its control', () => {
  const html = render(api.ChatMicSelector, {});
  assert.match(html, /data-slot="mic-selector"/);
  assert.match(html, />Microphone</);
  assert.match(html, /Allow microphone/);
});

test('waveform buckets include trailing samples and reject invalid bucket counts', () => {
  assert.deepEqual(api.computePeaks(new Float32Array([ 0, 0.25, 0, 0.5, -1 ]), 2), [ 0.25, 1 ]);
  assert.deepEqual(api.computePeaks(new Float32Array([ 0.5, -1 ]), 4), [ 0, 0.5, 0, 1 ]);
  for (const count of [ 0, -1, 1.5, Infinity, NaN ]) assert.deepEqual(api.computePeaks([ 1 ], count), []);
});

test('ChatVoiceSelector renders voices as one radio group with tags and sample buttons', () => {
  assert.equal('exampleVoices' in api, false);
  const html = render(api.ChatVoiceSelector, { voices: voices, defaultValue: 'voice-1', groupBy: 'provider', onPreview: () => Promise.resolve() });
  assert.match(html, /<fieldset[^>]*data-slot="voice-selector"/);
  assert.match(html, /<legend[^>]*>Voice<\/legend>/);
  assert.equal(html.match(/role="radio"/g).length, voices.length);
  assert.match(html, /role="radio" aria-checked="true"[^>]*value="voice-1"/);
  assert.match(html, /aria-label="Studio"/);
  assert.match(html, /aria-label="Play a sample of Voice 1"/);
  assert.match(html, /type="search"/, 'a long list is searchable');
  assert.deepEqual(api.voiceTags({ gender: 'female', accent: 'British', style: [ 'calm' ] }), [ 'Female', 'British', 'calm' ]);
  assert.doesNotMatch(render(api.ChatVoiceSelector, { voices: voices.slice(0, 2) }), /Play a sample/);
});

test('ChatAudioPlayer exposes play, a time slider, speed and download', () => {
  const html = render(api.ChatAudioPlayer, { src: '/reply.mp3', title: 'Reply', duration: 45, peaks: [ 0.2, 0.8, 0.5 ], download: 'reply.mp3' });
  assert.match(html, /aria-label="Play Reply"/);
  assert.match(html, /role="slider"[^>]*aria-label="Seek Reply"/);
  assert.match(html, /aria-valuetext="0:00 of 0:45"/);
  assert.equal(html.match(/ds-part-audio-player-bar/g).length, 3);
  assert.match(html, /aria-label="Playback speed 1×"/);
  assert.match(html, /download="reply.mp3"/);
  assert.match(render(api.ChatAudioPlayer, { src: '/a.mp3' }), /data-variant="bar"/);
});
