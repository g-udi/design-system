import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/Callout": {
    ...definition('Highlight an article note, tip, warning or error while preserving readable prose.', [p('type', 'info | warning | error', 'info', 'Semantic message tone.'), p('title', 'ReactNode', '—', 'Optional label above the body, such as Note or Warning. remarkAlerts sets it from GitHub alert markers.'), children, className, p('classNames', 'Record<string, string>', '{}', 'Slot class overrides.')], 'Text carries the meaning; color and icons support it.'),
    usage: "<Callout type='info' title='Note'>\n  Useful article context that readers should notice before continuing.\n</Callout>"
  }
};
