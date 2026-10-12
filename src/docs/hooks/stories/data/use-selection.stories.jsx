import { expect, userEvent, within } from 'storybook/test';

import { example, hookMeta } from '../../HookDocs.jsx';

import { BulkArchive, ControlledTags } from './fixtures/use-selection.jsx';
import exampleCode from './fixtures/use-selection.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-selection.jsx', import.meta.url));

export default {
  title: 'Hooks/Data/useSelection',
  id: 'hooks-data-useselection',
  tags: ['autodocs'],
  ...hookMeta('useSelection')
};

export const BulkActions = {
  name: 'Bulk actions with select all',
  parameters: example('Row checkboxes, a select-all checkbox that turns indeterminate for a partial selection, and a bulk action announced through `useLiveAnnouncer`.', exampleSource),
  render: () => <BulkArchive />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Design tokens in practice' }));
    await expect(canvas.getByText('1 selected')).toBeVisible();
    await expect(canvas.getByRole('checkbox', { name: 'Select all posts' })).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all posts' }));
    await expect(canvas.getByText('4 selected')).toBeVisible();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all posts' }));
    await expect(canvas.getByText('0 selected')).toBeVisible();
  }
};

export const Controlled = {
  name: 'Controlled with a limit',
  parameters: example('With `selectedIds` and `onSelectionChange` the host owns the Set and may refuse a change; here it keeps at most two topics.', exampleSource),
  render: () => <ControlledTags />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const design = canvas.getByRole('button', { name: 'design', exact: true });
    const engineering = canvas.getByRole('button', { name: 'engineering', exact: true });
    const data = canvas.getByRole('button', { name: 'data', exact: true });
    await expect(design).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(engineering);
    await expect(engineering).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(data);
    await expect(data).toHaveAttribute('aria-pressed', 'false');
    await expect(design).toHaveAttribute('aria-pressed', 'true');
    await expect(engineering).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(design);
    await userEvent.click(data);
    await expect(design).toHaveAttribute('aria-pressed', 'false');
    await expect(data).toHaveAttribute('aria-pressed', 'true');
  }
};
