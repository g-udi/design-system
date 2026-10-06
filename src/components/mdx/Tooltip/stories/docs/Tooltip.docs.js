import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/Tooltip": {
    ...definition('Supplementary explanations for a term in article prose.', [p('message', 'ReactNode', '—', 'Tooltip explanation.'), p('text / children', 'ReactNode', '—', 'Visible trigger text.')], 'Keep essential information in the article. The trigger must remain discoverable and keyboard accessible.'),
    usage: "A <Tooltip message='Compact supporting context.'>technical term</Tooltip> can carry a short explanation."
  }
};
