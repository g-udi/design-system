import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
import { formatVideoTime, videoSnapshot } from '../../../../src/components/core/VideoPlayer/videoTime.js';

test('video timestamps handle unknown, negative and hour-long durations', () => {
  for (const [input, output] of [[NaN, '00:00'], [Infinity, '00:00'], [-20, '00:00'], [0, '00:00'], [64.9, '01:04'], [3661, '1:01:01']]) assert.equal(formatVideoTime(input), output);
});

test('native snapshots disable unknown-duration seeking and clamp buffered regions', () => {
  const media = { duration: Infinity, currentTime: 42, paused: true, ended: false, muted: false, volume: 1, playbackRate: 1, buffered: { length: 2, start: index => index ? 50 : -1, end: index => index ? 101 : 25 } };
  assert.deepEqual(videoSnapshot(media).buffered, []);
  assert.equal(videoSnapshot(media).duration, 0);
  assert.equal(videoSnapshot(media).currentTime, 0);
  const snapshot = videoSnapshot({ ...media, duration: 100, currentTime: 105 });
  assert.equal(snapshot.currentTime, 100);
  assert.deepEqual(snapshot.buffered, [{ start: 0, end: 25 }, { start: 50, end: 100 }]);
});

test('players render deterministic, named controls and local text tracks during SSR', async () => {
  const { VideoPlayer } = await loadComponent(new URL('../../../../src/components/core/VideoPlayer/index.js', import.meta.url));
  const render = props => renderToStaticMarkup(createElement(VideoPlayer, { title: 'A film', src: '/film.webm', ...props }));
  for (const variant of ['standard', 'minimal']) {
    const html = render({ variant, tracks: [{ src: '/film.en.vtt', srcLang: 'en', label: 'English' }] });
    assert.match(html, /aria-label="A film player"/);
    assert.match(html, /aria-label="Seek video"/);
    assert.match(html, /<track kind="captions" src="\/film.en.vtt"/);
    assert.doesNotMatch(html, /NaN|Infinity|autoplay=""/);
  }
  const dialog = render({ variant: 'dialog', poster: '/poster.webp' });
  assert.match(dialog, /aria-label="Play A film"/);
  assert.doesNotMatch(dialog, /<video/);
  const native = render({ nativeControls: true });
  assert.match(native, /controls=""/);
  assert.doesNotMatch(native, /aria-label="Seek video"/);
  const empty = render({ src: '' });
  assert.match(empty, /No video selected/);
  assert.doesNotMatch(empty, /src=""/);
});
