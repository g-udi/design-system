import { expect, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { LocalTime } from './fixtures/use-is-client.jsx';
import exampleCode from './fixtures/use-is-client.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-is-client.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/useIsClient',
  id: 'hooks-environment-useisclient',
  tags: ['autodocs'],
  ...hookMeta('useIsClient')
};

export const LocalisedTime = {
  name: 'Browser-only output',
  parameters: example("The reader's local time zone is unknown on the server, so it renders a same-size placeholder there and the formatted time on the client, without a hydration mismatch.", exampleSource),
  render: () => <LocalTime />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('true')).toBeVisible();
  }
};
