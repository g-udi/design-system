'use client';
import { useState } from 'react';
import { PromptComposer } from '../../../../src/components/chat/ChatInput/parts/prompt-composer.jsx';
import { NativeSelect, NativeSelectOption } from '../../../../src/components/core/Select/parts/native-select.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const models = [
  { id: 'fast', label: 'Fast', note: 'Quick edits and short answers' },
  { id: 'balanced', label: 'Balanced', note: 'Most writing and research' },
  { id: 'deep', label: 'Deep', note: 'Long analysis, slower' }
];
const efforts = ['Low', 'Medium', 'High'];

export function Pattern() {
  const [model, setModel] = useState('balanced');
  const [effort, setEffort] = useState('Medium');
  const [web, setWeb] = useState(true);
  const [sent, setSent] = useState('');
  const chosen = models.find((item) => item.id === model);
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3'>
      <PromptComposer
        onSubmit={(text) => setSent(`${text} · ${chosen.label} model, ${effort.toLowerCase()} effort${web ? ', web search on' : ''}`)}
        labels={{ placeholder: 'Ask about the archive, or paste a link to check' }}
        toolbar={
          <>
            <NativeSelect size='sm' aria-label='Model' value={model} onChange={(event) => setModel(event.target.value)} className='w-32'>
              {models.map((item) => <NativeSelectOption key={item.id} value={item.id}>{item.label}</NativeSelectOption>)}
            </NativeSelect>
            <ToggleGroup type='single' size='sm' variant='outline' spacing={0} aria-label='Effort' value={effort} onValueChange={(value) => value && setEffort(value)}>
              {efforts.map((level) => <ToggleGroupItem key={level} value={level} className='px-2 text-xs'>{level}</ToggleGroupItem>)}
            </ToggleGroup>
            <Toggle size='sm' variant='outline' pressed={web} onPressedChange={setWeb} aria-label='Search the web' className='px-2 text-xs'>
              <RegistryIcon lucide='Globe' />
              <span className='max-sm:sr-only'>Web</span>
            </Toggle>
          </>
        }
        footer={chosen.note}
      />
      <p role='status' className='text-text-muted text-sm'>{sent ? `Sent: ${sent}` : ''}</p>
    </div>
  );
}
