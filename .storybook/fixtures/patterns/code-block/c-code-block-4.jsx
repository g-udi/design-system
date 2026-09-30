'use client';
import { useEffect, useState } from 'react';
import {
  CodeBlock,
  CodeBlockCopyButton,
  markdownFences
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
const reply = `Use the streaming helper, then render it:

\`\`\`tsx
const { messages } = useChat({ api: "/api/chat" })
\`\`\`

That keeps the transcript in sync.`;
export function Pattern() {
  const [length, setLength] = useState(0);
  useEffect(() => {
    if (length >= reply.length) return;
    const id = window.setTimeout(() => setLength((value) => value + 4), 30);
    return () => window.clearTimeout(id);
  }, [length]);
  const streamed = reply.slice(0, length);
  const streaming = length < reply.length;
  return (
    <Frame dense className='w-full max-w-2xl'>
      <FrameHeader>
        <FrameTitle>Assistant</FrameTitle>
        <FrameDescription>
          Generated responses may contain mistakes.
        </FrameDescription>
      </FrameHeader>

      <FramePanel className='flex flex-col gap-4'>
        <div className='flex gap-3'>
          <Avatar className='size-7 shrink-0 rounded-full'>
            <AvatarImage
              src='static/images/art/7.svg'
              alt='Mira Stone'
            />
            <AvatarFallback className='text-xs font-medium'>
              MS
            </AvatarFallback>
          </Avatar>
          <p className='pt-1 text-sm'>How do I stream chat messages?</p>
        </div>

        <div className='flex gap-3'>
          <Avatar className='size-7 shrink-0 rounded-full'>
            <AvatarFallback className='bg-ui-muted text-ui-muted-foreground text-xs font-medium'>
              AI
            </AvatarFallback>
          </Avatar>
          <div className='flex min-w-0 flex-1 flex-col gap-2 pt-1'>
            {markdownFences(streamed).map((part, index) =>
              part.type === 'text' ? (
                <p key={index} className='text-sm whitespace-pre-wrap'>
                  {part.content}
                </p>
              ) : (
                <CodeBlock
                  key={index}
                  code={part.content}
                  language={part.language}
                  streaming={streaming && part.open}
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              )
            )}
          </div>
        </div>
      </FramePanel>
    </Frame>
  );
}
