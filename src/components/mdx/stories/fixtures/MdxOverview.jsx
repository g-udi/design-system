import Link from '@gaudi/design-system/core/Link';
import Callout from '@gaudi/design-system/mdx/Callout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { CodeBlock, InlineCode, Page, Section, Table, Td, Th } from '../../../../docs/components/StoryDocs';

export const articleUrl = 'https://assaf.website/blog/category/engineering/creating-rich-blog-posts';

const source = `import Callout from '@gaudi/design-system/mdx/Callout';

### My interactive blog

A paragraph written in Markdown.

<Callout type="info">This is a React component.</Callout>`;

// Teaching snapshots, not compiler output. Imports and source positions are omitted.
const componentNode = {
  type: 'mdxJsxFlowElement',
  name: 'Callout',
  attributes: [{ type: 'mdxJsxAttribute', name: 'type', value: 'info' }],
  children: [{ type: 'text', value: 'This is a React component.' }]
};
const markdownTree = {
  type: 'root',
  children: [
    { type: 'heading', depth: 3, children: [{ type: 'text', value: 'My interactive blog' }] },
    { type: 'paragraph', children: [{ type: 'text', value: 'A paragraph written in Markdown.' }] },
    componentNode
  ]
};
const htmlTree = {
  type: 'root',
  children: [
    { type: 'element', tagName: 'h3', properties: {}, children: [{ type: 'text', value: 'My interactive blog' }] },
    { type: 'element', tagName: 'p', properties: {}, children: [{ type: 'text', value: 'A paragraph written in Markdown.' }] },
    componentNode
  ]
};
const jsx = `import Callout from '@gaudi/design-system/mdx/Callout';

export default function Article() {
  return (
    <>
      <h3>My interactive blog</h3>
      <p>A paragraph written in Markdown.</p>
      <Callout type="info">This is a React component.</Callout>
    </>
  );
}`;

const renderer = `import Callout from '@gaudi/design-system/mdx/Callout';
import { CodeFence } from '@gaudi/design-system/mdx/Code';
import { MDXLayoutRenderer } from '@gaudi/design-system/mdx/runtime';

// The blog supplies compiled code from its mdx-bundler pipeline.
const components = { Callout, pre: CodeFence };

export default function Article({ code }) {
  return <MDXLayoutRenderer code={code} components={components} />;
}`;

function Pipeline() {
  return (
    <Tabs defaultValue='source'>
      <TabsList aria-label='MDX processing stages' className='flex-wrap' tone='accent'>
        <TabsTrigger value='source'>Source</TabsTrigger>
        <TabsTrigger value='remark'>Remark</TabsTrigger>
        <TabsTrigger value='rehype'>Rehype</TabsTrigger>
        <TabsTrigger value='react'>React</TabsTrigger>
      </TabsList>
      <TabsContent value='source' className='space-y-4'>
        <p>Start with an MDX file. Markdown handles the article text; an import makes the Gaudi callout available in the same document.</p>
        <CodeBlock code={source} language='mdx' />
      </TabsContent>
      <TabsContent value='remark' className='space-y-4'>
        <p>Parsing turns the document into a Markdown syntax tree, called <InlineCode>mdast</InlineCode>. Remark plugins work on headings, paragraphs, links and other content nodes.</p>
        <p className='text-text-muted'>Simplified tree: imports, source positions and generated fields are omitted.</p>
        <CodeBlock code={JSON.stringify(markdownTree, null, 2)} language='json' />
      </TabsContent>
      <TabsContent value='rehype' className='space-y-4'>
        <p>The Markdown tree becomes an HTML syntax tree, called <InlineCode>hast</InlineCode>. Rehype plugins work on elements and their attributes. MDX preserves component nodes through this stage.</p>
        <p className='text-text-muted'>Simplified tree: Callout stays a component node; it has not been rendered into HTML yet.</p>
        <CodeBlock code={JSON.stringify(htmlTree, null, 2)} language='json' />
      </TabsContent>
      <TabsContent value='react' className='space-y-4'>
        <p>MDX compiles the transformed document to JavaScript. React renders the resulting component alongside your other UI. Interactive components supply their own state and event handlers.</p>
        <p className='text-text-muted'>Equivalent JSX for readability, rather than the compiler’s generated JavaScript:</p>
        <CodeBlock code={jsx} />
        <div data-docs-example className='space-y-4 rounded-control border border-border bg-surface p-5' aria-label='Rendered article example' role='region'>
          <h3 className='text-lg font-semibold text-text'>My interactive blog</h3>
          <p className='text-sm text-text-muted'>A paragraph written in Markdown.</p>
          <Callout type='info' className='mb-0'>This is a React component.</Callout>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export function MdxOverview() {
  return (
    <Page
      title='MDX overview'
      intro='MDX combines Markdown with JSX. Write an article as readable text, then bring in React components for callouts, charts, diagrams and interactive explanations.'
    >
      <p className='text-sm leading-7 text-text-muted'>
        For more information, see <Link tone='accent' href={articleUrl} target='_blank' rel='noreferrer'>Creating Rich &amp; Interactive Blog Posts</Link>.
      </p>

      <Section title='Why use MDX for a blog?' description='The benefit is how you write the article. You can use the same React components in an MDX document or a JSX page.'>
        <div className='max-w-prose space-y-3 text-sm leading-7 text-text-muted'>
          <p>Markdown keeps paragraphs, headings, lists, links and code blocks easy to author. JSX adds components wherever the explanation needs them. A post can move from prose to a chart and back to prose in one file.</p>
          <p>A post written entirely in JSX is also valid. You write the paragraph and heading tags yourself, and the page uses your normal React build. MDX is useful when prose is the main content; JSX is useful when the post is mostly a custom interface.</p>
        </div>
      </Section>

      <Section title='Follow a post through the pipeline' description='Read the stages from left to right: source → remark → rehype → React. These fixed examples explain the transformations; they do not run a compiler in your browser.'>
        <Pipeline />
      </Section>

      <Section title='What each tool does' description='An abstract syntax tree (AST) describes the structure of a document. Plugins edit nodes in that structure instead of searching and replacing raw text.'>
        <Table label='MDX processing tools'>
          <thead><tr><Th>Tool</Th><Th>Responsibility</Th><Th>Typical use</Th></tr></thead>
          <tbody>
            <tr><Td>unified</Td><Td>Organizes parsing, transformation and compilation into a plugin pipeline.</Td><Td>Connect the stages and their plugins.</Td></tr>
            <tr><Td>remark / mdast</Td><Td>Work with Markdown structure: headings, lists, links and code fences.</Td><Td>Collect headings, enable Markdown extensions, or transform a link into a content component.</Td></tr>
            <tr><Td>rehype / hast</Td><Td>Work with HTML structure: elements, attributes and text.</Td><Td>Add heading IDs, render math, or adjust generated HTML.</Td></tr>
            <tr><Td>MDX compiler</Td><Td>Connects Markdown and HTML processing with JSX and JavaScript compilation.</Td><Td>Produce a component that the application can render. Advanced recma plugins operate on its JavaScript tree.</Td></tr>
            <tr><Td>React + Gaudi</Td><Td>Render the content and provide reusable components.</Td><Td>Show the callout, chart or diagram and handle its interactions.</Td></tr>
          </tbody>
        </Table>
        <p className='text-sm leading-7 text-text-muted'>
          A Markdown-to-HTML pipeline can use <InlineCode>remark-rehype</InlineCode> to move between the two trees.
          MDX manages that bridge as part of its compiler, retaining JSX for the later JavaScript stage.
        </p>
      </Section>

      <Section title='How the blog uses plugins' description='The article describes this approach in practice. The blog’s contentlayer.config.js selects the plugins that process each post.'>
        <Table label='Blog plugin examples'>
          <thead><tr><Th>Feature</Th><Th>Markdown stage</Th><Th>HTML stage</Th></tr></thead>
          <tbody>
            <tr><Td>Math</Td><Td mono>remarkMath</Td><Td><InlineCode>rehypeKatex</InlineCode> renders the math notation.</Td></tr>
            <tr><Td>Headings</Td><Td>The Markdown tree records heading text and depth.</Td><Td><InlineCode>rehypeSlug</InlineCode> and <InlineCode>rehypeAutolinkHeadings</InlineCode> add linkable headings.</Td></tr>
            <tr><Td>Rich links</Td><Td><InlineCode>remarkLinks</InlineCode> transforms external links into preview components.</Td><Td><InlineCode>rehypeInternalLinks</InlineCode> handles internal post previews.</Td></tr>
            <tr><Td>Code blocks</Td><Td><InlineCode>remarkCodeTitles</InlineCode> normalizes legacy titles; Gaudi’s <InlineCode>remarkCode</InlineCode> prepares fences and code groups.</Td><Td>Prepared metadata reaches the <InlineCode>CodeFence</InlineCode> and <InlineCode>CodeGroup</InlineCode> renderers.</Td></tr>
          </tbody>
        </Table>
        <p className='text-sm leading-7 text-text-muted'>
          The blog uses Gaudi’s <InlineCode>mdx/remark</InlineCode> adapter for code metadata.{' '}
          <InlineCode>CodeFence</InlineCode> and <InlineCode>CodeGroup</InlineCode> then reuse Core <InlineCode>CodeBlock</InlineCode> for highlighting, tabs and copying.
        </p>
      </Section>

      <Section title='Where Gaudi fits' description='The blog owns the posts, metadata, compilation and article-specific visualizations. Gaudi supplies reusable presentation components and optional MDX adapters.'>
        <p className='max-w-prose text-sm leading-7 text-text-muted'>
          Import a component directly in a post, or supply a component map when rendering compiled content.
          A mapping such as <InlineCode>pre: CodeFence</InlineCode> gives ordinary fenced code blocks the Gaudi presentation.
          The runtime below expects the compiled code format used by <InlineCode>mdx-bundler</InlineCode>, not raw Markdown.
        </p>
        <CodeBlock code={renderer} />
        <p className='max-w-prose text-sm leading-7 text-text-muted'>
          The components in this section also work in regular JSX. Only applications rendering compiled MDX need the separate <InlineCode>mdx/runtime</InlineCode> entry.
        </p>
      </Section>

      <Section title='Article components' description='Normal Markdown covers prose, lists, links and tables. Use the article components when the content needs a richer presentation.'>
        <Table label='Article component choices'>
          <thead><tr><Th>Content</Th><Th>Gaudi components</Th></tr></thead>
          <tbody>
            <tr><Td>Notes and supporting context</Td><Td>Aside, Callout and Details</Td></tr>
            <tr><Td>Questions and quotations</Td><Td>Faq and Quote</Td></tr>
            <tr><Td>Inline explanations</Td><Td>Tooltip, Highlight and LatexText</Td></tr>
            <tr><Td>Media and links</Td><Td>Image, Video, ImageModal and Preview</Td></tr>
            <tr><Td>Data and diagrams</Td><Td>Chart, Table, FileTree and Mermaid</Td></tr>
            <tr><Td>Code examples</Td><Td>CodeFence and CodeGroup, backed by Core CodeBlock</Td></tr>
          </tbody>
        </Table>
      </Section>

      <Section title='Explore next'>
        <ul className='space-y-3 text-sm leading-7'>
          <li><Link tone='accent' href='./?path=/docs/mdx-callout--docs' target='_top'>Callout examples</Link> — embed a Gaudi component in an article.</li>
          <li><Link tone='accent' href='./?path=/docs/mdx-code--docs' target='_top'>Code examples</Link> — fenced code, titles and grouped snippets.</li>
          <li><Link tone='accent' href='./?path=/docs/mdx-citation--docs' target='_top'>Citation examples</Link> — reference markers, source previews and back-links.</li>
          <li><Link tone='accent' href='https://mdxjs.com/docs/extending-mdx/' target='_blank' rel='noreferrer'>Extending MDX</Link> — compiler options and plugin stages.</li>
          <li><Link tone='accent' href='https://unifiedjs.com/learn/guide/introduction-to-unified/' target='_blank' rel='noreferrer'>Introduction to unified</Link> — the processing model behind the article.</li>
        </ul>
      </Section>
    </Page>
  );
}
