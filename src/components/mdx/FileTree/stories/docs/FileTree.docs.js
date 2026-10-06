import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/FileTree": {
    ...definition('Static file and folder listings for technical documentation.', [p('data', 'Array<{ name, isFolder?, childrenProp?, isOpen? }>', '[]', 'Recursive file and folder records.'), className], 'The listing preserves nested list semantics and has a named keyboard-scrollable region. isOpen controls which authored branches are shown; use Core/Tree for an interactive file explorer.'),
    usage: "<FileTree data={[\n  { name: 'content', isFolder: true, childrenProp: [{ name: 'post.mdx' }] },\n  { name: 'package.json' }\n]} />"
  }
};
