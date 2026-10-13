import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Blocks/Blog/Post lists": {
    ...definition('Blog-post sections using the same Post summaries and article data as the blog pages. Image cards, featured articles, horizontal rows, and compact archives reuse one component.', [p('frontMatter', 'Article metadata', '{}', 'Title, prepared href, date, subtitle and category { id, label, href }. String categories remain unlinked labels; absent hrefs never create a route.'), p('layout', 'list | stacked | horizontal', 'list', 'Post presentation. Horizontal media stacks in narrow containers.'), p('media', 'ReactNode', '—', 'Optional image or media before the summary.'), p('footer', 'ReactNode', '—', 'Optional byline and reading-time composition.'), p('className', 'string', '—', 'Classes on the list item.'), p('locale', 'string', '—', 'Date formatting locale.'), p('titleVariant', 'string', 'index-list-title', 'Shared Typography variant; use heading-md for a featured article.'), p('titleAs', 'ElementType', 'h3', 'Heading element appropriate to the surrounding list.')], 'Use a meaningful linked title and an appropriate heading level. Content and routing remain application-owned.'),
    usage: "import { Post } from '@gaudi/design-system';\n\n<ul>\n  <Post frontMatter={frontMatter} />\n</ul>"
  }
};
