import { expect, userEvent, within } from 'storybook/test';

import { example, hookMeta } from '../../HookDocs.jsx';

import { SettingsSections } from './fixtures/use-collapsible-sections.jsx';
import exampleCode from './fixtures/use-collapsible-sections.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-collapsible-sections.jsx', import.meta.url));

export default {
  title: 'Hooks/Layout/useCollapsibleSections',
  id: 'hooks-layout-usecollapsiblesections',
  tags: ['autodocs'],
  ...hookMeta('useCollapsibleSections')
};

export const SettingsPage = {
  name: 'Settings with expand and collapse all',
  parameters: example('Each section is a Collapsible driven by the hook; the bulk buttons disable (rather than disappear) when they have nothing to do.', exampleSource),
  render: () => <SettingsSections />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('1 of 3 open')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
    await expect(canvas.getByText('3 of 3 open')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Expand all' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Privacy' }));
    await expect(canvas.getByText('2 of 3 open')).toBeVisible();
  }
};
