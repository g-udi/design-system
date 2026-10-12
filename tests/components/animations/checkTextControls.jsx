import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor } from 'storybook/test';
import { act } from '../../support/reactAct.js';
import { Typewriter, CipherReveal, PhraseCycle, WordSpotlight } from '../../../src/components/animations/index.js';

const delay = ms => act(() => new Promise(resolve => setTimeout(resolve, ms)));

async function inspect(canvasElement, Component, run) {
  if (import.meta.env.MODE !== 'test') return;
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;top:0;left:0;width:320px;font-size:32px;z-index:1000';
  canvasElement.append(host);
  const root = createRoot(host);
  const checks = [];
  const render = props => act(() => root.render(createElement(Component, props)));
  const fresh = async props => { await act(() => root.render(null)); await render(props); };
  const record = (control, evidence) => checks.push({ control, evidence });
  try { await run({ host, render, fresh, record }); }
  finally {
    await act(() => root.unmount()); host.remove();
    const { commands } = await import('vitest/browser');
    await commands.recordStoryAudit({ id: `${Component.displayName || Component.render?.name || Component.name}-independent-controls`, theme: 'light', checks });
  }
}

export const checkTypewriterControls = canvasElement => inspect(canvasElement, Typewriter, async ({ host, render, fresh, record }) => {
  const base = { texts: ['AB'], typeDelay: 1000, holdDelay: 1000, eraseDelay: 1000, caret: false, repeat: true };
  const value = () => host.querySelector('.gaudi-typewriter__value').textContent;
  await fresh(base);
  await delay(100);
  expect(value()).toBe('');
  await render({ ...base, typeDelay: 16 });
  await waitFor(() => expect(value()).toBe('AB'), { timeout: 500 });
  record('typeDelay', 'slow type remains empty; changing only typeDelay types both characters');
  await delay(150);
  expect(value()).toBe('AB');
  await render({ ...base, typeDelay: 16, holdDelay: 100 });
  await delay(150);
  expect(value()).toBe('AB');
  await render({ ...base, typeDelay: 16, holdDelay: 100, eraseDelay: 16 });
  await waitFor(() => expect(value()).not.toBe('AB'), { timeout: 500 });
  record('holdDelay', 'short hold advances to erase phase while long hold retains full text');
  record('eraseDelay', 'changing only eraseDelay starts visible erasure after the hold');
  await fresh({ ...base, typeDelay: 16, repeat: false, holdDelay: 100, eraseDelay: 16 });
  await waitFor(() => expect(value()).toBe('AB'));
  await delay(250);
  expect(value()).toBe('AB');
  await render({ ...base, typeDelay: 16, repeat: true, holdDelay: 100, eraseDelay: 16 });
  await waitFor(() => expect(value()).not.toBe('AB'));
  record('repeat', 'completed one-shot stays still; enabling repeat resumes erasure');
  await fresh({ ...base, paused: true });
  expect(value()).toBe('AB');
  await render({ ...base, paused: true, texts: ['New text'] });
  expect(value()).toBe('New text'); record('texts', 'visible text changes');
  await render({ ...base, paused: true, caret: true });
  expect(host.querySelector('.gaudi-typewriter__cursor')).toBeVisible(); record('caret', 'cursor appears');
  await fresh({ ...base, typeDelay: 60 });
  await waitFor(() => expect(value()).toBe('A'));
  await render({ ...base, typeDelay: 60, paused: true });
  const frozen = value(); await delay(200); expect(value()).toBe(frozen);
  record('paused', 'partial text remains unchanged through multiple type intervals');
});

export const checkCipherControls = canvasElement => inspect(canvasElement, CipherReveal, async ({ host, render, fresh, record }) => {
  const base = { text: 'ABCDEFGH', duration: 1500, direction: 'start', characterSet: '@', trigger: 'hover' };
  const effect = () => host.querySelector('[data-slot="cipher-reveal"]');
  const value = () => effect().querySelector('[aria-hidden]').textContent;
  await fresh(base);
  expect(value()).toBe(base.text);
  await userEvent.hover(effect());
  await waitFor(() => expect(value()).toContain('@'));
  record('trigger', 'hover mode waits until pointer entry before scrambling');
  await delay(250);
  expect(value().startsWith('A')).toBe(true);
  await render({ ...base, direction: 'end' });
  expect(value().endsWith('H')).toBe(true);
  expect(value().startsWith('@')).toBe(true);
  await render({ ...base, direction: 'center' });
  expect(value()).toContain('DE'); record('direction', 'same progress reveals start, end and center glyphs');
  await render({ ...base, characterSet: '#' });
  expect(value()).toContain('#'); expect(value()).not.toContain('@'); record('characterSet', 'unrevealed glyphs use the replacement alphabet');
  await render({ ...base, duration: 100 });
  await waitFor(() => expect(value()).toBe(base.text), { timeout: 500 }); record('duration', 'shortened duration finishes within 500ms');
  await render({ ...base, trigger: 'view', text: 'New text' });
  expect(host.querySelector('.sr-only')).toHaveTextContent('New text');
  await waitFor(() => expect(value()).toContain('@')); record('text', 'new text updates accessible value and restarts visible reveal');
  await render({ ...base, paused: true });
  expect(value()).toBe(base.text); await delay(100); expect(value()).toBe(base.text); record('paused', 'settles to readable text and stops scrambling');
});

export const checkPhraseControls = canvasElement => inspect(canvasElement, PhraseCycle, async ({ host, render, fresh, record }) => {
  const base = { texts: ['First', 'Next'], interval: 10000 };
  const value = () => host.querySelector('.gaudi-phrase-cycle__value');
  await fresh(base);
  await delay(750); expect(value()).toHaveTextContent('First');
  await render({ ...base, interval: 700 });
  await waitFor(() => expect(value()).toHaveTextContent('Next'), { timeout: 1300 }); record('interval', 'shorter interval advances the phrase while long interval holds');
  await render({ ...base, paused: true });
  const frozen = value().textContent; await delay(800); expect(value()).toHaveTextContent(frozen); record('paused', 'phrase remains unchanged');
  await render({ ...base, texts: ['Replacement'], paused: true });
  expect(value()).toHaveTextContent('Replacement'); record('texts', 'visible phrase and reserved text update');
  await fresh({ ...base, direction: 'up' });
  const up = value().getAnimations()[0].effect.getKeyframes()[0].transform;
  await fresh({ ...base, direction: 'down' });
  const down = value().getAnimations()[0].effect.getKeyframes()[0].transform;
  expect(up).not.toBe(down); record('direction', 'computed entrance animation starts on the opposite vertical side');
});

export const checkSpotlightControls = canvasElement => inspect(canvasElement, WordSpotlight, async ({ host, render, fresh, record }) => {
  const base = { text: 'First Next', interval: 10000, blur: 4 };
  const focused = () => host.querySelector('[data-focused="true"]').textContent;
  await fresh(base);
  await delay(450); expect(focused()).toBe('First');
  await render({ ...base, interval: 400 });
  await waitFor(() => expect(focused()).toBe('Next')); record('interval', 'changing interval advances focus');
  await render({ ...base, paused: true });
  const frozen = focused(); await delay(450); expect(focused()).toBe(frozen); record('paused', 'focused word stops cycling');
  await render({ ...base, paused: true, blur: 0 });
  await waitFor(() => expect(getComputedStyle(host.querySelector('[data-focused="false"]')).filter).toBe('blur(0px)'));
  record('blur', 'unfocused word loses its computed blur');
  await render({ ...base, paused: true, text: 'Changed content here' });
  expect([...host.querySelectorAll('.gaudi-word-spotlight__word')].map(node => node.textContent)).toEqual(['Changed', 'content', 'here']); record('text', 'all visible words update');
});
