import { expect, userEvent, waitFor, within } from 'storybook/test';

import { example, hookMeta } from '../../HookDocs.jsx';

import { NewsletterWizard } from './fixtures/use-step.jsx';
import exampleCode from './fixtures/use-step.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-step.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useStep',
  id: 'hooks-state-usestep',
  tags: ['autodocs'],
  ...hookMeta('useStep')
};

export const Wizard = {
  name: 'Wizard with progress',
  parameters: example('Back and Next disable at the ends, the Progress bar states the position in text, and focus moves to each new step heading.', exampleSource),
  render: () => <NewsletterWizard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Back' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Write the intro' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await expect(canvas.getByRole('heading', { name: 'Choose a topic' })).toBeVisible();
  }
};
