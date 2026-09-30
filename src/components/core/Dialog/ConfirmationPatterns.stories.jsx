import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { openEachDialog, verifyConfirmationDialogInteraction } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'alert-dialog',
  import.meta.glob('../../../../.storybook/fixtures/patterns/alert-dialog/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/alert-dialog/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

/** Opens every trigger in a gallery: Cancel takes focus, Escape closes, and focus returns to the trigger. */
const verifyEachConfirmation = ({ canvasElement }) =>
  openEachDialog({ canvasElement, role: 'alertdialog', initialFocus: '[data-slot="alert-dialog-cancel"]' });

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('alert-dialog') };

export const ConfirmationPattern1 = {
  name: 'Confirmation layouts',
  ...pattern(1, 'One trigger per layout: centred, small, with an icon, destructive at both sizes, and split actions.'),
  play: verifyEachConfirmation
};
export const ConfirmationPattern9 = {
  name: "Confirmation with a don't-ask-again option",
  ...pattern(9),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern6 = {
  name: 'Confirmation nested in a dialog',
  ...pattern(6),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern11 = {
  name: 'Notice with a status badge',
  ...pattern(11, 'The same notice in two tones: an update ready to install and a subscription about to expire.'),
  play: verifyEachConfirmation
};
export const ConfirmationPattern10 = {
  name: 'Success summary with details',
  ...pattern(10),
  play: verifyConfirmationDialogInteraction
};
export const ConfirmationPattern14 = {
  name: 'Checklist before an action',
  ...pattern(14),
  play: verifyConfirmationDialogInteraction
};
