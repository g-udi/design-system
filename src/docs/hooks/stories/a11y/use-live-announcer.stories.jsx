import { expect, userEvent, waitFor, within } from 'storybook/test';

import { example, hookMeta } from '../../HookDocs.jsx';

import { SaveDraft, SearchResults } from './fixtures/use-live-announcer.jsx';
import exampleCode from './fixtures/use-live-announcer.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-live-announcer.jsx', import.meta.url));

export default {
  title: 'Hooks/A11y/useLiveAnnouncer',
  id: 'hooks-a11y-useliveannouncer',
  tags: ['autodocs'],
  ...hookMeta('useLiveAnnouncer')
};

export const SaveFeedback = {
  name: 'Polite and assertive messages',
  parameters: example("Saving announces politely, after whatever the screen reader is saying; the failed publish interrupts with `'assertive'`. Focus stays on the button either way.", exampleSource),
  render: () => <SaveDraft />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Save draft' }));
    await waitFor(() => expect(document.querySelector('[data-gaudi-live-announcer="polite"]')).toHaveTextContent(/Draft saved at/));
  }
};

export const ResultCount = {
  name: 'Result count after typing settles',
  parameters: example('The count is announced once typing pauses (with `useDebounceValue`), not on every keystroke.', exampleSource),
  render: () => <SearchResults />,
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('searchbox', { name: 'Search posts' }), 'design');
    await waitFor(() => expect(document.querySelector('[data-gaudi-live-announcer="polite"]')).toHaveTextContent('2 results for design'), { timeout: 3000 });
  }
};
