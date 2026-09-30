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
  name: 'Basic confirmation',
  ...pattern(1),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation2 = {
  name: 'Small confirmation',
  ...pattern(2),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation3 = {
  name: 'Confirmation with icon',
  ...pattern(3),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation4 = {
  name: 'Small confirmation with icon',
  ...pattern(4),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation5 = {
  name: 'Destructive confirmation for deletion',
  ...pattern(5),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation6 = {
  name: 'Confirmation nested in a dialog',
  ...pattern(6),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation7 = {
  name: 'Task success confirmation',
  ...pattern(7),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation8 = {
  name: 'Account deactivation',
  ...pattern(8),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation9 = {
  name: 'Unsaved changes warning',
  ...pattern(9),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation10 = {
  name: 'E-ticket registration confirmation',
  ...pattern(10),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation11 = {
  name: 'Restart required notice',
  ...pattern(11),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation12 = {
  name: 'Billing warning',
  ...pattern(12),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation13 = {
  name: 'Logout confirmation',
  ...pattern(13),
  play: verifyConfirmationDialogInteraction
};
export const ReuiConfirmation14 = {
  name: 'Security audit confirmation',
  ...pattern(14),
  play: verifyConfirmationDialogInteraction
};
