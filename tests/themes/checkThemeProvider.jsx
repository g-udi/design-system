import { Component } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, waitFor } from 'storybook/test';
import { ThemeProvider, useTheme, themePresets, applyTheme } from '../../src/themes/index.js';
import { act } from '../support/reactAct.js';

class ThemeErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() { return this.state.error ? <p>Theme failed</p> : this.props.children; }
}

/** Exercise persistence and CSS in a real document, then restore the host's theme. */
export async function checkThemeProvider(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const html = document.documentElement;
  const previous = ['data-theme', 'data-audit-palette', 'class', 'style'].map(name => [name, html.getAttribute(name)]);
  const caught = [];
  const root = createRoot(host, { onCaughtError: error => caught.push(error) });
  let context;
  const Probe = () => { context = useTheme(); return <p>{context.theme}</p>; };
  const stored = new Map([
    ['audit-theme', 'broken'],
    ['audit-theme-custom', JSON.stringify({ id: 'broken' })]
  ]);
  const storage = {
    getItem: key => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
    removeItem: key => stored.delete(key)
  };
  try {
    await act(() => root.render(<ThemeErrorBoundary>
      <ThemeProvider storage={storage} storageKey='audit-theme' enableMode={false}><Probe /></ThemeProvider>
    </ThemeErrorBoundary>));
    await expect(caught).toEqual([]);
    await waitFor(() => expect(context.theme).toBe('gaudi'));
    await expect(host).toHaveTextContent('gaudi');

    const custom = { ...themePresets.find(theme => theme.id === 'folio'), id: 'audit-custom' };
    stored.set('audit-theme', custom.id);
    stored.set('audit-theme-custom', JSON.stringify(custom));
    await act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'audit-theme' })));
    await waitFor(() => expect(context.theme).toBe(custom.id));
    await expect(html).toHaveAttribute('data-theme', custom.id);
    await expect(getComputedStyle(html).getPropertyValue('--ds-radius').trim()).toBe('2px');

    stored.set('audit-theme', 'removed-theme');
    await act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'audit-theme' })));
    await waitFor(() => expect(context.theme).toBe('gaudi'));

    await act(() => root.render(<ThemeProvider storage={null} defaultTheme='folio' defaultMode='dark'
      attribute='data-audit-palette' darkClass='audit-dark'><Probe /></ThemeProvider>));
    await waitFor(() => expect(html).toHaveAttribute('data-audit-palette', 'folio'));
    const folio = themePresets.find(theme => theme.id === 'folio');
    await expect(getComputedStyle(html).getPropertyValue('--ds-color-surface').trim()).toBe(folio.dark.surface);

    const renderWithoutStorage = () => act(() => root.render(<ThemeProvider key='no-storage'
      themes={themePresets.slice()} storage={null} defaultMode='light'><Probe /></ThemeProvider>));
    await renderWithoutStorage();
    await act(() => { context.setTheme('folio'); context.setMode('dark'); });
    await renderWithoutStorage();
    await expect(context.theme).toBe('folio');
    await expect(context.mode).toBe('dark');

    await act(() => root.render(null));
    applyTheme(themePresets.find(theme => theme.id === 'gaudi'), { darkClass: 'old-dark-mode' });
    await act(() => root.render(<ThemeProvider storage={null} defaultMode='dark'><Probe /></ThemeProvider>));
    await expect(document.querySelector('style[data-gaudi-theme="gaudi"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
    host.remove();
    for (const [name, value] of previous) {
      if (value === null) html.removeAttribute(name);
      else html.setAttribute(name, value);
    }
  }
}
