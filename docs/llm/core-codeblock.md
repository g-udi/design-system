# CodeBlock

> Core/CodeBlock · core · `@gaudi/design-system/core/CodeBlock`

CodeBlock renders syntax-highlighted source with an optional header, copy button, line numbers, highlighted and focused lines, diffs, folding and line selection.

Use CodeBlock for any source code in product or article surfaces. Compose the header from CodeBlockTitle, CodeBlockLanguage and the action buttons; pair it with Tabs for grouped files or package-manager commands.

## Import

```js
import CodeBlock from '@gaudi/design-system/core/CodeBlock';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `CodeBlock`, `CodeBlockContent`, `CodeBlockCopyButton`, `CodeBlockDownloadButton`, `CodeBlockExpandButton`, `CodeBlockGroup`, `CodeBlockHeader`, `CodeBlockLanguage`, `CodeBlockLineActions`, `CodeBlockTitle`, `CodeBlockWrapToggle`, `DEFAULT_CODE_BLOCK_THEMES`, `ansiToLines`, `buildWordDecorations`, `codeBlockLanguages`, `codeBlockThemes`, `codeChromeClassName`, `default`, `highlightCode`, `markdownCodeProps`, `markdownFences`, `normalizeCode`, `parseLineSpec`, `parseUnifiedDiff`, `resetCodeBlockHighlighter`, `resolveCodeBlockLanguage`, `stripNotationComments`, `toPlainLines`, `useCodeBlockConfig`, `useCodeBlockFolding`, `useCodeBlockSelection`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | no | Source text to render. |
| `language` | `string` | — | no | Grammar name or alias such as tsx, python, bash or sql. Unknown languages render as plain text. |
| `variant` | `default \| ghost` | `default` | no | default draws the bordered surface; ghost is transparent for use inside another frame. |
| `showLineNumbers` | `boolean` | `false` | no | Shows the line-number gutter. |
| `startLine` | `number` | `1` | no | First line number in the gutter. |
| `wrap / defaultWrap / onWrapChange` | `boolean / (wrap) => void` | `false` | no | Controlled or initial soft wrapping of long lines. |
| `highlightedLines` | `string \| number[]` | — | no | Lines to emphasise, as a spec like 3-5,9 or an array. |
| `focusedLines` | `string \| number[]` | — | no | Lines kept sharp while the rest are dimmed. |
| `maxLines` | `number` | — | no | Collapses longer code to this many lines; add CodeBlockExpandButton to reveal the rest. |
| `diff` | `boolean \| diff options` | — | no | Marks added and removed lines. |
| `themes` | `{ light, dark }` | `github-light / github-dark` | no | Shiki themes per colour scheme; css-variables reads --code-token-* design tokens. |
| `foldable / selectable` | `boolean` | `false` | no | Enables fold regions and gutter line selection. |
| `children` | `ReactNode` | — | no | Header and action parts: CodeBlockHeader, CodeBlockTitle, CodeBlockLanguage, CodeBlockCopyButton, CodeBlockWrapToggle, CodeBlockExpandButton, CodeBlockDownloadButton. |
| `className` | `string` | — | no | Root class override. |

## Variants

- `variant`: `default`, `ghost`

## Usage

```jsx
import { CodeBlock, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLanguage, CodeBlockTitle } from '@gaudi/design-system';

<CodeBlock code={code} language='typescript' showLineNumbers highlightedLines='3-5'>
  <CodeBlockHeader>
    <CodeBlockTitle>hooks/use-cart.ts</CodeBlockTitle>
    <CodeBlockLanguage />
    <CodeBlockCopyButton className='ml-auto' />
  </CodeBlockHeader>
</CodeBlock>
```

## Accessibility

The code region is a labelled, keyboard-scrollable region; the copy, wrap, expand and download buttons have accessible names and announce their result. Line numbers, fold markers and decorations are hidden from assistive technology and never copied.

## Examples

- Playground (Storybook `core-codeblock--playground`)

Curated patterns:

- Quoted lines in a chat answer — registry item `@gaudi/code-block-chat-references` (uses `Badge`, `Button`, `CardRoot`, `CodeBlock`, `CodeBlockHeader`, `CodeBlockLineActions`, `CodeBlockTitle`, `RegistryIcon`, `useCodeBlockSelection`)
- Diagnostics with fixes — registry item `@gaudi/code-block-diagnostics` (uses `Badge`, `Button`, `CodeBlock`, `CodeBlockHeader`, `CodeBlockLineActions`, `CodeBlockTitle`, `RegistryIcon`)
- Find within a long file — registry item `@gaudi/code-block-file-search` (uses `Badge`, `Button`, `ButtonGroup`, `CodeBlock`, `CodeBlockContent`, `CodeBlockCopyButton`, `CodeBlockHeader`, `CodeBlockTitle`, `FieldInput`, `RegistryIcon`, `ScrollArea`, `ScrollBar`, `useCodeBlockConfig`)
- Long file with folding — registry item `@gaudi/code-block-folding` (uses `Button`, `CodeBlock`, `CodeBlockContent`, `CodeBlockCopyButton`, `CodeBlockExpandButton`, `CodeBlockHeader`, `CodeBlockTitle`, `ScrollArea`, `ScrollBar`, `cn`, `useCodeBlockConfig`)
- Line states — registry item `@gaudi/code-block-line-states` (uses `Badge`, `CodeBlock`, `CodeBlockCopyButton`, `CodeBlockHeader`, `CodeBlockTitle`, `Label`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Code block options — registry item `@gaudi/code-block-options` (uses `CodeBlock`, `CodeBlockContent`, `CodeBlockCopyButton`, `CodeBlockHeader`, `CodeBlockLanguage`, `CodeBlockTitle`, `Label`, `ScrollArea`, `ScrollBar`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`)
- Patch review — registry item `@gaudi/code-block-patch-review` (uses `Badge`, `Button`, `CardContent`, `CardFooter`, `CardRoot`, `CodeBlock`, `CodeBlockDownloadButton`, `CodeBlockHeader`, `CodeBlockTitle`, `Frame`, `FramePanel`, `ScrollArea`, `ToggleGroupItem`, `ToggleGroupRoot`, `parseUnifiedDiff`)
- Streaming assistant reply — registry item `@gaudi/code-block-streaming-reply` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CodeBlock`, `CodeBlockContent`, `CodeBlockCopyButton`, `CodeBlockHeader`, `CodeBlockLanguage`, `CodeBlockTitle`, `Frame`, `FrameDescription`, `FrameHeader`, `FramePanel`, `FrameTitle`, `RegistryIcon`, `ScrollArea`, `ScrollBar`, `markdownFences`)
- Tabbed code — registry item `@gaudi/code-block-tabbed` (uses `CodeBlockGroup`)
- Shell session with output — registry item `@gaudi/code-block-terminal-output` (uses `CodeBlock`, `CodeBlockCopyButton`, `CodeBlockHeader`, `CodeBlockTitle`, `CodeBlockWrapToggle`, `ToggleGroupItem`, `ToggleGroupRoot`, `ansiToLines`)

## Related

`core-tabs`

## README

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

### Implementation ownership

The root owns document state and highlighting. `CodeBlockContext.jsx` shares that state with private line, surface, header and control modules under `components/`. `codeBlockFolding.js` contains the independent fold model; `CodeBlockHighlight.jsx` owns highlighting and source parsing. Consumers use the public owner entry.

Selectable code uses a single focusable grid of source-line rows. Arrow keys, Home and End move the active line; Space or Enter toggles selection, and Shift extends it. Line actions remain real buttons inside a grid cell so their own Enter/Space behavior is preserved.

`CodeBlockCopyButton` announces copy success and failures in a polite live region. A failed attempt stays available as **Retry copy** until the next successful attempt. Override `labels.copy`, `labels.copied`, `labels.retry`, and `labels.error` for translated feedback; `onCopyError` lets the host react to a blocked clipboard.
