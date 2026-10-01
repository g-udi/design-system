import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'screens',
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Screens', id: 'blocks-screens', tags: ['autodocs'], ...catalogueMeta('screens') };

// Profile
export const ScreensPattern1 = {
  name: 'Profile · Account settings',
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
  name: 'Profile · Organisation tabs',
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
export const ScreensPattern3 = { name: 'Profile · Billing', ...pattern(3, 'The current plan with its renewal, three usage meters and the invoice history with statuses and downloads.') };
export const ScreensPattern4 = {
  name: 'Profile · Referral rewards',
  ...pattern(4, 'A copyable referral link with share buttons, recent referrals and a reward tier ladder that shows what the next tier unlocks.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy link' }));
    await expect(await canvas.findByRole('button', { name: 'Copied' })).toBeVisible();
  }
};
export const ScreensPattern5 = {
  name: 'Profile · Inbox and meeting capture',
  ...pattern(5, 'Connected mailboxes with their health, reply routing and signature toggles, beside meeting capture: recording mode, a consent message, the notes template and what to produce after each call.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Announce the recording' }));
    await expect(canvas.queryByRole('textbox', { name: 'Consent message' })).not.toBeInTheDocument();
  }
};

// Settings
export const ScreensPattern6 = {
  name: 'Settings · Preferences',
  ...pattern(6, 'Collapsible sections of select, switch and button rows with Required, Pro, Beta and Business badges, closing with the workspace admins.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Security/ }));
    await waitFor(() => expect(canvas.getByRole('switch', { name: /Require two-factor sign-in/ })).toBeVisible());
  }
};
export const ScreensPattern7 = {
  name: 'Settings · Notifications',
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
  name: 'Settings · Integrations',
  ...pattern(8, 'App cards with connect switches in a gallery, or grouped rows with status badges and connect actions in a list.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'List' }));
    await userEvent.click(canvas.getAllByRole('button', { name: 'Connect' })[0]);
    await expect(canvas.getByText(/5 of 8 apps connected/)).toBeVisible();
  }
};
export const ScreensPattern9 = {
  name: 'Settings · Developer',
  ...pattern(9, 'API keys with masked tokens to copy, roll or revoke and a pause-all switch, webhook endpoints with delivery health and alerts, and SDK samples in five languages.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Pause all keys' }));
    await expect(canvas.getByRole('switch', { name: 'Production key active' })).toBeDisabled();
    await userEvent.click(canvas.getAllByRole('button', { name: 'Revoke' })[2]);
    await expect(canvas.getByText('CI pipeline key revoked.')).toBeVisible();
  }
};

// Wizard
export const ScreensPattern10 = {
  name: 'Wizard · Plan upgrade',
  ...pattern(10, 'Four steps on the numbered stepper with a live invoice preview beside them: plan and billing period, seats, a validated card and a review before the due-today total is charged.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText('Enter the name on the card.')).toBeVisible();
  }
};
export const ScreensPattern11 = {
  name: 'Wizard · Send an invoice',
  ...pattern(11, 'A progress bar over four steps; the line-item table adds and removes rows while discount, tax and the total update live.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Remove item 2' }));
    await expect(canvas.getAllByText('€2,592.00').length).toBeGreaterThan(0);
  }
};
export const ScreensPattern12 = {
  name: 'Wizard · Vendor onboarding',
  ...pattern(12, 'A vertical stepper you can click back through: company and VAT checks, banking with IBAN validation, and a review that needs a signed confirmation.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText(/Use the country code and number/)).toBeVisible();
    await userEvent.type(canvas.getByRole('textbox', { name: 'VAT number' }), 'DE123456789');
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Company' }));
    await expect(canvas.getByRole('textbox', { name: 'VAT number' })).toHaveValue('DE123456789');
  }
};
export const ScreensPattern13 = {
  name: 'Wizard · Invite your team',
  ...pattern(13, 'Paste addresses, give each person a role, then review the invites by role before sending.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText(/Fix sam@fabrikam/)).toBeVisible();
  }
};
export const ScreensPattern14 = {
  name: 'Wizard · Add a product',
  ...pattern(14, 'Five steps: details, images, option values, a SKU matrix generated from every combination with stock, and a review.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'XL' }));
    await expect(canvas.getByText(/8 variants/)).toBeVisible();
  }
};
export const ScreensPattern15 = {
  name: 'Wizard · Send money',
  ...pattern(15, 'Dot progress over a payee search, an amount with a currency picker and balance check, a schedule and a confirmation.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText('Choose who to pay.')).toBeVisible();
  }
};

// Onboarding
export const ScreensPattern16 = {
  name: 'Onboarding · Workspace setup',
  ...pattern(16, 'Six questions beside a live preview of the workspace they build, with numbered steps or a progress bar; the import step picks up to two services from selectable cards.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Progress bar' }));
    await expect(canvas.getByText('Step 1 of 6')).toBeVisible();
    await userEvent.type(canvas.getByRole('textbox', { name: 'What should we call you?' }), 'Maya');
    await expect(within(canvas.getByRole('region', { name: 'Workspace preview' })).getByText('Maya')).toBeVisible();
  }
};
export const ScreensPattern17 = {
  name: 'Onboarding · Create a publication',
  ...pattern(17, 'A vertical stepper you can click back through, beside a hero and a screenshot rail that follows the step; it ends on a celebratory screen with next actions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Publication name' }), 'Field Notes');
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Your site' }));
    await expect(canvas.getByRole('textbox', { name: 'Publication name' })).toHaveValue('Field Notes');
  }
};
export const ScreensPattern18 = {
  name: 'Onboarding · Tour in a dialog',
  ...pattern(18, 'A four-step tour inside a dialog with dot progress you can step back through.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Take the tour' }));
    const dialog = await body.findByRole('dialog', { name: 'Welcome tour' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Next' }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Back to Focus' }));
    await waitFor(() => expect(within(dialog).getByRole('radiogroup', { name: 'What do you want to do first?' })).toBeVisible());
    await userEvent.keyboard('{Escape}');
  }
};
export const ScreensPattern19 = {
  name: 'Onboarding · Connect a coding agent',
  ...pattern(19, 'Eight steps on a progress bar, light or dark: an agent picker, a one-time API key and a CLI checklist of copyable commands before a connection check.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Dark card' }));
    await expect(canvas.getByRole('switch', { name: 'Dark card' })).not.toBeChecked();
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText('Add your name.')).toBeVisible();
  }
};

// Auth
export const ScreensPattern20 = {
  name: 'Auth · Split with imagery',
  ...pattern(20, 'Sign in by password or email link beside stacked editorial images, over a faint grid; the image moves to either side.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Email link' }));
    await expect(canvas.queryByLabelText('Password')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Email me a link' })).toBeVisible();
  }
};
export const ScreensPattern21 = {
  name: 'Auth · Split with testimonials',
  ...pattern(21, 'Social sign-in and a password with a reveal toggle, beside rotating customer quotes and a rating over a dot backdrop.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Password'), 'correct horse');
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(canvas.getByLabelText('Password')).toHaveAttribute('type', 'text');
    await userEvent.click(canvas.getByRole('button', { name: 'GitHub' }));
    await expect(await canvas.findByRole('button', { name: 'GitHub' })).toBeEnabled();
  }
};
export const ScreensPattern22 = {
  name: 'Auth · Magic link with logos',
  ...pattern(22, 'Passwordless sign-in in a frame, beside a framed rotating testimonial and a customer logo wall.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Work email' }), 'priya@ledger.app');
    await userEvent.click(canvas.getByRole('button', { name: 'Send sign-in link' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Link sent');
  }
};
export const ScreensPattern23 = {
  name: 'Auth · Centred card',
  ...pattern(23, 'A centred card over a plain or softened photo backdrop: email or username, stacked Google and Apple buttons, keep me signed in and a legal footer.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Email or username' })).toHaveAttribute('autocomplete', 'username');
    await userEvent.click(canvas.getByRole('radio', { name: 'Plain' }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Email link' }));
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email');
  }
};
export const ScreensPattern24 = {
  name: 'Auth · Free trial sign-up',
  ...pattern(24, 'Sign up with Google, GitHub or a work email beside the trial perks over soft colour fields.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Full name' })).toBeVisible();
    await expect(canvas.getByLabelText('Password')).toHaveAttribute('minlength', '8');
  }
};
export const ScreensPattern25 = {
  name: 'Auth · Choose a sign-in method',
  ...pattern(25, 'A full page with an app header and customer logos: passkey, SAML single sign-on with a backup-code fallback, or an email link with Google and GitHub.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Single sign-on (SAML)' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Lost access? Use a backup code' }));
    await expect(canvas.getByRole('button', { name: 'Verify code' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'All sign-in options' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue with email' }));
    await expect(canvas.getByRole('button', { name: 'Google' })).toBeVisible();
  }
};
