'use client';
import { useState } from 'react';
import Dialog from '@gaudi/design-system/core/Dialog';
import { SwitchRoot } from '@gaudi/design-system/core/Switch';
import { FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Button } from '@gaudi/design-system/core/Button';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const Row = ({ label, gap = 'gap-2', children }) => (
  <>
    <span className='text-xs text-text-muted'>{label}</span>
    <div className={`flex flex-wrap items-center ${gap}`}>{children}</div>
  </>
);

const project = 'https://github.com/g-udi/design-system';
export function Pattern() {
  const [items, setItems] = useState(1);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showItems, setShowItems] = useState(true);
  const [removing, setRemoving] = useState(false);
  const add = () => {
    setItems((count) => count + 1);
    setShowItems(true);
  };
  const download =
    'data:text/plain;charset=utf-8,' +
    encodeURIComponent(Array.from({ length: items }, (_, i) => `Note ${i + 1}`).join('\n'));

  return (
    <div className='mx-auto grid w-full max-w-3xl grid-cols-[5.5rem_1fr] items-center gap-x-3 gap-y-3'>
      <Row label='Leading icon'>
        <Button asChild>
          <a href={download} download='notes.txt'>
            <RegistryIcon lucide='CloudDownloadIcon' aria-hidden='true' />
            Download
          </a>
        </Button>
        <Button href={project} variant='secondary'>
          <RegistryIcon lucide='GithubIcon' aria-hidden='true' />
          GitHub
        </Button>
        <Button variant='outline' onClick={add}>
          <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
          Add item
        </Button>
        <Button variant='ghost' onClick={() => setOptionsOpen(true)}>
          <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
          Settings
        </Button>
        <Button variant='destructive' disabled={!items} onClick={() => setRemoving(true)}>
          <RegistryIcon lucide='Trash2Icon' aria-hidden='true' />
          Remove note
        </Button>
      </Row>
      <Row label='Trailing icon'>
        <Button href={project + '#readme'}>
          Get started
          <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' />
        </Button>
        <Button href={project} variant='secondary'>
          Open project
          <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
        </Button>
        <Button variant='outline' onClick={() => setOptionsOpen(true)}>
          Options
          <RegistryIcon lucide='Settings2Icon' aria-hidden='true' />
        </Button>
        <Button variant='ghost' aria-pressed={showItems} onClick={() => setShowItems(!showItems)}>
          {showItems ? 'Hide notes' : 'Show notes'}
          <RegistryIcon lucide='LogOutIcon' aria-hidden='true' />
        </Button>
        <Button variant='destructive' disabled={!items} onClick={() => setRemoving(true)}>
          Remove note
          <RegistryIcon lucide='CircleAlertIcon' aria-hidden='true' />
        </Button>
      </Row>
      <Row label='Icon only'>
        <Button size='icon-xs' variant='outline' aria-label='Hide notes' onClick={() => setShowItems(false)}>
          <RegistryIcon lucide='XIcon' aria-hidden='true' />
        </Button>
        <Button size='icon-sm' variant='ghost' aria-label='Show notes' onClick={() => setShowItems(true)}>
          <RegistryIcon lucide='EyeIcon' aria-hidden='true' />
        </Button>
        <Button size='icon' variant='secondary' aria-label='Note options' onClick={() => setOptionsOpen(true)}>
          <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
        </Button>
        <Button size='icon-lg' aria-label='Add a note' onClick={add}>
          <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
        </Button>
      </Row>
      <Row label='Loading'>
        <Button disabled>
          <Loader aria-hidden='true' />
          Please wait
        </Button>
        <Button variant='outline' disabled>
          <Loader aria-hidden='true' />
          Uploading
        </Button>
      </Row>
      <Row label='Links' gap='gap-x-4 gap-y-2'>
        <Button asChild variant='outline'>
          <a href={project}>Back to home</a>
        </Button>
        <Button variant='link' href='https://design.gaudi.site/docs'>
          <RegistryIcon lucide='HelpCircleIcon' aria-hidden='true' />
          Gaudi docs
        </Button>
        <Button variant='link' className='group/back' asChild>
          <a href={project}>
            <RegistryIcon
              lucide='ChevronLeftIcon'
              aria-hidden='true'
              className='transition-transform duration-200 group-hover/back:-translate-x-1'
            />
            Go back
          </a>
        </Button>
        <Button variant='link' className='group/docs' asChild>
          <a href={project + '#readme'}>
            View documentation
            <RegistryIcon
              lucide='ArrowUpRightIcon'
              aria-hidden='true'
              className='transition-transform duration-200 group-hover/docs:rotate-45'
            />
          </a>
        </Button>
      </Row>
      <Row label='Hover reveal'>
        <Button href={project + '#readme'} className='group/slide relative overflow-hidden px-6'>
          <span className='transition-transform duration-300 group-hover/slide:-translate-x-2'>Get started</span>
          <RegistryIcon
            lucide='ArrowRightIcon'
            aria-hidden='true'
            className='absolute right-2 translate-x-8 opacity-0 transition-all duration-300 group-hover/slide:translate-x-0 group-hover/slide:opacity-100'
          />
        </Button>
        <Button
          onClick={add}
          aria-label='Create new'
          className='group/fab relative w-8 justify-start overflow-hidden px-2 transition-[width] duration-300 hover:w-28 focus-visible:w-28'
        >
          <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
          <span className='opacity-0 transition-opacity duration-300 group-hover/fab:opacity-100 group-focus-visible/fab:opacity-100'>
            Create new
          </span>
        </Button>
      </Row>
      <Row label='Notes'>
        <p role='status' className='text-sm'>
          {showItems
            ? showNumbers
              ? `${items} ${items === 1 ? 'note' : 'notes'} in the notebook`
              : 'Notebook open'
            : 'Notebook hidden'}
        </p>
      </Row>
      <Dialog open={optionsOpen} onOpenChange={setOptionsOpen} title='Notebook options'>
        <FieldLabel>
          <SwitchRoot checked={showNumbers} onCheckedChange={setShowNumbers} />
          Show note count
        </FieldLabel>
      </Dialog>
      <Dialog
        variant='confirmation'
        open={removing}
        onOpenChange={setRemoving}
        title='Remove the latest note?'
        description='This changes the example notebook.'
        confirmLabel='Remove note'
        onConfirm={() => setItems((count) => Math.max(0, count - 1))}
      />
    </div>
  );
}
