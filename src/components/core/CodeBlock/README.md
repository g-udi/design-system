# CodeBlock

Render source code, streaming code, diffs or prepared highlighted lines with optional line numbers, wrapping, selection and folding. Compose a header and actions through the same CodeBlock context.

```jsx
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle
} from '@gaudi/design-system/core/CodeBlock';

<CodeBlock code={source} language='javascript' showLineNumbers>
  <CodeBlockHeader>
    <CodeBlockTitle>example.js</CodeBlockTitle>
    <CodeBlockCopyButton />
  </CodeBlockHeader>
  <CodeBlockContent />
</CodeBlock>
```

`highlight={false}` renders plain source immediately. `wrap` / `onWrapChange`, `expanded` / `onExpandedChange`, `selectedLines` / `onSelectedLinesChange`, and `folded` / `onFoldedChange` support host-controlled state. Folding uses source line numbers; supplied `foldRegions` can replace indentation-based discovery. Copy and download actions use the current source.

## Implementation ownership

The root owns document state and highlighting. `CodeBlockContext.jsx` shares that state with private line, surface, header and control modules under `components/`. `codeBlockFolding.js` contains the independent fold model; `CodeBlockHighlight.jsx` owns highlighting and source parsing. Consumers use the public owner entry.

Selectable code uses a single focusable grid of source-line rows. Arrow keys, Home and End move the active line; Space or Enter toggles selection, and Shift extends it. Line actions remain real buttons inside a grid cell so their own Enter/Space behavior is preserved.

`CodeBlockCopyButton` announces copy success and failures in a polite live region. A failed attempt stays available as **Retry copy** until the next successful attempt. Override `labels.copy`, `labels.copied`, `labels.retry`, and `labels.error` for translated feedback; `onCopyError` lets the host react to a blocked clipboard.
