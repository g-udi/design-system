import { Children, isValidElement } from 'react';

import { markdownCodeProps } from '../../core/CodeBlock';

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
