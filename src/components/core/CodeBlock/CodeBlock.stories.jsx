import { expect, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { CodeBlock, CodeBlockCopyButton, CodeBlockExpandButton, CodeBlockHeader, CodeBlockLanguage, CodeBlockTitle } from './index.js';

const docs = getComponentDocs('Core/CodeBlock');
// A small hook long enough for highlighted lines, a start offset and a collapsed line budget to show.
const code = `export function useCart(items: Item[], currency = "EUR") {
  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = Math.round(subtotal * 0.2)
    const total = subtotal + tax
    const label = new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(total)
    return { subtotal, tax, total, label }
  }, [items, currency])
}

export function canCheckout(items: Item[]) {
  return items.length > 0 && items.every((item) => item.quantity > 0)
}`;

export default {
  title: 'Core/Data Display/CodeBlock',
  id: 'core-codeblock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    variant: ['default', 'ghost'],
    showLineNumbers: 'boolean',
    wrap: 'boolean',
    header: 'boolean',
    title: 'text',
    highlightedLines: 'text',
    startLine: 'number',
    maxLines: 'number'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: {
    variant: 'default',
    showLineNumbers: true,
    wrap: false,
    header: true,
    title: 'hooks/use-cart.ts',
    highlightedLines: '3-5',
    startLine: 1,
    maxLines: 0
  },
  parameters: {
    docs: {
      description: { story: 'A TypeScript hook with a file header, language badge and copy button. `highlightedLines` takes a line spec such as `3-5` or `2,7`, `startLine` offsets the gutter, `wrap` soft-wraps the long formatter line, and a `maxLines` above zero collapses the block behind an expand button. Turning `header` off pins the copy button over the code.' },
      source: playgroundSource('CodeBlock', {
        imports: `import { CodeBlock, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLanguage, CodeBlockTitle } from '@gaudi/design-system';\n\nconst code = ${JSON.stringify(code)};`,
        attributes: ['code={code}', "language='typescript'"]
      })
    }
  },
  render: ({ header, title, maxLines, ...args }) => (
    <CodeBlock {...args} code={code} language='typescript' maxLines={maxLines > 0 ? maxLines : undefined} className='w-full max-w-2xl'>
      {header ? (
        <CodeBlockHeader>
          <CodeBlockTitle>{title}</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className='ml-auto' />
        </CodeBlockHeader>
      ) : (
        <CodeBlockCopyButton />
      )}
      {maxLines > 0 ? <CodeBlockExpandButton /> : null}
    </CodeBlock>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('hooks/use-cart.ts')).toBeVisible());
    await expect(canvas.getByText('typescript')).toBeVisible();
    await expect(canvas.getByRole('button', { name: /copy/i })).toBeVisible();
  }
};
