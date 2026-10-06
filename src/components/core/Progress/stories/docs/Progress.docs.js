import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Progress": {
    ...definition('Determinate and indeterminate progress with a readable task label.', [p('label', 'string', '—', 'Accessible name of the progress indicator.'), p('value', 'number', '—', 'Completed amount; omit for indeterminate progress.'), p('max', 'number', '100', 'Total amount.'), p('valueText', 'string', '—', 'Human-readable progress such as 3 of 8 files.'), p('tone', 'accent | success | warning | danger', 'accent', 'Status color.'), className], 'Provide a task label and meaningful value text. Avoid announcing every small progress update.'),
    usage: "import Progress from '@gaudi/design-system/core/Progress';\n\n<Progress value={completed} max={total} label='Upload progress' />"
  }
};
