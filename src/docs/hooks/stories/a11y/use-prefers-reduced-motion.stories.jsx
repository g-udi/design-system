import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { Preference, RotatingQuote } from './fixtures/use-prefers-reduced-motion.jsx';
import exampleCode from './fixtures/use-prefers-reduced-motion.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-prefers-reduced-motion.jsx', import.meta.url));

export default {
  title: 'Hooks/A11y/usePrefersReducedMotion',
  id: 'hooks-a11y-useprefersreducedmotion',
  tags: ['autodocs'],
  ...hookMeta('usePrefersReducedMotion')
};

export const Reading = {
  name: 'Read the preference',
  parameters: example('The value follows the system setting live.', exampleSource),
  render: () => <Preference />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const { commands } = await import('vitest/browser');
    const readout = within(canvasElement).getByText('Reduce motion:').parentElement;
    try {
      for (const reduced of [true, false, true]) {
        await commands.emulateStoryMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
        await waitFor(() => expect(readout).toHaveTextContent(`Reduce motion: ${reduced}`));
      }
    } finally { await commands.emulateStoryMedia({ reducedMotion: null }); }
  }
};

export const AutoplayOff = {
  name: 'Turn autoplay off',
  parameters: example('Rotating content stops when motion should be reduced, and always keeps a manual control and a pause button.', exampleSource),
  render: () => <RotatingQuote />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const { commands } = await import('vitest/browser');
    const canvas = within(canvasElement);
    const quote = canvasElement.querySelector('blockquote');
    try {
      await commands.emulateStoryMedia({ reducedMotion: 'reduce' });
      await waitFor(() => expect(canvas.getByText('Autoplay off: reduced motion')).toBeVisible());
      const before = quote.textContent;
      await new Promise(resolve => setTimeout(resolve, 4100));
      await expect(quote).toHaveTextContent(before);
      await userEvent.click(canvas.getByRole('button', { name: 'Next quote' }));
      await expect(quote.textContent).not.toBe(before);
      const manual = quote.textContent;
      await commands.emulateStoryMedia({ reducedMotion: 'no-preference' });
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible());
      await waitFor(() => expect(quote.textContent).not.toBe(manual), { timeout: 5000 });
      await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
      await expect(canvas.getByRole('button', { name: 'Resume' })).toHaveAttribute('aria-pressed', 'true');
      await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
    } finally { await commands.emulateStoryMedia({ reducedMotion: null }); }
  }
};
