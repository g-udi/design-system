import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Post/Post": {
    ...definition('An article summary linking to a full post.', [p('frontMatter', 'Article metadata', '{}', 'Title, prepared href, date, subtitle and category { id, label, href }. String categories remain unlinked labels; absent hrefs never create a route.'), p('locale', 'string', '—', 'Date formatting locale.'), p('titleAs', 'ElementType', 'h3', 'Heading element appropriate to the surrounding list.')], 'Use a meaningful linked title and an appropriate heading level. Content and routing remain application-owned.'),
    usage: "import { Post } from '@gaudi/design-system';\n\n<Post frontMatter={frontMatter} />"
  }
};
