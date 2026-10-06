import { CheckList, CodeBlock, InlineCode, Page, QuickLink, Section, Table, Td, Th } from '../../../docs/components/StoryDocs';
import { expect, within } from 'storybook/test';

export default {
  id: 'mdx-overview',
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'MDX'
};

export const Default = {
  name: 'Overview',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: 'MDX Components' })).toBeVisible();
    await expect(canvas.getAllByText('CitationTracker').length).toBeGreaterThanOrEqual(2);
    await expect(canvas.getAllByText('CodeFence').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getByRole('link', { name: /Callout/ })).toHaveAttribute('href', './?path=/story/mdx-callout--playground');
    await expect(canvas.getByRole('link', { name: /Citation/ })).toHaveAttribute('href', './?path=/story/mdx-citation--playground');
  },
  render: () => (
    <Page
      title='MDX Components'
      intro='MDX components are the article-authoring layer for Gaudi. They let posts mix normal markdown with a small set of structured components for callouts, media, charts, citations, previews, details, and article-specific UI.'
    >
      <Section title='What MDX Means Here' description='Posts are still markdown-first. MDX is used only when the article needs richer structure than markdown can provide.'>
        <Table>
          <thead>
            <tr><Th>Layer</Th><Th>Responsibility</Th></tr>
          </thead>
          <tbody>
            <tr><Td mono>Post file</Td><Td>Authors write prose, markdown, and component tags in <InlineCode>.md</InlineCode> or <InlineCode>.mdx</InlineCode> files.</Td></tr>
            <tr><Td mono>MDX map</Td><Td>The blog maps those tags to Gaudi MDX components, so posts stay clean and package-owned.</Td></tr>
            <tr><Td mono>Gaudi MDX</Td><Td>Components render accessible article UI with consistent typography, spacing, tokens, and interactive behavior.</Td></tr>
          </tbody>
        </Table>
      </Section>

      <details id='pipeline-internals' className='group scroll-mt-28 rounded-lg border border-border bg-surface-muted p-4 open:bg-surface'>
        <summary className='cursor-pointer text-sm font-semibold text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'>
          Pipeline internals
          <span className='ml-2 font-normal text-text-muted'>Compilation stages and citation hydration</span>
        </summary>
        <div className='pt-2'>
      <Section title='Rendering Pipeline' description='The blog uses Contentlayer and the unified ecosystem. Authors write MDX; remark works on the markdown tree, rehype works on the HTML tree, and Gaudi components hydrate the final article UI.'>
        <Table>
          <thead>
            <tr><Th>Stage</Th><Th>What Happens</Th></tr>
          </thead>
          <tbody>
            <tr><Td mono>MDX source</Td><Td>Posts live under the blog content folders with YAML frontmatter, markdown prose, citation keys, and occasional MDX component tags.</Td></tr>
            <tr><Td mono>remark / mdast</Td><Td><InlineCode>remarkExtractFrontmatter</InlineCode>, <InlineCode>remarkGfm</InlineCode>, <InlineCode>remarkFootnoteData</InlineCode>, <InlineCode>remarkMath</InlineCode>, <InlineCode>remarkImgToJsx</InlineCode>, and <InlineCode>remarkLinks</InlineCode> process markdown-level structure.</Td></tr>
            <tr><Td mono>rehype / hast</Td><Td><InlineCode>rehypeSlug</InlineCode>, heading links, KaTeX, tabbed code, citations, footnote popovers, internal links, and code highlighting modify the generated HTML tree.</Td></tr>
            <tr><Td mono>runtime</Td><Td><InlineCode>MDXLayoutRenderer</InlineCode> receives compiled code and the <InlineCode>MDXComponents</InlineCode> map, while small runtimes such as <InlineCode>CitationPopover</InlineCode>, <InlineCode>CitationTracker</InlineCode>, and <InlineCode>Footnote</InlineCode> bind behavior to generated markup. Fences map to <InlineCode>CodeFence</InlineCode> and code groups to <InlineCode>CodeGroup</InlineCode>, both rendering the Core CodeBlock.</Td></tr>
          </tbody>
        </Table>
      </Section>

      <Section title='Citation Pipeline' description='Citations are authored as markdown citation keys. The blog plugin turns them into anchors, popover data, and the References section.'>
        <CodeBlock
          language='mdx'
          code={ `---
bibliography: ['meta/bibliography/references.bib', 'meta/bibliography/kg.bib']
---

A heterogeneous graph [@HusseinYC18; @WangJSWYCY19; @YangXJWHW20] assigns
types to nodes and edges.

The same source can be cited again later [@HusseinYC18].` }
        />
        <Table>
          <thead>
            <tr><Th>Piece</Th><Th>Responsibility</Th></tr>
          </thead>
          <tbody>
            <tr><Td mono>data/meta/bibliography/*.bib</Td><Td>BibTeX sources live in the blog repo. Posts list the needed files in frontmatter.</Td></tr>
            <tr><Td mono>rehypeSimpleCitations</Td><Td>Loads BibTeX through <InlineCode>citation-js</InlineCode>, parses <InlineCode>[@key]</InlineCode> and grouped <InlineCode>[@key1; @key2]</InlineCode> markers, assigns numbers, and appends the references list.</Td></tr>
            <tr><Td mono>CitationPopover</Td><Td>Gaudi runtime reads generated <InlineCode>data-citation-*</InlineCode> attributes and shows source previews on hover/focus.</Td></tr>
            <tr><Td mono>CitationTracker</Td><Td>Global runtime remembers the most recent citation instance so bibliography back-links return to the right spot.</Td></tr>
          </tbody>
        </Table>
      </Section>
        </div>
      </details>

      <Section title='Author Syntax' description='This is the shape authors should write in a post file. No local imports are needed when the blog MDX provider exposes the component map.'>
        <CodeBlock
          language='mdx'
          code={ `# Building durable article interfaces

Markdown handles normal prose, lists, links, headings, and tables.

<Callout type='info'>
  Use MDX components only when the article needs structured UI.
</Callout>

Use <Highlight>inline emphasis</Highlight> sparingly inside prose.

<Details title='Implementation note'>
  Expanded context can stay available without interrupting the main reading path.
</Details>

<Quote text='Good component systems make product code calmer.' author='Gaudi' />

<Faq questions={[
  {
    question: 'Do posts import components?',
    answer: 'No. The blog renderer maps MDX tags to Gaudi primitives and article-owned visualisations.'
  }
]} />` }
        />
      </Section>

      <Section title='Component Map' description='These are author-facing article tags, not generic React examples.'>
        <Table>
          <thead>
            <tr><Th>Need</Th><Th>Use</Th></tr>
          </thead>
          <tbody>
            <tr><Td mono>Supporting note</Td><Td><InlineCode>{'<Aside>'}</InlineCode> or <InlineCode>{'<Callout>'}</InlineCode></Td></tr>
            <tr><Td mono>Expandable context</Td><Td><InlineCode>{'<Details>'}</InlineCode></Td></tr>
            <tr><Td mono>Question-answer content</Td><Td><InlineCode>{'<Faq>'}</InlineCode></Td></tr>
            <tr><Td mono>Inline explanation</Td><Td><InlineCode>{'<Tooltip>'}</InlineCode>, <InlineCode>{'<Highlight>'}</InlineCode>, or <InlineCode>{'<LatexText>'}</InlineCode></Td></tr>
            <tr><Td mono>Links</Td><Td>Write normal markdown links. <InlineCode>remarkLinks</InlineCode> transforms external HTTP links into <InlineCode>{'<Preview>'}</InlineCode>, while <InlineCode>rehypeInternalLinks</InlineCode> transforms matching blog anchors into <InlineCode>{'<Preview internal />'}</InlineCode>.</Td></tr>
            <tr><Td mono>Media</Td><Td><InlineCode>{'<Image>'}</InlineCode>, <InlineCode>{'<Video>'}</InlineCode>, or direct <InlineCode>{'<Preview>'}</InlineCode> for React-only surfaces.</Td></tr>
            <tr><Td mono>Data and diagrams</Td><Td><InlineCode>{'<Chart>'}</InlineCode> variants, markdown tables, <InlineCode>{'<FileTree>'}</InlineCode>, or <InlineCode>{'<Mermaid>'}</InlineCode></Td></tr>
            <tr><Td mono>References</Td><Td>Write <InlineCode>{'[@CitationKey]'}</InlineCode> in prose and list BibTeX files in frontmatter. The blog pipeline emits citation links, reference lists, footnote data, and the Gaudi runtime binds popovers and back-links.</Td></tr>
          </tbody>
        </Table>
      </Section>

      <Section title='Rules For Posts'>
        <CheckList
          items={ [
            'Use markdown first for paragraphs, headings, lists, links, and simple tables.',
            'Use MDX tags for semantic article UI, not layout hacks.',
            'Do not import Gaudi components inside every post; the blog MDX provider owns the mapping.',
            'Always provide labels, captions, alt text, titles, and aria labels where the component needs them.',
            'Keep examples realistic: post content should look like an article, not a component playground.'
          ] }
        />
      </Section>

      <Section title='Component Docs' description='Use the individual MDX pages for props, accessibility notes, and focused examples.'>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
          <QuickLink title='Callout' description='Article notices and supporting context.' storyId='mdx-callout--playground' />
          <QuickLink title='Chart' description='Recharts-powered article data visualization.' storyId='mdx-chart--playground' />
          <QuickLink title='Video' description='Thumbnail-triggered article video embeds.' storyId='mdx-video--playground' />
          <QuickLink title='Citation' description='Reference markers, source popovers, and tracked back-links.' storyId='mdx-citation--playground' />
        </div>
      </Section>
    </Page>
  )
};
