import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { AvatarGroup } from '@gaudi/design-system/core/Avatar';
import Button from '@gaudi/design-system/core/Button';
import Timeline from '@gaudi/design-system/core/Timeline';
import { Popover, PopoverContent, PopoverTrigger } from '@gaudi/design-system/core/Popover';
import { Attachment, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription } from '@gaudi/design-system/core/Attachment';

export const events = [
  {
    id: 'review',
    title: 'Review requested',
    description: 'Sam asked Lee and you to review the draft.',
    time: '12 minutes ago',
    dateTime: '2026-09-29T10:48:00Z',
    icon: <RegistryIcon lucide='GitPullRequest' className='size-4 text-accent' />,
    children: (
      <div className='mt-2 flex items-center gap-2'>
        <AvatarGroup avatars={[{ id: 'sam', name: 'Sam Rivera' }, { id: 'lee', name: 'Lee Chen' }]} size='sm' label='Reviewers' />
        <Popover>
          <PopoverTrigger asChild><Button size='sm' variant='outline'>Open review</Button></PopoverTrigger>
          <PopoverContent><p className='font-medium'>Knowledge graphs review</p><p className='mt-2 text-sm text-text-muted'>Lee requested a schema diagram before the table. Sam is reviewing the references.</p></PopoverContent>
        </Popover>
      </div>
    )
  },
  {
    id: 'comment',
    title: 'Lee left 3 comments',
    time: '1 hour ago',
    dateTime: '2026-09-29T10:00:00Z',
    icon: <RegistryIcon lucide='MessageSquare' className='size-4' />,
    children: (
      <blockquote className='mt-2 border-s-2 border-border ps-3 text-sm text-text-muted'>
        “Could the schema diagram come before the table?”
      </blockquote>
    )
  },
  {
    id: 'notes',
    title: 'Research notes updated',
    description: 'Three references were added to the bibliography.',
    time: 'Yesterday',
    dateTime: '2026-09-28T16:20:00Z',
    icon: <RegistryIcon lucide='Paperclip' className='size-4' />,
    children: (
      <Attachment className='mt-2'><AttachmentMedia><RegistryIcon lucide='FileText' /></AttachmentMedia><AttachmentContent><AttachmentTitle>references.pdf</AttachmentTitle><AttachmentDescription>2.4 MB</AttachmentDescription></AttachmentContent></Attachment>
    )
  },
  {
    id: 'published',
    title: 'Article published',
    description: 'A practical guide to knowledge graphs is live.',
    time: '2 days ago',
    dateTime: '2026-09-27T09:00:00Z',
    icon: <RegistryIcon lucide='CircleCheck' className='size-4 text-success' />
  }
];

export function PlaygroundDemo({ label = 'Editorial activity', ...props } = {}) {
  return (
    <section className='mx-auto grid max-w-lg gap-3'>
      <div className='flex items-center justify-between gap-2'>
        <h3 className='text-base font-semibold'>{label}</h3>
        <span className='text-xs text-text-muted'>{events.length} events</span>
      </div>
      <Timeline items={events} label={label} {...props} />
    </section>
  );
}
