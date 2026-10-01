import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'screens',
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/screens/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Wizard', id: 'blocks-application-wizard', tags: ['autodocs'], ...catalogueMeta('screens') };

export const ScreensPattern10 = {
  name: 'Plan upgrade',
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
  name: 'Send an invoice',
  ...pattern(11, 'A progress bar over four steps; the line-item table adds and removes rows while discount, tax and the total update live.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Remove item 2' }));
    await expect(canvas.getAllByText('€2,592.00').length).toBeGreaterThan(0);
  }
};
export const ScreensPattern12 = {
  name: 'Vendor onboarding',
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
  name: 'Invite your team',
  ...pattern(13, 'Paste addresses, give each person a role, then review the invites by role before sending.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText(/Fix sam@fabrikam/)).toBeVisible();
  }
};
export const ScreensPattern14 = {
  name: 'Add a product',
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
  name: 'Send money',
  ...pattern(15, 'Dot progress over a payee search, an amount with a currency picker and balance check, a schedule and a confirmation.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(await canvas.findByText('Choose who to pay.')).toBeVisible();
  }
};
