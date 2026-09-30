'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockLineActions,
  CodeBlockTitle,
  useCodeBlockSelection
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const FILE = 'use-mobile.ts';
const PATH = 'src/hooks/use-mobile.ts';
const code = `import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>()

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}`;
function AddToChat({ line, onAdd }) {
  const { selectedLines, clearSelection } = useCodeBlockSelection();
  const batch = selectedLines.length > 0 ? selectedLines : [line];
  return (
    <Button
      type='button'
      size='icon-xs'
      aria-label={
        batch.length > 1
          ? `Reference ${batch.length} selected lines in the chat`
          : `Reference line ${line} in the chat`
      }
      title={
        batch.length > 1
          ? `Reference ${batch.length} lines`
          : `Reference line ${line}`
      }
      onClick={() => {
        onAdd(batch);
        clearSelection();
      }}
      className='size-5'
    >
      <RegistryIcon lucide='PlusIcon' />
    </Button>
  );
}
export function Pattern() {
  const [refs, setRefs] = useState([]);
  const [highlighted, setHighlighted] = useState(null);
  const [selected, setSelected] = useState([]);
  const addLines = (lines) =>
    setRefs((current) =>
      [.../* @__PURE__ */ new Set([...current, ...lines])].sort((a, b) => a - b)
    );
  return (
    <div className='flex w-full max-w-2xl flex-col gap-3'>
      <CodeBlock
        code={code}
        language='typescript'
        showLineNumbers
        selectable
        selectedLines={selected}
        onSelectedLinesChange={setSelected}
        highlightedLines={highlighted === null ? void 0 : [highlighted]}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{FILE}</CodeBlockTitle>
          <div className='ml-auto flex items-center gap-1.5'>
            {selected.length > 0 ? (
              <>
                <Badge variant='primary-light'>
                  {selected.length} selected
                </Badge>
                <Button size='xs' variant='ghost' onClick={() => setSelected([])}>
                  Clear
                </Button>
              </>
            ) : (
              <span className='text-ui-muted-foreground text-xs'>
                Click a line, shift-click to extend, + to reference
              </span>
            )}
          </div>
        </CodeBlockHeader>

        <CodeBlockLineActions side='gutter'>
          {({ line }) => <AddToChat line={line} onAdd={addLines} />}
        </CodeBlockLineActions>
      </CodeBlock>

      {/* The composer the references land in. A Card, not a hand-rolled
       bordered div, so its radius resolves per style. */}
      <Card size='sm' className='gap-2 p-3'>
        <div className='flex flex-wrap items-center gap-1.5'>
          {refs.length === 0 ? (
            <span className='text-ui-muted-foreground px-1 text-sm'>
              Ask about {FILE}...
            </span>
          ) : (
            refs.map((line) => (
              <Badge
                key={line}
                variant={highlighted === line ? 'primary-light' : 'outline'}
                title={`${PATH}:${line}`}
                className='gap-0.5 font-mono'
              >
                {/* Two actions per chip, so two real buttons: the label
       highlights the referenced line in the block above through
       `highlightedLines`, the X removes the reference. */}
                <Button
                  variant='ghost'
                  size='xs'
                  aria-pressed={highlighted === line}
                  aria-label={`Highlight line ${line} in the code`}
                  onClick={() =>
                    setHighlighted((current) =>
                      current === line ? null : line
                    )
                  }
                  className='h-auto p-0 font-mono hover:bg-transparent'
                >
                  {FILE}:{line}
                </Button>
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label={`Remove the reference to line ${line}`}
                  onClick={() => {
                    setRefs((current) =>
                      current.filter((value) => value !== line)
                    );
                    setHighlighted((current) =>
                      current === line ? null : current
                    );
                  }}
                  className='size-4 hover:bg-transparent [&_svg]:size-2.5'
                >
                  <RegistryIcon lucide='XIcon' />
                </Button>
              </Badge>
            ))
          )}
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-ui-muted-foreground text-xs'>
            {refs.length > 0
              ? `${refs.length} ${refs.length === 1 ? 'line' : 'lines'} in context`
              : 'No context yet'}
          </span>
          <Button size='xs' className='ml-auto' disabled={!refs.length}>
            Ask AI
          </Button>
        </div>
      </Card>
    </div>
  );
}
