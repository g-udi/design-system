import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { LazyComments, IntersectionFallback, LoadMore } from './fixtures/use-in-view.jsx';
import exampleCode from './fixtures/use-in-view.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-in-view.jsx', import.meta.url));

export default {
  title: 'Hooks/Layout/useInView',
  id: 'hooks-layout-useinview',
  tags: ['autodocs'],
  ...hookMeta('useInView')
};

export const LazySection = {
  name: 'Load a section when it is reached',
  parameters: example('The comments render once their section scrolls into view, then stop observing (`once`). Use `rootMargin` to start loading a little before it is visible.', exampleSource),
  render: () => <LazyComments />,
  play: async ({ mount }) => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'IntersectionObserver');
    try {
      Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined, writable: true });
      const hidden = await mount(<IntersectionFallback initialInView={false} />);
      await waitFor(() => expect(hidden.getByText('Outside view')).toBeVisible());
      const visible = await mount(<IntersectionFallback initialInView />);
      await waitFor(() => expect(visible.getByText('In view')).toBeVisible());
    } finally {
      if (descriptor) Object.defineProperty(window, 'IntersectionObserver', descriptor);
      else delete window.IntersectionObserver;
      await mount(<LazyComments />);
    }
  }
};

export const InfiniteList = {
  name: '"Load more" sentinel with a button',
  parameters: example('Reaching the end loads more automatically, and the same row keeps a real "Load more" button for keyboard and screen reader users.', exampleSource),
  render: () => <LoadMore />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvas.getByRole('region', { name: 'Posts' });
    const initial = canvas.getAllByRole('listitem').length;
    viewport.scrollTop = viewport.scrollHeight;
    await waitFor(() => expect(canvas.getAllByRole('listitem').length).toBeGreaterThan(initial));
    while (canvas.queryByRole('button', { name: 'Load more posts' })) {
      const count = canvas.getAllByRole('listitem').length;
      const button = canvas.getByRole('button', { name: 'Load more posts' });
      button.focus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getAllByRole('listitem').length).toBeGreaterThan(count));
    }
    await expect(canvas.getAllByRole('listitem')).toHaveLength(18);
    await expect(canvas.getByText('All 18 posts loaded.')).toBeVisible();
  }
};
