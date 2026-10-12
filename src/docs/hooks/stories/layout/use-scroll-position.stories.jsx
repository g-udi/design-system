import { expect, userEvent, waitFor, within } from 'storybook/test';

import { example, hookMeta } from '../../HookDocs.jsx';

import { ReadingPanel, ReplacedScrollPanel, PageHeader } from './fixtures/use-scroll-position.jsx';
import exampleCode from './fixtures/use-scroll-position.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-scroll-position.jsx', import.meta.url));

export default {
  title: 'Hooks/Layout/useScrollPosition',
  id: 'hooks-layout-usescrollposition',
  tags: ['autodocs'],
  ...hookMeta('useScrollPosition')
};

export const ReadingProgress = {
  name: 'Reading progress in a scroll container',
  parameters: example('With `targetRef`, the offset comes from a scroll container instead of the page; here it drives a Progress bar and enables Back to top.', exampleSource),
  render: () => <ReadingPanel />,
  play: async ({ canvasElement, mount }) => {
    const probe = await mount(<ReplacedScrollPanel />);
    const original = probe.getByRole('region', { name: 'Replaceable scroller' });
    original.scrollTop = 120;
    original.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(probe.getByText('120px')).toBeVisible());
    await userEvent.click(probe.getByRole('button', { name: 'Replace scroller' }));
    await waitFor(() => expect(probe.getByText('0px')).toBeVisible());
    const replacement = probe.getByRole('region', { name: 'Replaceable scroller' });
    replacement.scrollTop = 80;
    replacement.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(probe.getByText('80px')).toBeVisible());
    original.dispatchEvent(new Event('scroll'));
    await expect(probe.getByText('80px')).toBeVisible();

    await mount(<ReadingPanel />);
    const panel = within(canvasElement).getByRole('region', { name: 'Essay' });
    panel.scrollTop = 120;
    panel.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(within(canvasElement).getByRole('button', { name: 'Back to top' })).toBeEnabled());
  }
};

export const PageScroll = {
  name: 'Page scroll',
  parameters: example('Without options it follows the window, for headers that shrink and back-to-top links.', exampleSource),
  render: () => <PageHeader />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previousHeight = canvasElement.style.minHeight;
    const previousScroll = { left: scrollX, top: scrollY };
    try {
      canvasElement.style.minHeight = `${innerHeight + 300}px`;
      window.scrollTo({ top: 120, behavior: 'instant' });
      await waitFor(() => expect(canvas.getByText(/120px.*compact/)).toBeVisible());
      window.scrollTo({ top: 0, behavior: 'instant' });
      await waitFor(() => expect(canvas.getByText(/0px.*full/)).toBeVisible());
    } finally {
      canvasElement.style.minHeight = previousHeight;
      window.scrollTo({ ...previousScroll, behavior: 'instant' });
    }
  }
};
