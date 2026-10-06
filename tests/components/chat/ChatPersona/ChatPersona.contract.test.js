import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatPersona/index.js', import.meta.url));
const render = (props) => renderToStaticMarkup(h(api.ChatPersona, props));

test('ChatPersona names the assistant and its state, and announces changes politely', () => {
  assert.deepEqual(api.personaStates, [ 'idle', 'connecting', 'listening', 'thinking', 'speaking', 'asleep', 'error' ]);
  const html = render({ name: 'Gaudi', state: 'listening' });
  assert.match(html, /role="img"[^>]*aria-label="Gaudi: Listening"/);
  assert.match(html, /role="status"[^>]*aria-live="polite"[^>]*>Gaudi listening</);
  const quiet = render({ state: 'thinking', decorative: true });
  assert.doesNotMatch(quiet, /role="img"|role="status"/);
  assert.match(render({ state: 'nonsense' }), /data-state="idle"/);
});

test('every variant renders on the server without touching browser APIs', () => {
  assert.deepEqual(api.personaVariants, [ 'iridescent', 'mercury', 'waveform', 'activity', 'circle', 'bars', 'cloud', 'radial' ]);
  for (const variant of api.personaVariants) {
    const html = render({ variant, state: 'speaking', size: 'sm', level: 0.4 });
    assert.match(html, new RegExp(`data-orb="${variant}"`), variant);
    assert.match(html, /width:48px/, `${variant} uses the sm size`);
  }
  // Asleep is the still, dimmed orb state.
  assert.match(render({ variant: 'activity', state: 'asleep' }), /data-orb="activity" data-state="disabled"/);
  assert.match(render({ variant: 'mercury', size: 64 }), /width:64px/);
  // orb-ui styles: five bars, a disc, and shader fields that render a CSS fallback on the server.
  assert.equal(render({ variant: 'bars' }).match(/ds-part-voice-bar"/g)?.length, 5);
  assert.match(render({ variant: 'circle', state: 'error' }), /ds-part-voice-circle-disc/);
  for (const variant of [ 'cloud', 'radial' ]) assert.match(render({ variant }), new RegExp(`data-orb="${variant}"[^>]*data-renderer="css"`));
});

test('orbs keep source attribution and stop for reduced motion', () => {
  const license = readFileSync(new URL('../../../../src/components/chat/ChatPersona/orbs/LICENSE', import.meta.url), 'utf8');
  for (const holder of [ 'Alexis Munoz', 'Jakub Antalik', 'Alexander Chen' ]) assert.match(license, new RegExp(`MIT License\\s+Copyright \\(c\\) 2026 ${holder}`));
  const readme = readFileSync(new URL('../../../../src/components/chat/ChatPersona/README.md', import.meta.url), 'utf8');
  for (const source of [ 'VoiceOrbs', 'Thinking Orbs', 'orb-ui' ]) assert.match(readme, new RegExp(source));
  assert.doesNotMatch(readme, /thinking-orbs|AI SDK Elements/);
  const css = readFileSync(new URL('../../../../src/components/chat/ChatPersona/ChatPersona.css', import.meta.url), 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce/);
  for (const orb of [ 'iridescent-flow', 'mercury-orb', 'waveform-ring', 'activity-orb', 'circle-orb', 'bars-orb', 'field-orb' ]) {
    const source = readFileSync(new URL(`../../../../src/components/chat/ChatPersona/orbs/${orb}.jsx`, import.meta.url), 'utf8');
    assert.match(source, /prefersReducedMotion\(\)/, `${orb} checks reduced motion`);
    assert.match(source, /observeActivity\(/, `${orb} pauses off screen`);
  }
});
