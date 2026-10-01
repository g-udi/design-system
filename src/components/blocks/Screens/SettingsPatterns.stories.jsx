import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'screens',
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Settings', id: 'blocks-settings', tags: ['autodocs'], ...catalogueMeta('screens') };

export const ScreensPattern6 = {
  name: 'Preferences',
  ...pattern(6, 'Collapsible sections of select, switch and button rows with Required, Pro, Beta and Business badges, closing with the workspace admins.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Security/ }));
    await waitFor(() => expect(canvas.getByRole('switch', { name: /Require two-factor sign-in/ })).toBeVisible());
  }
};
export const ScreensPattern7 = {
  name: 'Notifications',
  ...pattern(7, 'A daily digest with days and time, a per-channel alert matrix for Email, Slack and In-app with delivery modes, and collapsible auto-follow rules.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Send a digest' }));
    await expect(canvas.queryByRole('group', { name: 'Digest days' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('tab', { name: /Slack/ }));
    await expect(canvas.getByRole('checkbox', { name: 'Deploys, My work' })).toBeChecked();
  }
};
export const ScreensPattern8 = {
  name: 'Integrations',
  ...pattern(8, 'App cards with connect switches in a gallery, or grouped rows with status badges and connect actions in a list.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'List' }));
    await userEvent.click(canvas.getAllByRole('button', { name: 'Connect' })[0]);
    await expect(canvas.getByText(/5 of 8 apps connected/)).toBeVisible();
  }
};
export const ScreensPattern9 = {
  name: 'Developer',
  ...pattern(9, 'API keys with masked tokens to copy, roll or revoke and a pause-all switch, webhook endpoints with delivery health and alerts, and SDK samples in five languages.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Pause all keys' }));
    await expect(canvas.getByRole('switch', { name: 'Production key active' })).toBeDisabled();
    await userEvent.click(canvas.getAllByRole('button', { name: 'Revoke' })[2]);
    await expect(canvas.getByText('CI pipeline key revoked.')).toBeVisible();
  }
};
