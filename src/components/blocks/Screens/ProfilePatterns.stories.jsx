import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'screens',
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Profile', id: 'blocks-profile', tags: ['autodocs'], ...catalogueMeta('screens') };

export const ScreensPattern1 = {
  name: 'Account settings',
  ...pattern(1, 'Collapsible navigation groups swap panels for profile, security, notifications, workspace, team and billing; the profile panel uploads a photo, shows a verified email and sets language and time zone.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Team' }));
    await expect(canvas.getByRole('heading', { name: 'Team' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Team' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(canvas.getByRole('button', { name: 'Profile' }));
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Full name' })).toHaveValue('Maya Lopez'));
  }
};
export const ScreensPattern2 = {
  name: 'Organisation tabs',
  ...pattern(2, 'Line tabs for the organisation profile, members with roles and status, a role-based permission grid of switches and the identity integrations.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Permissions' }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Viewer' }));
    await expect(canvas.getByRole('switch', { name: 'Publish' })).not.toBeChecked();
    await userEvent.click(canvas.getByRole('radio', { name: 'Admin' }));
    await expect(canvas.getByRole('switch', { name: 'Manage billing' })).toBeChecked();
  }
};
export const ScreensPattern3 = { name: 'Billing', ...pattern(3, 'The current plan with its renewal, three usage meters and the invoice history with statuses and downloads.') };
export const ScreensPattern4 = {
  name: 'Referral rewards',
  ...pattern(4, 'A copyable referral link with share buttons, recent referrals and a reward tier ladder that shows what the next tier unlocks.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy link' }));
    await expect(await canvas.findByRole('button', { name: 'Copied' })).toBeVisible();
  }
};
export const ScreensPattern5 = {
  name: 'Inbox and meeting capture',
  ...pattern(5, 'Connected mailboxes with their health, reply routing and signature toggles, beside meeting capture: recording mode, a consent message, the notes template and what to produce after each call.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Announce the recording' }));
    await expect(canvas.queryByRole('textbox', { name: 'Consent message' })).not.toBeInTheDocument();
  }
};
