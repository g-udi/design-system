import { children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/Aside": {
    ...definition('Supporting article content outside the main reading flow.', [children, className], 'Keep the aside understandable in document order and give distinct sections headings when needed.'),
    usage: '<Aside>\n  Additional context for the article that should sit outside the main argument.\n</Aside>'
  }
};
