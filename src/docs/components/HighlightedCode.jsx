import { CodeBlock, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLanguage } from '../../components/core/CodeBlock';

/** Documentation snippets use the same rendering and copy behavior as product code blocks. */
export const HighlightedCode = ({ code, copyable = true, language = 'jsx' }) => (
  <CodeBlock data-docs-example code={code} language={language} wrap showLineNumbers={false}>
    <CodeBlockHeader>
      <CodeBlockLanguage />
      {copyable ? <CodeBlockCopyButton className='ms-auto' /> : null}
    </CodeBlockHeader>
    <CodeBlockContent />
  </CodeBlock>
);
