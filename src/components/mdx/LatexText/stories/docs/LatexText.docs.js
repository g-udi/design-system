import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/LatexText": {
    ...definition('Render inline mathematical notation inside text.', [children, className, p('style', 'CSSProperties', '—', 'Additional inline styling.')], 'Provide surrounding prose that explains the notation and preserves the reading flow.'),
    usage: '<LatexText>11$^{th}$ International Conference</LatexText>'
  }
};
