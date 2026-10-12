import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { CodeBlock, CodeBlockCopyButton, CodeBlockExpandButton, CodeBlockHeader, CodeBlockLanguage, CodeBlockTitle } from '../index.js';

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
    onCopyClick: fn(),
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
      source: { type: 'code', language: 'jsx', transform: (_source, { args: { header, title, maxLines, onCopyClick: _onCopyClick, ...args } }) => previewSource('CodeBlock', { ...args, maxLines: maxLines > 0 ? maxLines : undefined }, {
        imports: `import { CodeBlock, CodeBlockCopyButton, CodeBlockExpandButton, CodeBlockHeader, CodeBlockLanguage, CodeBlockTitle } from '@gaudi/design-system';\n\nconst code = ${JSON.stringify(code)};`,
        attributes: ['code={code}', "language='typescript'"],
        children: `${header ? `<CodeBlockHeader><CodeBlockTitle>{${JSON.stringify(title)}}</CodeBlockTitle><CodeBlockLanguage /><CodeBlockCopyButton className='ml-auto' /></CodeBlockHeader>` : '<CodeBlockCopyButton />'}${maxLines > 0 ? '\n<CodeBlockExpandButton />' : ''}`
      }) }
    }
  },
  render: ({ header, title, maxLines, onCopyClick, ...args }) => (
    <CodeBlock {...args} code={code} language='typescript' maxLines={maxLines > 0 ? maxLines : undefined} className='w-full max-w-2xl'>
      {header ? (
        <CodeBlockHeader>
          <CodeBlockTitle>{title}</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className='ml-auto' onClick={onCopyClick} />
        </CodeBlockHeader>
      ) : (
        <CodeBlockCopyButton onClick={onCopyClick} />
      )}
      {maxLines > 0 ? <CodeBlockExpandButton /> : null}
    </CodeBlock>
  ),
  play: async (context) => {
    const { args, canvasElement } = context;
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('hooks/use-cart.ts')).toBeVisible());
    await expect(canvas.getByText('typescript')).toBeVisible();
    await expect(getComputedStyle(canvas.getByText('typescript')).textTransform).toBe('none');
    await expect(canvas.getByRole('button', { name: /copy/i })).toBeVisible();
    const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const execDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand');
    const writeText = fn().mockRejectedValueOnce(new Error('Clipboard denied')).mockResolvedValue(undefined);
    try {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
      Object.defineProperty(document, 'execCommand', { configurable: true, value: () => false });
      args.onCopyClick.mockImplementationOnce((event) => event.preventDefault());
      await userEvent.click(canvas.getByRole('button', { name: 'Copy code' }));
      await expect(writeText).not.toHaveBeenCalled();
      await userEvent.click(canvas.getByRole('button', { name: 'Copy code' }));
      const retry = await canvas.findByRole('button', { name: 'Retry copy' });
      await expect(canvasElement.querySelector('[data-slot="code-block-copy-status"]')).toHaveTextContent('Copy failed. Try again.');
      if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
        const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
        await auditStoryLayout({ ...context, id: `${context.id}--copy-failed` });
      }
      await userEvent.click(retry);
      await expect(await canvas.findByRole('button', { name: 'Copied' })).toBeVisible();
      await expect(canvasElement.querySelector('[data-slot="code-block-copy-status"]')).toHaveTextContent('Code copied.');
      await expect(writeText).toHaveBeenLastCalledWith(code);
      await expect(args.onCopyClick).toHaveBeenCalledTimes(3);
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Copy code' })).toBeVisible(), { timeout: 3000 });
    } finally {
      if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
      else delete navigator.clipboard;
      if (execDescriptor) Object.defineProperty(document, 'execCommand', execDescriptor);
      else delete document.execCommand;
    }
  }
};
