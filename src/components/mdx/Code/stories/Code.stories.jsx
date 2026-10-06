import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { CodeFence, CodeGroup } from '../Code';

const docs = getComponentDocs('MDX/Code');
const page = `export default function Page({ posts }) {
  const [query, setQuery] = useState('')
  const visible = posts.filter((post) => post.title.includes(query))
  return <PostList posts={visible} onSearch={setQuery} />
}`;
const install = [
  ['pnpm', 'pnpm add @gaudi/design-system'],
  ['npm', 'npm install @gaudi/design-system'],
  ['yarn', 'yarn add @gaudi/design-system'],
  ['bun', 'bun add @gaudi/design-system']
];
// What an article author writes; remarkCode turns it into the elements rendered below.
const mdx = (args) => `\`\`\`tsx${args.title ? ` title="${args.title}"` : ''}${args.highlightedLines ? ` {${args.highlightedLines}}` : ''}${args.showLineNumbers ? ' showLineNumbers' : ''}
${page}
\`\`\`

::: code-group labels=[${install.map(([label]) => label).join(', ')}]

${install.map(([, command]) => `\`\`\`bash\n${command}\n\`\`\``).join('\n\n')}

:::`;

// The elements MDX compiles a remarkCode-annotated fence to: `pre` (mapped to CodeFence) around `code`.
const fence = (code, language, attributes = {}) => (
  <CodeFence key={code}>
    <code className={`language-${language}`} {...attributes}>{code}</code>
  </CodeFence>
);

export default {
  title: 'MDX/Code',
  id: 'mdx-code',
  component: CodeFence,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { title: 'text', highlightedLines: 'text', showLineNumbers: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { title: 'app/page.tsx', highlightedLines: '2-3', showLineNumbers: true },
  parameters: {
    docs: {
      description: { story: 'An article fence and a `::: code-group`, both rendered through CodeBlock. `title` fills the header, `highlightedLines` takes the `{2-3}` fence spec and `showLineNumbers` adds the gutter; the group gives each fence a tab with its own copy button.' },
      source: { transform: (_, { args }) => mdx(args), language: 'mdx' }
    }
  },
  render: ({ title, highlightedLines, showLineNumbers }) => (
    <div className='text-base leading-7'>
      {fence(page, 'tsx', {
        'data-title': title || undefined,
        'data-highlight': highlightedLines || undefined,
        ...(showLineNumbers ? { 'data-line-numbers': '' } : {})
      })}
      <CodeGroup label='Install'>{install.map(([label, command]) => fence(command, 'bash', { 'data-title': label }))}</CodeGroup>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(args.title)).toBeVisible());
    await userEvent.click(canvas.getByRole('tab', { name: 'bun' }));
    // Highlighting splits code into token spans, so assert on the selected panel's text.
    await waitFor(() => expect(canvas.getByRole('tabpanel', { name: 'bun' })).toHaveTextContent('bun add @gaudi/design-system'));
  }
};
