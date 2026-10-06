import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Scrollspy": {
    ...definition('Track the visible section and navigate a long document using anchor links.', [p('targetRef', 'RefObject<HTMLElement>', '—', 'Scrollable region to observe.'), p('onUpdate', '(activeId: string) => void', '—', 'Respond to the active section changing.'), p('offset', 'number', '0', 'Compensate for sticky headers.'), p('smooth', 'boolean', 'true', 'Smooth scrolling when an anchor is clicked.'), p('history', 'boolean', 'false', 'Opt in to rewriting the page URL hash to the active section.'), p('dataAttribute', 'string', 'scrollspy', 'Attribute identifying tracked content.'), children, className], 'Use real links with valid targets. Preserve focus and allow navigation without motion.'),
    usage: "import { Scrollspy } from '@gaudi/design-system/core/Scrollspy';\nimport Button from '@gaudi/design-system/core/Button';\n\n<>\n<Scrollspy targetRef={articleRef}>\n  <Button data-scrollspy-anchor='overview'>Overview</Button>\n  <Button data-scrollspy-anchor='details'>Details</Button>\n</Scrollspy>\n<div ref={articleRef}>\n  <section id='overview'><h2>Overview</h2>{overview}</section>\n  <section id='details'><h2>Details</h2>{details}</section>\n</div>\n</>"
  }
};
