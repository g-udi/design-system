import { CodeFence, CodeGroup } from '../../components/mdx';

import { InlineCode, Page, pageParameters, Section, Table, Td, Th } from '../components/StoryDocs';

const contentlayerSetup = `import { remarkCode } from '@gaudi/design-system/mdx/remark';

export default makeSource({
  mdx: {
    remarkPlugins: [remarkGfm, remarkCode]
  }
});`;

const rendererSetup = `import { CodeFence, CodeGroup } from '@gaudi/design-system/mdx/Code';

const components = {
  CodeGroup,
  pre: CodeFence
};`;

const fenceUsage = '```tsx title="app/page.tsx" {4} showLineNumbers /Button/\nimport { Button } from \'@gaudi/design-system\';\n\nexport default function Page() {\n  return <Button>Read article</Button>;\n}\n```';

const groupUsage = '::: code-group labels=[JavaScript, TypeScript]\n\n```js\nexport default function Page() {\n  return <main>Article</main>;\n}\n```\n\n```tsx\nexport default function Page(): JSX.Element {\n  return <main>Article</main>;\n}\n```\n\n:::';

// The elements MDX produces for a fence once remarkCode has annotated it.
const fence = (code, language, attributes = {}) => (
  <CodeFence key={code}>
    <code className={`language-${language}`} {...attributes}>{code}</code>
  </CodeFence>
);

const CodeHighlightingDocs = () => (
  <Page
    title='Code Highlighting'
    intro='Article code renders through the same Core CodeBlock as the rest of Gaudi: a remark pass reads the fence meta, and the MDX components map every fence and code group to CodeBlock.'
  >
    <Section title='Pipeline' description='One implementation for product and article code: highlighting, copy, line numbers and tabs all come from CodeBlock.'>
      <Table>
        <thead>
          <tr><Th>Layer</Th><Th>Responsibility</Th><Th>Contract</Th></tr>
        </thead>
        <tbody>
          <tr><Td mono>remarkCode</Td><Td>Turns fence meta into attributes and <InlineCode>::: code-group</InlineCode> blocks into <InlineCode>CodeGroup</InlineCode>.</Td><Td><InlineCode>@gaudi/design-system/mdx/remark</InlineCode></Td></tr>
          <tr><Td mono>CodeFence</Td><Td>The MDX <InlineCode>pre</InlineCode> mapping; renders each fence as a CodeBlock with title, language and copy button.</Td><Td>Map as <InlineCode>pre</InlineCode>.</Td></tr>
          <tr><Td mono>CodeGroup</Td><Td>Renders grouped fences as a CodeBlockGroup: one tab per fence on the code chrome.</Td><Td>Map as <InlineCode>CodeGroup</InlineCode>.</Td></tr>
          <tr><Td mono>CodeBlock</Td><Td>Highlights with Shiki on demand, one grammar per language.</Td><Td>Core component; no build-time highlighter.</Td></tr>
        </tbody>
      </Table>
    </Section>

    <Section title='Setup' description='Add the remark plugin where MDX is compiled, then map the two components in the renderer.'>
      {fence(contentlayerSetup, 'js', { 'data-title': 'contentlayer.config.js' })}
      {fence(rendererSetup, 'jsx', { 'data-title': 'MDXLayoutRenderer.js' })}
    </Section>

    <Section title='Fences' description='title= or caption= (or a bare file path) sets the header, {…} highlights lines, showLineNumbers{n} starts the gutter at n and /word/ highlights words.'>
      {fence(fenceUsage, 'mdx')}
      {fence("import { Button } from '@gaudi/design-system';\n\nexport default function Page() {\n  return <Button>Read article</Button>;\n}", 'tsx', { 'data-title': 'app/page.tsx', 'data-highlight': '4', 'data-line-numbers': '', 'data-words': JSON.stringify(['Button']) })}
    </Section>

    <Section title='Tabbed Code' description='Fences between ::: code-group and ::: become one group, each tab titled by its label unless the fence has its own title.'>
      {fence(groupUsage, 'mdx')}
      <CodeGroup label='Code language'>
        {fence('export default function Page() {\n  return <main>Article</main>;\n}', 'js', { 'data-title': 'JavaScript' })}
        {fence('export default function Page(): JSX.Element {\n  return <main>Article</main>;\n}', 'tsx', { 'data-title': 'TypeScript' })}
      </CodeGroup>
    </Section>
  </Page>
);

export default {
  parameters: pageParameters,
  tags: [ '!autodocs' ],
  id: 'mdx-code-highlighting',
  title: 'MDX/Code Highlighting'
};

export const Default = {
  name: 'Overview',
  render: () => <CodeHighlightingDocs />
};
