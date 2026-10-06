'use client';
import { Fragment, useState } from 'react';
import { Calendar } from '@gaudi/design-system/core/Calendar';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger
} from '@gaudi/design-system/core/Attachment';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '@gaudi/design-system/core/Select';
import { Label } from '@gaudi/design-system/core/Field';
import {
  formatBytes,
  useFileUpload
} from '@gaudi/design-system/core/FileUpload';
import { default as Input } from '@gaudi/design-system/core/Input';
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const team = ['Sabine Okafor', 'Ottilie Nakamura', 'Ilse Valtonen', 'Sofia Martins', 'Anouk Varga', 'Lee Park'];
const agendaFile = { id: 'agenda', name: 'offsite-agenda.pdf', size: 482113, type: 'application/pdf' };

export function Pattern() {
  const anchor = useComboboxAnchor();
  const [date, setDate] = useState(new Date(2026, 9, 21));
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Design team offsite');
  const [members, setMembers] = useState(['Sabine Okafor', 'Ilse Valtonen']);
  const [message, setMessage] = useState('');
  const [{ files }, { clearFiles, removeFile, openFileDialog, getInputProps }] = useFileUpload({ multiple: true, maxFiles: 4, initialFiles: [agendaFile] });
  return (
    <form className='bg-surface grid w-full max-w-md gap-4 rounded-lg border p-5' onSubmit={(event) => {
      event.preventDefault();
      setMessage(`Demo schedule created: ${title.trim()}, ${members.length} team members.`);
    }}>
      <h3 className='font-semibold'>New schedule</h3>
      <div className='grid gap-1.5'>
        <Label htmlFor='schedule-title'>Title</Label>
        <Input id='schedule-title' required value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>
      <div className='grid gap-1.5'>
        <Label htmlFor='schedule-members'>Team members</Label>
        <Combobox multiple autoHighlight items={team} value={members} onValueChange={setMembers}>
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(values) => (
                <Fragment>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput id='schedule-members' placeholder='Add people…' />
                </Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No one by that name.</ComboboxEmpty>
            <ComboboxList>
              {(person) => (
                <ComboboxItem key={person} value={person}>
                  {person}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <div className='grid gap-1.5'>
        <Label htmlFor='schedule-date'>Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id='schedule-date' variant='outline' className='justify-start font-normal'>
              <RegistryIcon lucide='CalendarIcon' aria-hidden='true' />
              {date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start' className='w-auto p-0'>
            <Calendar
              mode='single'
              required
              selected={date}
              onSelect={(next) => {
                setDate(next);
                setOpen(false);
              }}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className='grid gap-1.5'>
        <span className='text-sm font-medium'>Attachments</span>
        <Attachment state='idle' size='sm' className='w-full'>
          <AttachmentMedia>
            <RegistryIcon lucide='UploadIcon' aria-hidden='true' />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Add files</AttachmentTitle>
            <AttachmentDescription>Agenda, slides or a venue map, up to 4 files</AttachmentDescription>
          </AttachmentContent>
          <AttachmentTrigger type='button' aria-haspopup='dialog' aria-label='Add attachments' onClick={openFileDialog} />
          <input {...getInputProps()} className='sr-only' tabIndex={-1} aria-label='Add attachments' />
        </Attachment>
        {files.map((entry) => (
          <Attachment key={entry.id} state='idle' size='sm' className='w-full'>
            <AttachmentMedia>
              <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{entry.file.name}</AttachmentTitle>
              <AttachmentDescription>{formatBytes(entry.file.size)}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction type='button' aria-label={`Remove ${entry.file.name}`} onClick={() => removeFile(entry.id)}>
                <RegistryIcon lucide='XIcon' aria-hidden='true' />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </div>
      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={() => {
          setTitle('');
          setMembers([]);
          setDate(new Date(2026, 9, 21));
          clearFiles();
          setMessage('Demo schedule cancelled. The draft has been cleared.');
        }}>
          Cancel
        </Button>
        <Button type='submit'>Create schedule</Button>
      </div>
      {message && <p role='status' className='text-text-muted text-sm'>{message}</p>}
    </form>
  );
}
