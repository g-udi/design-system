import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/Callout": {
    ...definition('Highlight an article note, tip, warning or error while preserving readable prose.', [p('type', 'info | warning | error', 'info', 'Semantic message tone.'), children, className, p('classNames', 'Record<string, string>', '{}', 'Slot class overrides.')], 'Text carries the meaning; color and icons support it.'),
    usage: "<Callout type='info'>\n  Useful article context that readers should notice before continuing.\n</Callout>"
  }
};
