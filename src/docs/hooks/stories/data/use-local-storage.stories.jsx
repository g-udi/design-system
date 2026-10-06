import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { localStorageStore } from '../../../../hooks/data/use-local-storage.js';
import { ReaderPreferences, NoticeA, NoticeB, ProjectPreferences } from './fixtures/use-local-storage.jsx';
import exampleCode from './fixtures/use-local-storage.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-local-storage.jsx', import.meta.url));

export default {
  title: 'Hooks/Data/useLocalStorage',
  id: 'hooks-data-uselocalstorage',
  tags: ['autodocs'],
  ...hookMeta('useLocalStorage')
};

export const Preference = {
  name: 'Reading preference',
  parameters: example('A text-size choice persisted under a namespaced key. `removeValue` resets it to the initial value. Reload the page to see it kept.', exampleSource),
  render: () => <ReaderPreferences />
};

export const Synced = {
  name: 'Callers stay in sync',
  parameters: example('Two components use the same key: changing one updates the other at once, and other open tabs follow through the storage event.', exampleSource),
  render: () => (
    <div className='grid gap-3'>
      <NoticeA />
      <NoticeB />
    </div>
  ),
  play: async ({ canvasElement }) => {
    window.localStorage.removeItem('gaudi-docs:beta-notice');
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'Hide the beta notice' });
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByText('hidden')).toBeVisible());
    await expect(window.localStorage.getItem('gaudi-docs:beta-notice')).toBe('true');
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByText('shown')).toBeVisible());
  }
};

export const PerProject = {
  name: 'Preferences follow the active key',
  parameters: example('A different storage key and default for each project. Switching projects reads that project’s preference, and resetting restores its current default.', exampleSource),
  beforeEach: () => {
    ['articles', 'research'].forEach((project) => localStorageStore.remove(`gaudi-docs:project-density:${project}`));
  },
  render: () => <ProjectPreferences />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('comfortable')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Research' }));
    await expect(canvas.getByText('compact')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Use spacious density' }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Articles' }));
    await expect(canvas.getByText('comfortable')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Research' }));
    await expect(canvas.getByText('spacious')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset project density' }));
    await expect(canvas.getByText('compact')).toBeVisible();
  }
};
