import { auditOpenDialogs } from './auditOpenStates.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { openEachDialog, verifyConfirmationDialogInteraction } from '../../../../docs/components/PatternInteractions.js';

const pattern = patternStories(
  'confirmation', import.meta.url,
  import.meta.glob('./fixtures/confirmation/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/confirmation/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

/** Opens every trigger in a gallery: Cancel takes focus, Escape closes, and focus returns to the trigger. */
const verifyEachConfirmation = async (context) => {
  await openEachDialog({ ...context, role: 'alertdialog', initialFocus: '[data-slot="alert-dialog-cancel"]' });
  await auditOpenDialogs(context);
};
const verifyConfirmation = async (context) => {
  await verifyConfirmationDialogInteraction(context);
  await auditOpenDialogs(context);
};

export default { title: 'Core/Overlays & Menus/Dialog', id: 'core-dialog', tags: ['autodocs'], ...catalogueMeta('confirmation') };

export const ConfirmationLayouts = {
  name: 'Confirmation layouts',
  ...pattern('layouts', 'One trigger per layout: centred, small, with an icon, destructive at both sizes, and split actions.'),
  play: verifyEachConfirmation
};
export const ConfirmationDontAskAgain = {
  name: "Confirmation with a don't-ask-again option",
  ...pattern('dont-ask-again'),
  play: verifyConfirmation
};
export const ConfirmationNestedDialog = {
  name: 'Confirmation nested in a dialog',
  ...pattern('nested-dialog'),
  play: verifyConfirmation
};
export const ConfirmationStatusNotice = {
  name: 'Notice with a status badge',
  ...pattern('status-notice', 'The same notice in two tones: an update ready to install and a subscription about to expire.'),
  play: verifyEachConfirmation
};
export const ConfirmationSuccessSummary = {
  name: 'Success summary with details',
  ...pattern('success-summary'),
  play: verifyConfirmation
};
export const ConfirmationChecklist = {
  name: 'Checklist before an action',
  ...pattern('checklist'),
  play: verifyConfirmation
};
