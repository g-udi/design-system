import { createRef, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { Map } from '../../../../src/components/core/Map/index.js';

const style = { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#dce7eb' } }] };
const view = { center: [0, 0], zoom: 4 };

export async function checkMapLifecycle(canvasElement) {
  const host = document.createElement('div');
  host.style.cssText = 'width:100%;max-width:390px';
  canvasElement.append(host);
  const root = createRoot(host);
  const ref = createRef();
  const requests = [];
  const marker = { id: 0, coordinates: [0, 0], label: 'Movable location' };
  const render = props => act(() => root.render(<StrictMode><Map ref={ref} mapStyle={style} initialViewState={view} markers={[marker]} selectedMarkerId={null} onMarkerClick={id => requests.push(id)} {...props} /></StrictMode>));
  try {
    await render({});
    const button = await within(host).findByRole('button', { name: 'Movable location' });
    expect(button.parentElement).not.toHaveAttribute('role');
    expect(button.parentElement).not.toHaveAttribute('tabindex');
    await userEvent.click(button);
    expect(requests).toEqual([0]);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    button.focus();
    const beforePosition = button.parentElement.style.transform;
    await render({ markers: [{ ...marker, coordinates: [.4, .2] }], selectedMarkerId: 0 });
    expect(within(host).getByRole('button', { name: 'Movable location' })).toBe(button);
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(button.parentElement.style.transform).not.toBe(beforePosition));
    await act(() => ref.current.flyTo({ center: [1, 1], zoom: 6 }));
    await waitFor(() => expect(ref.current.getViewState().zoom).toBeCloseTo(6), { timeout: 2000 });
    const canvas = host.querySelector('canvas');
    canvas.focus();
    // MapLibre reads the legacy native keyCode; testing-library leaves it at zero.
    await act(() => canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, bubbles: true, cancelable: true })));
    await waitFor(() => expect(ref.current.getViewState().center[0]).toBeGreaterThan(1));
    await render({ interactive: false });
    expect(host.querySelector('canvas')).toBe(canvas);
    expect(canvas.tabIndex).toBe(-1);
    expect(within(host).queryByRole('button', { name: 'Zoom in' })).toBeNull();
    expect(ref.current.getViewState().zoom).toBeCloseTo(6);
    await render({ mapStyle: { ...style, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#24282d' } }] } });
    expect(host.querySelector('canvas')).toBe(canvas);
    expect(ref.current.getViewState().zoom).toBeCloseTo(6);
    for (const density of [.75, .875, 1, 1.25, 1.5]) {
      await render({ style: { '--ds-space-scale': density } });
      await waitFor(() => expect(host.querySelector('.ds-map')).toHaveAttribute('data-map-status', 'ready'));
      expect(within(host).getAllByRole('button', { name: /Zoom in|Zoom out|Reset map view/ })).toHaveLength(3);
      expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth + 1);
      for (const control of host.querySelectorAll('.ds-map-controls button')) {
        const bounds = control.getBoundingClientRect();
        const container = host.getBoundingClientRect();
        expect(bounds.right).toBeLessThanOrEqual(container.right);
        expect(bounds.left).toBeGreaterThanOrEqual(container.left);
      }
    }
    await act(() => ref.current.fitBounds([[-1, -1], [1, 1]]));
    await waitFor(() => expect(Math.abs(ref.current.getViewState().center[0])).toBeLessThan(.01));
    await act(() => root.unmount());
    expect(host.querySelector('canvas')).toBeNull();
    expect(ref.current).toBeNull();
  } finally { if (ref.current) await act(() => root.unmount()); host.remove(); }
}

export async function checkTrackingMapDensity(canvasElement) {
  const { page, commands } = await import('vitest/browser');
  const root = document.documentElement;
  const previous = { width: innerWidth, height: innerHeight, scale: root.style.getPropertyValue('--ds-space-scale'), dark: root.classList.contains('dark') };
  const checks = [];
  try {
    for (const dark of [false, true]) {
      root.classList.toggle('dark', dark);
      for (const width of [320, 388, 389, 390, 768, 1440]) {
        await page.viewport(width, 900);
        for (const density of [.75, .875, 1, 1.25, 1.5]) {
          root.style.setProperty('--ds-space-scale', density);
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          await waitFor(() => expect(canvasElement.querySelector('.ds-map')).toHaveAttribute('data-map-status', 'ready'));
          expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width + 1);
          const map = canvasElement.querySelector('.ds-map').getBoundingClientRect();
          const controls = canvasElement.querySelectorAll('.ds-map-controls button');
          expect(controls.length).toBe(3);
          for (const control of controls) {
            const bounds = control.getBoundingClientRect();
            expect(bounds.left).toBeGreaterThanOrEqual(map.left);
            expect(bounds.right).toBeLessThanOrEqual(map.right);
            expect(bounds.bottom).toBeLessThanOrEqual(map.bottom);
          }
          checks.push({ width, density, theme: dark ? 'dark' : 'light' });
        }
      }
    }
    await commands.recordStoryAudit({ id: 'core-map--density', theme: 'both', checks, failures: [] });
  } finally {
    root.classList.toggle('dark', previous.dark);
    if (previous.scale) root.style.setProperty('--ds-space-scale', previous.scale);
    else root.style.removeProperty('--ds-space-scale');
    await page.viewport(previous.width, previous.height);
  }
}
