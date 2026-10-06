export default {
  "Post/TableOfContents": {
    description: 'Tracks article headings and indexes diagrams and tables. Pass contentRef when several articles share the same page.',
    props: [['toc', 'Array<{ id, url, value, depth, children }>', '[]', 'Heading IDs and labels from the article.'], ['contentRef', 'RefObject<HTMLElement>', '-', 'Article to index. Defaults to the first article on the page.'], ['className', 'string', '-', 'Layout and responsive visibility classes.']],
    usage: "import { TableOfContents } from '@gaudi/design-system';\n\n<TableOfContents toc={toc} />",
    accessibility: "Names the article navigation and preserves normal anchor behavior; the active heading is marked without stealing focus."
  }
};
