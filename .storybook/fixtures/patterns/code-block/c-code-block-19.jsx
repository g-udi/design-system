import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import {
  ScrollArea,
  ScrollBar
} from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
const code = `export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const toggle = () => setTheme((value) => (value === "light" ? "dark" : "light"))
  return { theme, toggle }
}`;
const paletteClass = [
  '[--code-token-keyword:var(--color-rose-600)]',
  '[--code-token-function:var(--color-violet-600)]',
  '[--code-token-string:var(--color-emerald-600)]',
  '[--code-token-string-expression:var(--color-emerald-600)]',
  '[--code-token-constant:var(--color-sky-600)]',
  '[--code-token-parameter:var(--color-amber-600)]',
  '[--code-token-comment:var(--muted-foreground)]',
  '[--code-token-punctuation:var(--foreground)]',
  '[--code-foreground:var(--foreground)]',
  'dark:[--code-token-keyword:var(--color-rose-400)]',
  'dark:[--code-token-function:var(--color-violet-400)]',
  'dark:[--code-token-string:var(--color-emerald-400)]',
  'dark:[--code-token-string-expression:var(--color-emerald-400)]',
  'dark:[--code-token-constant:var(--color-sky-400)]',
  'dark:[--code-token-parameter:var(--color-amber-400)]'
].join(' ');
export function Pattern() {
  return (
    <CodeBlock
      code={code}
      language='typescript'
      showLineNumbers
      themes={{ light: 'css-variables', dark: 'css-variables' }}
      className={'w-full max-w-2xl ' + paletteClass}
    >
      <CodeBlockHeader>
        <CodeBlockTitle>use-theme.ts</CodeBlockTitle>
        <div className='ml-auto flex items-center gap-1.5'>
          <span className='text-ui-muted-foreground text-xs'>
            Colors from design tokens
          </span>
          <CodeBlockCopyButton />
        </div>
      </CodeBlockHeader>

      {/* The ScrollArea composes INSIDE the block, so the block's own border
       and per-style radius stay the container, the header above never
       scrolls, and `max-h` means the area grows to the content instead of
       stretching past a short file. */}
      <ScrollArea className='rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-72'>
        <CodeBlockContent />
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </CodeBlock>
  );
}
