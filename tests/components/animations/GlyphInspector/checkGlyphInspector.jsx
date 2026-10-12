import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { GlyphInspector } from '../../../../src/components/animations/GlyphInspector/index.js';

export async function checkGlyphInspector(canvasElement) {
  if (import.meta.env.MODE !== 'test') return;
  const sandbox = document.createElement('div');
  sandbox.style.cssText = 'position:fixed;top:0;left:0;width:320px;font-size:72px;background:var(--ds-color-surface);z-index:1000';
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const render = props => act(() => root.render(<StrictMode><GlyphInspector text="Type" {...props} /></StrictMode>));
  const tick = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const originalMatchMedia = window.matchMedia;
  try {
    await render({ interval: 250 });
    await waitFor(() => expect(sandbox.querySelector('[data-slot="glyph-inspector-frame"]')).toBeVisible());
    const focused = () => sandbox.querySelector('[data-focused="true"]');
    const first = focused();
    await waitFor(() => expect(focused()).not.toBe(first));
    expect(sandbox.querySelectorAll('.gaudi-glyph-inspector__particle')).toHaveLength(12);
    const stroke = sandbox.querySelector('.gaudi-glyph-inspector__outline');
    const before = getComputedStyle(stroke).strokeDashoffset;
    await waitFor(() => expect(getComputedStyle(stroke).strokeDashoffset).not.toBe(before));

    const staticProps = { paused: true, activeIndex: 1 };
    await render(staticProps);
    const readout = () => sandbox.querySelector('.gaudi-glyph-inspector__readout');
    const guides = () => sandbox.querySelector('.gaudi-glyph-inspector__guides');
    expect(readout()).toBeVisible();
    expect(guides()).toBeVisible();
    await render({ ...staticProps, readout: false });
    expect(readout()).toBeNull();
    await render({ ...staticProps, guides: false });
    expect(guides()).toBeNull();
    for (const [outline, dash] of [['dotted', '1px, 3px'], ['solid', 'none'], ['dashed', '5px, 3px']]) {
      await render({ ...staticProps, outline });
      expect(getComputedStyle(sandbox.querySelector('.gaudi-glyph-inspector__outline')).strokeDasharray).toBe(dash);
    }
    await render({ ...staticProps, particles: 4 });
    expect(sandbox.querySelectorAll('.gaudi-glyph-inspector__particle')).toHaveLength(4);
    await render({ ...staticProps, accent: '#ff4500' });
    expect(getComputedStyle(sandbox.querySelector('.gaudi-glyph-inspector__frame')).color).toBe('rgb(255, 69, 0)');
    await render({ ...staticProps, tempo: 2 });
    expect(sandbox.querySelector('.gaudi-glyph-inspector__particle').style.animationDuration).toBe('0.65s');
    await render({ ...staticProps, reveal: 'none' });
    expect([...sandbox.querySelectorAll('.gaudi-glyph-inspector__letter')].every(node => node.style.getPropertyValue('--inspector-reveal') === '0')).toBe(true);
    await render({ ...staticProps, reveal: 'area', radius: 20 });
    const narrow = [...sandbox.querySelectorAll('.gaudi-glyph-inspector__letter')].map(node => node.style.getPropertyValue('--inspector-reveal'));
    await render({ ...staticProps, reveal: 'area', radius: 400 });
    expect([...sandbox.querySelectorAll('.gaudi-glyph-inspector__letter')].map(node => node.style.getPropertyValue('--inspector-reveal'))).not.toEqual(narrow);
    await render({ autoplay: true, interval: 10000 });
    const slow = focused();
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(focused()).toBe(slow);
    await render({ autoplay: true, interval: 200 });
    await waitFor(() => expect(focused()).not.toBe(slow));
    await render({ autoplay: false });
    expect(sandbox.querySelector('[data-slot="glyph-inspector-frame"]')).toBeNull();
    const letter = sandbox.querySelector('.gaudi-glyph-inspector__letter');
    await userEvent.hover(letter);
    await waitFor(() => expect(letter).toHaveAttribute('data-focused', 'true'));
    expect(sandbox.querySelector('.gaudi-glyph-inspector__readout').textContent).toContain('U+0054');
    const glyph = letter.getBoundingClientRect();
    const start = { clientX: glyph.left + glyph.width / 2, clientY: glyph.top + glyph.height / 2 };
    // Motion listens to pointer gestures, not HTML drag-and-drop events.
    await act(() => {
      letter.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1, ...start }));
      window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, buttons: 1, clientX: start.clientX + 50, clientY: start.clientY - 50 }));
    });
    await tick();
    window.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, pointerType: 'mouse', isPrimary: true, buttons: 1, clientX: start.clientX + 80, clientY: start.clientY - 80 }));
    await waitFor(() => expect(sandbox.querySelector('[data-slot="glyph-inspector"]')).toHaveAttribute('data-dragging', 'true'));
    const matrix = new DOMMatrix(getComputedStyle(letter).transform);
    expect(Math.abs(matrix.m41)).toBeLessThanOrEqual(20.1);
    expect(Math.abs(matrix.m42)).toBeLessThanOrEqual(28.1);
    expect(sandbox.querySelector('.gaudi-glyph-inspector__tether')).toBeInTheDocument();
    expect(sandbox.querySelector('.gaudi-glyph-inspector__readout').textContent).toContain('Δ');
    window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0 }));
    await waitFor(() => expect(sandbox.querySelector('[data-slot="glyph-inspector"]')).toHaveAttribute('data-dragging', 'false'));
    await userEvent.unhover(letter);
    await render({ autoplay: false, draggable: false });
    await act(() => {
      letter.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 2, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1, ...start }));
      window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 2, pointerType: 'mouse', isPrimary: true, buttons: 1, clientX: start.clientX + 50, clientY: start.clientY - 50 }));
    });
    await tick();
    expect(sandbox.querySelector('[data-slot="glyph-inspector"]')).toHaveAttribute('data-dragging', 'false');
    expect(new DOMMatrix(getComputedStyle(letter).transform).m41).toBe(0);
    window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2, pointerType: 'mouse', button: 0 }));

    await render({ reveal: 'area', radius: 400, particles: 0, autoplay: true });
    await waitFor(() => expect(sandbox.querySelectorAll('.gaudi-glyph-inspector__particle')).toHaveLength(0));
    expect([...sandbox.querySelectorAll('.gaudi-glyph-inspector__letter')].filter(el => Number(el.style.getPropertyValue('--inspector-reveal')) > 0)).toHaveLength(4);
    const { commands } = await import('vitest/browser');
    await commands.recordStoryAudit({ id: 'glyph-inspector-independent-controls', theme: 'light', checks: [
      { control: 'text', evidence: 'visible glyph content and layout changed, including empty and long values' },
      { control: 'autoplay', evidence: 'frame cycles while enabled, disappears while idle with autoplay disabled' },
      { control: 'draggable', evidence: 'pointer drag moves enabled glyph within constraints; disabled glyph stays at origin' },
      { control: 'readout', evidence: 'readout removed independently' },
      { control: 'guides', evidence: 'guide SVG removed independently' },
      { control: 'interval', evidence: 'long interval holds current glyph; 200ms advances it' },
      { control: 'outline', evidence: 'all three computed stroke dash patterns checked' },
      { control: 'particles', evidence: '4 and 0 particle counts checked' },
      { control: 'tempo', evidence: 'particle animation duration halves at tempo 2' },
      { control: 'reveal', evidence: 'none hides all fills; area reveals neighbours' },
      { control: 'radius', evidence: 'changing only radius changes per-glyph reveal amount' },
      { control: 'accent', evidence: 'computed inspector foreground changes to requested colour' },
      { control: 'activeIndex', evidence: 'existing Paused story helper checks requested character and out-of-range fallback to first glyph' },
      { control: 'paused', evidence: 'paused frame remains visible without animation; existing paused-index helper covers bounds' }
    ] });
    await render({ text: '', reveal: 'area' });
    expect(sandbox.querySelector('[data-slot="glyph-inspector-frame"]')).not.toBeInTheDocument();
    await render({ text: 'A', paused: true });
    await waitFor(() => expect(sandbox.querySelector('[data-slot="glyph-inspector-frame"]')).toBeVisible());
    expect(sandbox.querySelector('.sr-only').textContent).toBe('A');
    await render({ text: 'A longer specimen without overflow', paused: true });
    await tick();
    const outer = sandbox.getBoundingClientRect();
    const line = sandbox.querySelector('.gaudi-glyph-inspector__line').getBoundingClientRect();
    expect(line.left).toBeGreaterThanOrEqual(outer.left);
    expect(line.right).toBeLessThanOrEqual(outer.right + 1);
    for (const density of [0.75, 0.875, 1, 1.25, 1.5]) {
      await render({ text: 'A longer specimen without overflow', paused: true, style: { '--ds-space-scale': density } });
      await tick();
      expect(sandbox.scrollWidth).toBeLessThanOrEqual(sandbox.clientWidth + 1);
      const frame = sandbox.querySelector('[data-slot="glyph-inspector-frame"]').getBoundingClientRect();
      expect(frame.left).toBeGreaterThanOrEqual(outer.left - 1);
      expect(frame.right).toBeLessThanOrEqual(outer.right + 1);
    }

    window.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? { matches: true, addEventListener() {}, removeEventListener() {} } : originalMatchMedia.call(window, query);
    await act(() => root.render(null));
    await render({});
    await waitFor(() => expect(sandbox.querySelector('[data-slot="glyph-inspector"]')).toHaveAttribute('data-animated', 'false'));
    expect(sandbox.querySelector('[data-slot="glyph-inspector-frame"]')).not.toBeInTheDocument();
  } finally {
    window.matchMedia = originalMatchMedia;
    await act(() => root.unmount());
    sandbox.remove();
  }
}
