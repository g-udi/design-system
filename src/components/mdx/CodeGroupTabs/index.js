export { default } from './CodeGroupTabs';
export * from './CodeGroupTabs';

// Composition exports
export { codeBlockLanguages, codeBlockThemes, DEFAULT_CODE_BLOCK_THEMES, resolveCodeBlockLanguage, parseLineSpec, normalizeCode, buildWordDecorations, stripNotationComments, toPlainLines, markdownCodeProps, markdownFences, highlightCode, resetCodeBlockHighlighter, ansiToLines, parseUnifiedDiff } from './parts/code-block-highlight-extended.jsx';
export { CodeBlock, CodeBlockCopyButton, CodeBlockDownloadButton, CodeBlockExpandButton, CodeBlockHeader, CodeBlockLanguage, CodeBlockLineActions, CodeBlockTitle, CodeBlockContent, CodeBlockWrapToggle, useCodeBlockConfig, useCodeBlockFolding, useCodeBlockSelection } from './parts/code-block-extended.jsx';
