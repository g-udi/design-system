import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/Table": {
    ...definition('Semantic article tables with contained horizontal scrolling.', [children, className, p('density', 'compact | normal | comfortable', 'normal', 'Shared table spacing; header type and supplied casing stay unchanged.'), p('TableHeaderCell.variant', 'muted | plain', 'muted', 'Shared header fill, including opaque sticky cells.'), p('Native table props', 'TableHTMLAttributes<HTMLTableElement>', '—', 'Additional table attributes; row and cell parts forward their native attributes.')], 'Include column or row headers and an accessible caption. Wide data scrolls inside the table region.'),
    usage: '| Component | Status |\n| --- | --- |\n| Callout | Documented |\n| Chart | Ready for article embeds |'
  }
};
