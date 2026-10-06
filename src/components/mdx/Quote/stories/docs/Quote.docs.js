import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/Quote": {
    ...definition('An editorial quotation with attribution and an optional portrait.', [p('text / author / title', 'string', '—', 'Quotation and attribution.'), p('image / imageAlt', 'string', '—', 'Optional portrait source and alternative text.')], 'The quotation uses blockquote semantics. Keep attribution readable and avoid repeating the author in decorative image text.'),
    usage: "<Quote text='Good component systems make product code calmer.' author='Design System' />"
  }
};
