// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = reuiPatterns(
  'accordion',
  import.meta.glob('../../../../.storybook/fixtures/reui/accordion/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/accordion/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Accordion', tags: ['autodocs'], ...catalogueMeta('accordion') };

export const ReuiAccordion1 = { name: 'Basic disclosure', ...pattern(1, 'Single expansion with quiet dividers.') };
export const ReuiAccordion2 = { name: 'Plus and minus', ...pattern(2, 'Plus becomes minus when expanded; both icons are decorative.') };
export const ReuiAccordion3 = { name: 'Bordered items', ...pattern(3, 'Individually bordered items with space between questions.') };
export const ReuiAccordion4 = {
  name: 'Inside a card',
  ...pattern(4, 'The card supplies the heading. Links and actions belong inside the content, outside the trigger.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Compare plans' }));
    await expect(canvas.getByText('Shared collections and member roles.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Which plan is right for my team?' })).toHaveAttribute('aria-expanded', 'true');
  }
};
export const ReuiAccordion5 = {
  name: 'Disabled and highlighted',
  ...pattern(5, 'Unavailable items explain the access requirement and are skipped by arrow keys. Open headers use the accent surface.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: 'Account history' });
    const last = canvas.getByRole('button', { name: 'Email preferences' });
    await expect(canvas.getByRole('button', { name: /Advanced audit logs/ })).toBeDisabled();
    first.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(last).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(first).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(last).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(last).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(last).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(last).toHaveAttribute('aria-expanded', 'false');
  }
};
export const ReuiAccordion6 = { name: 'Icons and badges', ...pattern(6, 'Icons and pills fill the noninteractive header slots.') };
export const ReuiAccordion7 = { name: 'Framed panels', ...pattern(7, 'A muted outer frame groups related settings.') };
export const ReuiAccordion8 = {
  name: 'Nested sections',
  ...pattern(8, 'Nested accordions keep independent values, IDs, and arrow-key navigation. Inner sections use the next heading level.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByRole('button', { name: 'Additional details' });
    const inner = canvas.getByRole('button', { name: 'Technical specifications' });
    const sibling = canvas.getByRole('button', { name: 'Compatibility' });
    inner.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(sibling).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(inner).toHaveFocus();
    await userEvent.click(sibling);
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    await expect(sibling).toHaveAttribute('aria-expanded', 'true');
    parent.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'Support options' })).toHaveFocus();
  }
};
export const ReuiAccordion9 = { name: 'Member directory', ...pattern(9, 'Decorative avatars beside visible names, with roles and secondary details.') };
export const ReuiAccordion10 = { name: 'Leading arrow', ...pattern(10, 'A leading arrow beside the title rotates on expansion.') };
export const ReuiAccordion11 = {
  name: 'Guided setup',
  ...pattern(11, 'Completing a step advances the controlled accordion and unlocks the next one. The form saves locally for this demonstration.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /Set your display name/ })).toBeDisabled();
    const qr = canvas.getByRole('img', { name: 'QR code for the Gaudi setup guide' });
    await waitFor(() => expect(qr.naturalWidth).toBeGreaterThan(0), { timeout: 5000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Mark guide as read' }));
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('value', '2');
    const input = canvas.getByRole('textbox', { name: 'Display name' });
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'Amira');
    await userEvent.click(canvas.getByRole('button', { name: 'Save display name' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Display name saved in this example.');
  }
};
