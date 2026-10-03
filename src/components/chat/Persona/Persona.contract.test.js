import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (props) => renderToStaticMarkup(h(api.Persona, props));

test('Persona names the assistant and its state, and announces changes politely', () => {
  assert.deepEqual(api.personaStates, [ 'idle', 'connecting', 'listening', 'thinking', 'speaking', 'asleep', 'error' ]);
  const html = render({ name: 'Gaudi', state: 'listening' });
  assert.match(html, /role="img"[^>]*aria-label="Gaudi: Listening"/);
  assert.match(html, /role="status"[^>]*aria-live="polite"[^>]*>Gaudi listening</);
  const quiet = render({ state: 'thinking', decorative: true });
  assert.doesNotMatch(quiet, /role="img"|role="status"/);
  assert.match(render({ state: 'nonsense' }), /data-state="idle"/);
});

test('every variant renders on the server without touching browser APIs', () => {
  assert.deepEqual(api.personaVariants, [ 'iridescent', 'mercury', 'waveform', 'activity' ]);
  for (const variant of api.personaVariants) {
    const html = render({ variant, state: 'speaking', size: 'sm', level: 0.4 });
    assert.match(html, new RegExp(`data-orb="${variant}"`), variant);
    assert.match(html, /width:48px/, `${variant} uses the sm size`);
  }
  // Asleep is the still, dimmed orb state.
  assert.match(render({ variant: 'activity', state: 'asleep' }), /data-orb="activity" data-state="disabled"/);
  assert.match(render({ variant: 'mercury', size: 64 }), /width:64px/);
});

test('orbs keep source attribution and stop for reduced motion', () => {
  const license = readFileSync(new URL('./parts/orbs/LICENSE', import.meta.url), 'utf8');
  assert.match(license, /MIT License[\s\S]*Alexis Munoz/);
  const readme = readFileSync(new URL('./README.md', import.meta.url), 'utf8');
  assert.match(readme, /VoiceOrbs/);
  assert.doesNotMatch(readme, /thinking-orbs|AI SDK Elements/);
  const css = readFileSync(new URL('./Persona.css', import.meta.url), 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce/);
  for (const orb of [ 'iridescent-flow', 'mercury-orb', 'waveform-ring', 'activity-orb' ]) {
    const source = readFileSync(new URL(`./parts/orbs/${orb}.jsx`, import.meta.url), 'utf8');
    assert.match(source, /prefersReducedMotion\(\)/, `${orb} checks reduced motion`);
    assert.match(source, /observeActivity\(/, `${orb} pauses off screen`);
  }
});
