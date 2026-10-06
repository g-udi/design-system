import { p, children, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/Details": {
    ...definition('Expandable article details with an explicit summary.', [p('title', 'ReactNode', '—', 'Disclosure summary.'), p('headingLevel', 'number', '2', 'Level of the heading that wraps the disclosure button; the title renders once.'), children, p('HTML div props', 'HTMLAttributes<HTMLDivElement>', '—', 'Additional attributes on the content region.')], 'The summary button exposes its expanded state and supports keyboard disclosure. Keep the summary descriptive when the content is collapsed.'),
    usage: "<Details title='Implementation detail'>\n  Expanded article content that is useful but not required for the main reading path.\n</Details>"
  }
};
