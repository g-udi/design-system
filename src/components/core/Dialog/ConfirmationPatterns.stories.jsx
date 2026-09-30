import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { verifyConfirmationDialogInteraction } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'alert-dialog',
  import.meta.glob('../../../../.storybook/fixtures/patterns/alert-dialog/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/alert-dialog/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('alert-dialog') };

export const ConfirmationPattern1 = {
  name: 'Basic confirmation',
  ...pattern(1),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern2 = {
  name: 'Small confirmation',
  ...pattern(2),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern3 = {
  name: 'Confirmation with icon',
  ...pattern(3),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern4 = {
  name: 'Small confirmation with icon',
  ...pattern(4),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern5 = {
  name: 'Destructive confirmation for deletion',
  ...pattern(5),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern6 = {
  name: 'Confirmation nested in a dialog',
  ...pattern(6),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern7 = {
  name: 'Task success confirmation',
  ...pattern(7),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern8 = {
  name: 'Account deactivation',
  ...pattern(8),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern9 = {
  name: 'Unsaved changes warning',
  ...pattern(9),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern10 = {
  name: 'E-ticket registration confirmation',
  ...pattern(10),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern11 = {
  name: 'Restart required notice',
  ...pattern(11),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern12 = {
  name: 'Billing warning',
  ...pattern(12),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern13 = {
  name: 'Logout confirmation',
  ...pattern(13),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern14 = {
  name: 'Security audit confirmation',
  ...pattern(14),
  play: verifyConfirmationDialogInteraction
};
