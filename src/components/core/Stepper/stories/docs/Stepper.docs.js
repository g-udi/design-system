import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Stepper": {
    ...definition('Show progress through a sequence of labelled steps.', [p('steps', 'Array<{ id, label, description? }>', '[]', 'Ordered steps with stable identities.'), p('activeStep', 'number', '0', 'Zero-based index of the current step.'), p('label', 'string', 'Progress', 'Accessible name of the sequence.'), p('orientation', 'horizontal | vertical', 'horizontal', 'Row of steps, or a stacked list for a sidebar.'), p('onStepSelect', '(index: number) => void', '—', 'Turns completed steps into buttons that go back to them.'), className], 'The active item exposes aria-current="step" and completed items have readable status. Selectable completed steps are buttons named by their label.', ['The convenience Stepper displays progress. Use Wizard for validation and navigation; the compound Stepper exports support custom interactive flows.']),
    usage: "import Stepper from '@gaudi/design-system/core/Stepper';\n\n<Stepper steps={steps} activeStep={currentStep} />"
  }
};
