import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'forms', import.meta.url,
  import.meta.glob('./fixtures/forms/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/forms/*.jsx', { eager: true, query: '?raw', import: 'default' })
);
const body = () => within(document.body);

export default { title: 'Blocks/Forms', id: 'blocks-forms', tags: ['autodocs'], ...catalogueMeta('forms') };

export const Contact = {
  name: 'Contact · Message with error summary',
  ...pattern('contact', 'A contact form for a blog: name, email, topic, a message with a live character count and consent. A failed submit focuses an error summary that links to each field; a valid one shows a confirmation.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }));
    const summary = await canvas.findByRole('alert', { name: /Fix 5 problems/ });
    await waitFor(() => expect(summary).toHaveFocus());
    await userEvent.type(canvas.getByLabelText('Name'), 'Jordan Lee');
    await userEvent.type(canvas.getByLabelText('Email'), 'jordan@example.com');
    await waitFor(() => expect(canvas.getByRole('alert', { name: /Fix 3 problems/ })).toBeVisible());
  }
};
export const Newsletter = {
  name: 'Newsletter · Signup and preferences',
  ...pattern('newsletter', 'A two-step newsletter signup: the email first, then frequency as radio cards and topics as checkboxes, plus a compact inline signup for the end of a post.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getAllByLabelText('Email address')[0], 'reader@example.com');
    await userEvent.click(canvas.getAllByRole('button', { name: 'Subscribe' })[0]);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Confirm subscription' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm subscription' }));
    await waitFor(() => expect(canvas.getByText(/Check your inbox/)).toBeVisible());
  }
};
export const ArticleFeedback = {
  name: 'Feedback · Article survey',
  ...pattern('article-feedback', 'A short survey under an article: a star rating, a 0–10 recommendation scale, optional highlights and comments, with progress as questions are answered.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send feedback' }));
    await waitFor(() => expect(canvas.getByRole('alert', { name: /Fix 2 problems/ })).toHaveFocus());
    await userEvent.click(canvas.getByRole('radio', { name: '4 stars' }));
    await userEvent.click(canvas.getByRole('radio', { name: '9 out of 10' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Send feedback' }));
    await waitFor(() => expect(canvas.getByText('Thank you for the feedback')).toBeVisible());
  }
};
export const Checkout = {
  name: 'Checkout · Address and payment',
  ...pattern('checkout', 'A shop checkout: shipping address with a postcode checked against the chosen country, an optional phone, card number, expiry and security code formatted as you type and checked before submit, beside an order summary.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByLabelText('Card number');
    await userEvent.type(card, '4242424242424241');
    await expect(card).toHaveValue('4242 4242 4242 4241');
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByText('Check the card number.')).toBeVisible());
  }
};
export const EventRegistration = {
  name: 'Events · Registration with email code',
  ...pattern('event-registration', 'Event registration: ticket types with seats left, a quantity that adds a name field per ticket, email verification with a one-time code, workshops with full sessions disabled, dietary needs and a live total.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }));
    await waitFor(() => expect(canvas.getByLabelText('Ticket 2 name')).toBeVisible());
    await expect(canvas.getByText('£150.00')).toBeVisible();
  }
};
export const ProfileCard = {
  name: 'Profile · Card with completion and office hours',
  ...pattern('profile-card', 'A profile card in label-control rows: photo, display name, username with an address prefix, headline, bio and website, a completion badge that updates as fields fill in, and office hours as a date plus a time window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Profile 50% complete/)).toBeVisible();
    await userEvent.type(canvas.getByLabelText('Headline'), 'Writing about local-first software');
    await waitFor(() => expect(canvas.getByText(/Profile 67% complete/)).toBeVisible());
    await expect(canvas.getByRole('button', { name: 'Save profile' })).toBeEnabled();
  }
};
export const ProfileTabs = {
  name: 'Profile · Tabs with audit rail',
  ...pattern('profile-tabs', 'Account settings in Profile, Organisations and Security tabs beside a sticky summary rail with membership details, a 12-week activity heatmap and recent audit events. The password form checks that both new passwords match.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Security' }));
    await userEvent.type(await canvas.findByLabelText('New password'), 'correct-horse-battery');
    await userEvent.type(canvas.getByLabelText('Repeat new password'), 'correct-horse');
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByText('The passwords do not match.')).toBeVisible());
  }
};
export const SignInPolicy = {
  name: 'Security · Sign-in policy',
  ...pattern('sign-in-policy', 'An organisation sign-in policy in line tabs: email with magic links and allowed domains, phone codes by SMS or WhatsApp, password length and rules, passkey requirements and lockout. A summary line reads the policy back, and Save stays off until something changes.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Save policy' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('tab', { name: 'Passkey' }));
    await userEvent.click(await canvas.findByRole('radio', { name: /Required for everyone/ }));
    await waitFor(() => expect(canvas.getByText(/passkeys for everyone/)).toBeVisible());
    await expect(canvas.getByRole('button', { name: 'Save policy' })).toBeEnabled();
  }
};
const invite = pattern('team-invite', 'Invite members: email chips checked one by one against the seats left, role presets that fill a searchable permission tree with partial parent states, workspace and expiry, single sign-on, and a warning when sensitive access is granted.');
export const TeamInvite = {
  name: 'Team · Invite with permissions',
  ...invite,
  parameters: { ...invite.parameters, visualAudit: { wide: 'The permission list spans the form; a search can leave only a few short rows in it.' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Send 2 invites/ }));
    await waitFor(() => expect(canvas.getByRole('alert', { name: /Fix 1 problem/ })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Remove alex@northwnd' }));
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Permissions' }), 'billing');
    await waitFor(() => expect(canvas.getByText('Change plan and payment method')).toBeVisible());
    await expect(canvas.queryByText('Publish and unpublish')).not.toBeInTheDocument();
  }
};
export const ApiKey = {
  name: 'Developer · Create an API key',
  ...pattern('api-key', 'Create a scoped API key: name checked against existing keys, environment, read or write access per resource, expiry and an optional IP allowlist. The new secret is shown once with reveal, copy and ready-made environment snippets per stack; existing keys can be rotated or revoked.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Key name'), 'Website build');
    await userEvent.click(canvas.getByRole('button', { name: 'Create key' }));
    await waitFor(() => expect(canvas.getByText('A key with this name already exists.')).toBeVisible());
    await userEvent.clear(canvas.getByLabelText('Key name'));
    await userEvent.type(canvas.getByLabelText('Key name'), 'Newsletter worker');
    await userEvent.click(canvas.getByRole('button', { name: 'Create key' }));
    await waitFor(() => expect(canvas.getByText(/is ready/)).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Reveal' }));
    await expect(canvas.getByLabelText('API secret')).toHaveTextContent(/^gd_test_/);
  }
};
export const HostedCheckout = {
  name: 'Billing · Hosted checkout setup',
  ...pattern('hosted-checkout', 'Configure a hosted payment page in label-control rows: charge type and currency, a trial for subscriptions, payment methods and details to collect as checkbox groups, promotion codes, the button label and redirect pages, with a live preview strip.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText('Cards'));
    await userEvent.click(canvas.getByLabelText('Wallets'));
    await userEvent.click(canvas.getByRole('button', { name: 'Create checkout page' }));
    await waitFor(() => expect(canvas.getByRole('alert', { name: /Fix 1 problem/ })).toHaveFocus());
  }
};
export const Invoice = {
  name: 'Billing · Invoice with line items',
  ...pattern('invoice', 'An invoice editor: a customer combobox, currency and payment terms that set the due date, editable line items you add and remove, discount and tax, and totals that update as you type.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('£3,985.20')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Add line' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Send invoice' }));
    await waitFor(() => expect(canvas.getByRole('alert', { name: /Fix 1 problem/ })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Remove line 3' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Send invoice' }));
    await waitFor(() => expect(canvas.getByText('Sent')).toBeVisible());
  }
};
export const NewProduct = {
  name: 'Commerce · New product',
  ...pattern('new-product', 'Create a product: title with a character count, description, images with a cover and drop target, price, compare-at price and cost with the margin, SKU and stock tracking, plus status, type and collections in a side column.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Compare-at price'), '30');
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByText('The compare-at price must be higher than the price.')).toBeVisible());
    await expect(canvas.getByText('64% margin')).toBeVisible();
  }
};
export const BusinessVerification = {
  name: 'Compliance · Business verification',
  ...pattern('business-verification', 'A verification review: read-only sections for the legal entity, ownership and compliance, each edited in a dialog form with its own validation. Submit unlocks once every section is complete.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Submit for review' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Edit ownership' }));
    const dialog = await body().findByRole('dialog', { name: 'Ownership' });
    await userEvent.type(within(dialog).getByLabelText('Ownership'), '10');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save section' }));
    await waitFor(() => expect(within(dialog).getByText('Only list owners with 25% or more.')).toBeVisible());
    await userEvent.keyboard('{Escape}');
  }
};
export const SupportTicket = {
  name: 'Support · Ticket details',
  ...pattern('support-ticket', 'A ticket panel you edit row by row: subject, requester, priority and summary each save on their own, with status and reply-time badges, removable tags and owners.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Edit Requester' }));
    const input = canvas.getByLabelText('Requester');
    await userEvent.clear(input);
    await userEvent.type(input, 'not-an-email{Enter}');
    await waitFor(() => expect(canvas.getByText(/Enter an email address/)).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit Requester' })).toHaveFocus());
  }
};
export const CustomerIntake = {
  name: 'Onboarding · Customer intake',
  ...pattern('customer-intake', 'A new-customer card in label-control rows: company details, team size, the main contact, up to three account owners picked from a people combobox, goals and notes.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Create customer' }));
    await waitFor(() => expect(canvas.getByRole('alert', { name: /Fix 4 problems/ })).toHaveFocus());
  }
};
export const AppLaunch = {
  name: 'Launch · New app with live summary',
  ...pattern('app-launch', 'Launch an app: name with an address generated from it, platforms, plan, region, release channel and date, and a banner at the top that reads back every choice as you make it.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByLabelText('App name');
    await userEvent.clear(name);
    await userEvent.type(name, 'Small Tools');
    await waitFor(() => expect(canvas.getByText('small-tools.gaudi.app')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Android' }));
    await waitFor(() => expect(canvas.getByText('Web, iOS, Android')).toBeVisible());
  }
};
