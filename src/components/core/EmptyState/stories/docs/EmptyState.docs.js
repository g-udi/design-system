import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/EmptyState": {
    ...definition('Explain empty collections, unavailable results and the next useful action.', [p('title', 'ReactNode', '—', 'Short statement of the empty state.'), p('description', 'ReactNode', '—', 'Cause or next step.'), p('titleAs', 'div | h2 | h3 | h4 | h5 | h6', 'div', 'Renders the title as a heading at the level that fits the page outline; the look stays the same. EmptyTitle takes the same value as `as`.'), p('icon', 'ReactNode', '—', 'Decorative illustration or icon.'), p('actions', 'ReactNode', '—', 'Create, reset or retry actions.'), p('compact', 'boolean', 'false', 'Reduced spacing inside small panels.'), className], 'The title and description carry the meaning. Give actions specific names and avoid announcing a stable empty state repeatedly.'),
    usage: "import EmptyState from '@gaudi/design-system/core/EmptyState';\nimport Button from '@gaudi/design-system/core/Button';\n\n<EmptyState title='No projects yet' description='Create a project to start organizing your work.'\n  actions={<Button onClick={createProject}>Create project</Button>} />"
  }
};
