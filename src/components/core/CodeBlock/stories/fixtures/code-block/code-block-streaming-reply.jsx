'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
  markdownFences
} from '@gaudi/design-system/core/CodeBlock';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '@gaudi/design-system/core/Card';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  ScrollArea,
  ScrollBar
} from '@gaudi/design-system/core/ScrollArea';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const reply = `Add a route handler that streams the model output:

\`\`\`ts
export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: provider("large"),
    system: "Answer briefly and cite the docs.",
    messages,
    temperature: 0.2,
    maxOutputTokens: 1024,
  })

  result.usage.then((usage) => {
    metrics.record("chat.tokens", usage.totalTokens)
  })

  return result.toUIMessageStreamResponse()
}
\`\`\`

The client hook reads that stream and keeps the transcript in sync.`;
export function Pattern() {
  const [length, setLength] = useState(0);
  useEffect(() => {
    if (length >= reply.length) return;
    const id = window.setTimeout(() => setLength((value) => value + 4), 24);
    return () => window.clearTimeout(id);
  }, [length]);
  const streaming = length < reply.length;
  return (
    <Frame dense className='w-full max-w-2xl'>
      <FrameHeader className='flex-row items-center gap-2'>
        <div className='flex min-w-0 flex-col'>
          <FrameTitle>Assistant</FrameTitle>
          <FrameDescription>
            Generated responses may contain mistakes.
          </FrameDescription>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='ml-auto'
          disabled={streaming}
          onClick={() => setLength(0)}
        >
          <RegistryIcon lucide='RotateCcwIcon' />
          Replay
        </Button>
      </FrameHeader>

      <FramePanel className='flex flex-col gap-3'>
        <div className='flex gap-2'>
          <Avatar className='size-7 shrink-0 rounded-full'>
            <AvatarImage
              src='/avatars/person-20.svg'
              alt='Isaura Stenberg'
            />
            <AvatarFallback>IS</AvatarFallback>
          </Avatar>
          <p className='pt-1 text-sm'>How do I show a reply while it is still being written?</p>
        </div>

        <div className='flex gap-2'>
          <Avatar className='size-7 shrink-0 rounded-full'>
            <AvatarFallback className='bg-ui-muted text-ui-muted-foreground text-xs font-medium'>
              AI
            </AvatarFallback>
          </Avatar>
          <div className='flex min-w-0 flex-1 flex-col gap-2 pt-1'>
            {/* markdownFences splits the partial reply into text and code
             parts; an unclosed fence is still `open` and keeps the caret. */}
            {markdownFences(reply.slice(0, length)).map((part, index) =>
              part.type === 'text' ? (
                <p key={index} className='text-sm whitespace-pre-wrap'>
                  {part.content}
                </p>
              ) : (
                <CodeBlock
                  key={index}
                  code={part.content}
                  language={part.language}
                  showLineNumbers
                  streaming={streaming && part.open}
                >
                  <CodeBlockHeader>
                    <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
                    <CodeBlockLanguage />
                    <div className='ml-auto flex items-center gap-1.5'>
                      <Badge variant={part.open ? 'info-light' : 'success-light'}>
                        {part.open ? 'Generating' : 'Complete'}
                      </Badge>
                      <CodeBlockCopyButton />
                    </div>
                  </CodeBlockHeader>
                  {/* Stick-to-bottom follows the nearest scrolling ancestor,
                   so the caret stays in view inside this capped area. */}
                  <ScrollArea className='rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-48'>
                    <CodeBlockContent />
                    <ScrollBar orientation='horizontal' />
                  </ScrollArea>
                </CodeBlock>
              )
            )}
          </div>
        </div>
      </FramePanel>
    </Frame>
  );
}
