'use client';

/**
 * MDX code components
 *
 * @description Article code renders through the Core CodeBlock: `CodeFence` is the MDX
 * `pre` mapping and `CodeGroup` turns the fences of a `::: code-group` into a
 * CodeBlockGroup. Pair them with `remarkCode` from `@gaudi/design-system/mdx/remark`,
 * which turns fence meta into the attributes read here.
 */

import { Children, isValidElement } from 'react';

import { CodeBlock, CodeBlockCopyButton, CodeBlockGroup, CodeBlockHeader, CodeBlockLanguage, CodeBlockTitle, codeChromeClassName, markdownCodeProps } from '../../core/CodeBlock';
import { cn } from '../../../utilities/cn';

/** Reads code, language and the remarkCode attributes from MDX `pre` props. */
export function readFence(props) {
  const { code, language } = markdownCodeProps(props);
  const meta = Children.toArray(props.children).find(isValidElement)?.props ?? {};
  const startLine = Number(meta['data-start-line'] ?? 1);
  return {
    code: code.replace(/\n$/, ''),
    language,
    title: meta['data-title'],
    highlightedLines: meta['data-highlight'],
    showLineNumbers: 'data-line-numbers' in meta,
    startLine: Number.isFinite(startLine) ? startLine : 1,
    highlightedWords: meta['data-words'] ? JSON.parse(meta['data-words']) : undefined
  };
}

/** MDX `pre`: a fenced block with its title, language and copy button on the code chrome. */
export function CodeFence({ className, ...props }) {
  const { title, ...fence } = readFence(props);
  return (
    <CodeBlock {...fence} className={cn('my-6', codeChromeClassName, className)}>
      {title ? (
        <CodeBlockHeader className='border-(--ds-color-code-chrome-border) bg-(--ds-color-code-chrome-bg)'>
          <CodeBlockTitle>{title}</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className='ml-auto' />
        </CodeBlockHeader>
      ) : (
        <CodeBlockCopyButton />
      )}
    </CodeBlock>
  );
}

/** The fences of a `::: code-group`, one tab each, titled by their labels. */
export function CodeGroup({ children, label, className }) {
  const items = Children.toArray(children).filter(isValidElement).map((child) => readFence(child.props));
  return <CodeBlockGroup items={items} label={label} className={cn('my-6', className)} />;
}

export default CodeFence;
