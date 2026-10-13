import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Blocks/Blog/PostNavigation": {
    ...definition('Previous and next article links at the end of a post.', [p('prev / next', 'Article metadata', '—', 'Prepared { id, title, href } articles. Entries without href are omitted; type changes labels only.'), p('headingLevel', 'number', '2', 'Heading level for navigation.'), p('type', 'string', 'Post', 'Content type used by navigation labels.')], 'Links name their destinations. Do not render empty links when one adjacent article is unavailable.'),
    usage: "import { PostNavigation } from '@gaudi/design-system';\n\n<PostNavigation prev={previousPost} next={nextPost} />"
  }
};
