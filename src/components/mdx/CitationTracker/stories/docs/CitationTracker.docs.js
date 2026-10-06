import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/CitationTracker": {
    ...definition('Keep bibliography back-links associated with the last visited citation.', [p('Generated citation attributes', 'data-citation-popover / data-citation-keys / data-citation-key', '—', 'Metadata written by the consuming markdown pipeline.'), p('CitationTracker', 'Runtime component; no props', '—', 'Mount with the article runtime to track citation navigation.')], 'Use real citation and bibliography links with unique IDs. Back-links must return to a valid citation.', ['The consuming markdown pipeline creates citation markup. Gaudi handles its runtime behavior; do not author generated attributes by hand.']),
    usage: "import { CitationTracker } from '@gaudi/design-system/mdx';\n\n// Mount once alongside the host's generated article markup.\n<CitationTracker />"
  }
};
