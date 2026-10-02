import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props) => renderToStaticMarkup(h(Component, props));

test('SpeechInput is a named, pressed-state button that stays disabled until capabilities are known', () => {
  assert.deepEqual(api.speechInputStates, [ 'idle', 'listening', 'processing' ]);
  const html = render(api.SpeechInput, { onTranscript: () => {} });
  assert.match(html, /aria-label="Start voice input"/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /data-state="idle"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /role="status"/);
  assert.match(render(api.SpeechInput, { labels: { start: 'Dictate' } }), /aria-label="Dictate"/);
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

test('MicSelector starts by asking for access and names its control', () => {
  const html = render(api.MicSelector, {});
  assert.match(html, /data-slot="mic-selector"/);
  assert.match(html, />Microphone</);
  assert.match(html, /Allow microphone/);
});

test('VoiceSelector renders voices as one radio group with tags and sample buttons', () => {
  assert.ok(api.exampleVoices.length >= 10);
  const html = render(api.VoiceSelector, { voices: api.exampleVoices, defaultValue: 'openai-nova', groupBy: 'provider', onPreview: () => Promise.resolve() });
  assert.match(html, /<fieldset[^>]*data-slot="voice-selector"/);
  assert.match(html, /<legend[^>]*>Voice<\/legend>/);
  assert.equal(html.match(/type="radio"/g).length, api.exampleVoices.length);
  assert.match(html, /checked="" value="openai-nova"/);
  assert.match(html, /aria-label="OpenAI"/);
  assert.match(html, /aria-label="Play a sample of Nova"/);
  assert.match(html, /type="search"/, 'a long list is searchable');
  assert.deepEqual(api.voiceTags({ gender: 'female', accent: 'British', style: [ 'calm' ] }), [ 'Female', 'British', 'calm' ]);
  assert.doesNotMatch(render(api.VoiceSelector, { voices: api.exampleVoices.slice(0, 2) }), /Play a sample/);
});

test('AudioPlayer exposes play, a time slider, speed and download', () => {
  const html = render(api.AudioPlayer, { src: '/reply.mp3', title: 'Reply', duration: 45, peaks: [ 0.2, 0.8, 0.5 ], download: 'reply.mp3' });
  assert.match(html, /aria-label="Play Reply"/);
  assert.match(html, /role="slider"[^>]*aria-label="Seek Reply"/);
  assert.match(html, /aria-valuetext="0:00 of 0:45"/);
  assert.equal(html.match(/ds-part-audio-player-bar/g).length, 3);
  assert.match(html, /aria-label="Playback speed 1×"/);
  assert.match(html, /download="reply.mp3"/);
  assert.match(render(api.AudioPlayer, { src: '/a.mp3' }), /data-variant="bar"/);
});
