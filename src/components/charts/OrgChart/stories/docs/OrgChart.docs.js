import { p, className, definition } from '../../../../../docs/components/referenceProps.js';

export default {
  'Charts/OrgChart': {
    ...definition('A connected organization hierarchy with person cards, expandable reporting lines, and contained scrolling.', [
      p('data', 'OrgNode | null', '—', 'Root { id, name, role?, department?, avatar?, children? }. IDs must be unique; children form an acyclic tree.'),
      p('label', 'string', 'Organization chart', 'Accessible name of the scrolling region.'),
      p('collapsedIds / defaultCollapsedIds / onCollapsedIdsChange', 'string[] / function', '[]', 'Controlled or initial collapsed branches; callback receives the next IDs.'),
      p('onNodeClick', '(node) => void', '—', 'Makes person cards keyboard-accessible buttons. The host owns details or selection.'),
      p('renderNode', '(node) => ReactNode', 'Person avatar and text', 'Custom card content. Keep it non-interactive when onNodeClick wraps it in a button.'),
      p('disabled', 'boolean', 'false', 'Disables person and branch actions; scrolling remains available.'),
      p('labels', 'object', 'English labels', 'Override empty and expand(node), collapse(node), reports(count) text.'), className
    ], 'Nested lists convey reporting relationships. Branch buttons expose expanded state, retain focus when toggled, and work with Enter or Space. The labelled scroll region is keyboard focusable. Avatars are decorative because names are visible.'),
    usage: "import { OrgChart } from '@gaudi/design-system/charts/OrgChart';\n\nconst team = { id: 'lead', name: 'Bram Ellery', role: 'Engineering Lead', children: [{ id: 'dev', name: 'Sam Rivera', role: 'Engineer' }] };\n<OrgChart label='Engineering organization' data={team} />"
  }
};
