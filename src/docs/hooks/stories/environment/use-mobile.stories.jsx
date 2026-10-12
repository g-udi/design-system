import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { ResponsiveFilters } from './fixtures/use-mobile.jsx';
import exampleCode from './fixtures/use-mobile.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-mobile.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/useIsMobile',
  id: 'hooks-environment-useismobile',
  tags: ['autodocs'],
  ...hookMeta('useIsMobile')
};

export const FiltersPanel = {
  name: 'Sidebar or sheet',
  parameters: example('On phones the filters move into a bottom Sheet; on wider screens they sit in the page. Both layouts reach the same filters. Try it at a narrow width.', exampleSource),
  render: () => <ResponsiveFilters />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const { page } = await import('vitest/browser');
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const original = { width: innerWidth, height: innerHeight };
    try {
      await page.viewport(767, original.height);
      const trigger = await canvas.findByRole('button', { name: 'Filters' });
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const dialog = await body.findByRole('dialog', { name: 'Filters' });
      await waitFor(() => expect(within(dialog).getByText('Engineering')).toBeVisible());
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
      await page.viewport(768, original.height);
      await waitFor(() => expect(canvas.getByRole('heading', { name: 'Filters' })).toBeVisible());
      await expect(canvas.getByText('Engineering')).toBeVisible();
      await expect(canvas.queryByRole('button', { name: 'Filters' })).not.toBeInTheDocument();
    } finally { await page.viewport(original.width, original.height); }
  }
};
