import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'screens', import.meta.url,
  import.meta.glob('./fixtures/screens/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/screens/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Wizard', id: 'blocks-application-wizard', tags: ['autodocs'], ...catalogueMeta('screens') };

export const PlanUpgrade = {
  name: 'Plan upgrade',
  ...pattern('plan-upgrade', 'Four steps on the numbered stepper with a live invoice preview beside them: plan and billing period, seats, a validated card and a review before the due-today total is charged.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText('Enter the name on the card.')).toBeVisible();
  }
};
export const SendInvoice = {
  name: 'Send an invoice',
  ...pattern('send-invoice', 'A progress bar over four steps; the line-item table adds and removes rows while discount, tax and the total update live.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Remove item 2' }));
    await expect(canvas.getAllByText('€2,592.00').length).toBeGreaterThan(0);
  }
};
export const VendorOnboarding = {
  name: 'Vendor onboarding',
  ...pattern('vendor-onboarding', 'A vertical stepper you can click back through: company and VAT checks, banking with IBAN validation, and a review that needs a signed confirmation.'),
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
export const TeamInvite = {
  name: 'Invite your team',
  ...pattern('team-invite', 'Paste addresses, give each person a role, then review the invites by role before sending.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText(/Fix sam@fabrikam/)).toBeVisible();
  }
};
export const AddProduct = {
  name: 'Add a product',
  ...pattern('add-product', 'Five steps: details, images, option values, a SKU matrix generated from every combination with stock, and a review.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'XL' }));
    await expect(canvas.getByText(/8 variants/)).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(canvas.getByRole('columnheader', { name: 'Stock' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Set all to 25' }));
    await expect(canvas.getAllByRole('textbox', { name: /^Stock for / })[0]).toHaveValue('25');
  }
};
export const SendMoney = {
  name: 'Send money',
  ...pattern('send-money', 'Dot progress over a payee search, an amount with a currency picker and balance check, a schedule and a confirmation.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText('Choose who to pay.')).toBeVisible();
    await userEvent.click(canvas.getByRole('combobox', { name: 'Pay to' }));
    await userEvent.click(await within(canvasElement.ownerDocument.body).findByRole('option', { name: /Ana Ruiz/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    const back = canvas.getByRole('button', { name: 'Back to Payee' });
    back.focus();
    await expect(back).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('combobox', { name: 'Pay to' }).value).toContain('Ana Ruiz');
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
  }
};
