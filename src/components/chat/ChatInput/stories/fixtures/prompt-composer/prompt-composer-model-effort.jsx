'use client';
import { useState } from 'react';
import { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import { ChatModelSelect } from '@gaudi/design-system/chat/ChatInput';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { Toggle } from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const efforts = ['Low', 'Medium', 'High'];

export function Pattern({ models = [], providers = {} }) {
  const [model, setModel] = useState(models[0]?.value);
  const [effort, setEffort] = useState('Medium');
  const [web, setWeb] = useState(true);
  const [sent, setSent] = useState('');
  const chosen = models.find((item) => item.value === model);
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3'>
      <ChatPromptComposer
        onSubmit={(text) => setSent(`${text} · ${chosen?.label ?? 'Default'} model, ${effort.toLowerCase()} effort${web ? ', web search on' : ''}`)}
        labels={{ placeholder: 'Ask about the archive, or paste a link to check' }}
        toolbar={
          <>
            <ChatModelSelect searchable models={models} providers={providers} value={model} onValueChange={setModel} />
            <ToggleGroup type='single' size='sm' variant='outline' spacing={0} aria-label='Effort' value={effort} onValueChange={(value) => value && setEffort(value)}>
              {efforts.map((level) => <ToggleGroupItem key={level} value={level} className='px-2 text-xs'>{level}</ToggleGroupItem>)}
            </ToggleGroup>
            <Toggle size='sm' variant='outline' pressed={web} onPressedChange={setWeb} aria-label='Search the web' className='px-2 text-xs'>
              <RegistryIcon lucide='Globe' />
              <span className='max-sm:sr-only'>Web</span>
            </Toggle>
          </>
        }
        footer={chosen?.description}
      />
      <p role='status' className='text-text-muted text-sm'>{sent ? `Sent: ${sent}` : ''}</p>
    </div>
  );
}
