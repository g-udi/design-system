'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Message, MessageAvatar, MessageContent, MessageHeader } from '../../../../src/components/core/Message/parts/message.jsx';
import { MessageParts } from '../../../../src/components/core/Message/parts/message-parts.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Each stage of the handoff, so the example can be stepped through.
const stages = [
  { delegation: 'running', tools: ['running', 'pending'], text: null },
  { delegation: 'running', tools: ['done', 'running'], text: null },
  { delegation: 'done', tools: ['done', 'done'], text: 'The research agent found **two** posts that already cover sync conflicts. I linked them from the draft instead of repeating the explanation.' }
];

export function Pattern() {
  const [stage, setStage] = useState(0);
  const current = stages[stage];
  const parts = [
    { type: 'reasoning', duration: 6, text: 'The question needs a sweep of the archive, which the research agent does faster with its own index. I will hand it the brief and check its answer.' },
    {
      type: 'delegation',
      agent: { name: 'Research agent' },
      status: current.delegation,
      instructions: 'Find existing posts about sync conflicts and say whether the new draft repeats them.',
      parts: [
        { type: 'tool', name: 'search_archive', description: 'sync conflict OR merge', status: current.tools[0], output: current.tools[0] === 'done' ? [{ post: 'Merging offline edits', year: 2024 }, { post: 'CRDTs for writers', year: 2025 }] : undefined },
        { type: 'tool', name: 'compare_drafts', description: 'New draft against both matches', status: current.tools[1], output: current.tools[1] === 'done' ? { overlap: '38%', repeatedSections: ['How merges work'] } : undefined }
      ]
    },
    ...(current.text ? [{ type: 'text', text: current.text }] : [])
  ];
  const done = stage === stages.length - 1;
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-3'>
      <Message>
        <MessageAvatar className='self-start'>
          <span className='bg-accent-subtle text-accent grid size-8 place-items-center rounded-full'>
            <RegistryIcon lucide='Sparkles' className='size-4' />
          </span>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader className='px-0'>Gaudi</MessageHeader>
          <MessageParts parts={parts} streaming={!done} />
        </MessageContent>
      </Message>
      <div className='flex justify-end gap-2'>
        <Button size='xs' variant='outline' disabled={stage === 0} onClick={() => setStage(0)}>Restart</Button>
        <Button size='xs' disabled={done} onClick={() => setStage((value) => Math.min(value + 1, stages.length - 1))}>
          Next step
          <RegistryIcon lucide='ArrowRight' />
        </Button>
      </div>
      <span role='status' className='sr-only'>{done ? 'The research agent finished.' : `Step ${stage + 1} of ${stages.length}.`}</span>
    </div>
  );
}
