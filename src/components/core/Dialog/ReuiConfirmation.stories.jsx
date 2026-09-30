// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { verifyConfirmationDialogInteraction } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'alert-dialog',
  import.meta.glob('../../../../.storybook/fixtures/reui/alert-dialog/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/alert-dialog/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('alert-dialog') };

export const ReuiConfirmation1 = {
  name: 'Basic confirmation dialog with title, description, and action buttons',
  ...pattern(1),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation2 = {
  name: 'Small size confirmation dialog for quick confirmations',
  ...pattern(2),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation3 = {
  name: 'Confirmation dialog with icon',
  ...pattern(3),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation4 = {
  name: 'Small size confirmation dialog with media (icon)',
  ...pattern(4),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation5 = {
  name: 'Destructive confirmation dialog for irreversible actions like deletion',
  ...pattern(5),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation6 = {
  name: 'Confirmation dialog nested within a standard Dialog component',
  ...pattern(6),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation7 = {
  name: 'Task success confirmation',
  ...pattern(7),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation8 = {
  name: 'Account deactivation confirmation',
  ...pattern(8),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation9 = {
  name: 'Warning for unsaved changes when navigating away',
  ...pattern(9),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation10 = {
  name: 'Confirmation for successful e-ticket registration',
  ...pattern(10),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation11 = {
  name: 'System update notification requiring application restart',
  ...pattern(11),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation12 = {
  name: 'Billing warning for expired subscriptions or failed payments',
  ...pattern(12),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation13 = {
  name: 'Logout confirmation dialog',
  ...pattern(13),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation14 = {
  name: 'Advanced security audit confirmation',
  ...pattern(14),
  play: verifyConfirmationDialogInteraction
};
