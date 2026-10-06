import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'screens', import.meta.url,
  import.meta.glob('./fixtures/screens/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/screens/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Profile', id: 'blocks-profile', tags: ['autodocs'], ...catalogueMeta('screens') };

export const AccountSettings = {
  name: 'Account settings',
  ...pattern('account-settings', 'Collapsible navigation groups swap panels for profile, security, notifications, workspace, team and billing; the profile panel uploads a photo, shows a verified email and sets language and time zone.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Team' }));
    await expect(canvas.getByRole('heading', { name: 'Team' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Team' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(canvas.getByRole('button', { name: 'Profile' }));
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Full name' })).toHaveValue('Maya Lopez'));
  }
};
export const OrganisationTabs = {
  name: 'Organisation tabs',
  ...pattern('organisation-tabs', 'Line tabs for the organisation profile, members with roles and status, a role-based permission grid of switches and the identity integrations.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Permissions' }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Viewer' }));
    await expect(canvas.getByRole('switch', { name: 'Publish' })).not.toBeChecked();
    await userEvent.click(canvas.getByRole('radio', { name: 'Admin' }));
    await expect(canvas.getByRole('switch', { name: 'Manage billing' })).toBeChecked();
    await userEvent.click(canvas.getByRole('tab', { name: 'Members' }));
    await expect(canvas.getByRole('columnheader', { name: 'Member' })).toBeVisible();
    await expect(canvas.getByRole('region', { name: 'Organisation members' })).toHaveAttribute('tabindex', '0');
  }
};
export const Billing = { name: 'Billing', ...pattern('billing', 'The current plan with its renewal, three usage meters and the invoice history with statuses and downloads.') };
export const ReferralRewards = {
  name: 'Referral rewards',
  ...pattern('referral-rewards', 'A copyable referral link with share buttons, recent referrals and a reward tier ladder that shows what the next tier unlocks.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy link' }));
    await expect(await canvas.findByRole('button', { name: 'Copied' })).toBeVisible();
  }
};
export const InboxCapture = {
  name: 'Inbox and meeting capture',
  ...pattern('inbox-capture', 'Connected mailboxes with their health, reply routing and signature toggles, beside meeting capture: recording mode, a consent message, the notes template and what to produce after each call.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Announce the recording' }));
    await expect(canvas.queryByRole('textbox', { name: 'Consent message' })).not.toBeInTheDocument();
  }
};
