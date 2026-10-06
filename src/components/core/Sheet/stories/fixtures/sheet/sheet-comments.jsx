'use client';
import { useId, useRef, useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Label } from '@gaudi/design-system/core/Field';
import { Badge } from '@gaudi/design-system/core/Pill';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@gaudi/design-system/core/Sheet';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const initial = [
  { id: 1, name: 'Maya Patel', portrait: 'person-23', when: '10:24', text: 'The second paragraph repeats the intro; could we cut it?', likes: 2, liked: false, resolved: false },
  { id: 2, name: 'Leo Martins', portrait: 'person-41', when: '11:02', text: 'Love the new cover. Should the caption credit the photographer?', likes: 1, liked: true, resolved: false },
  { id: 3, name: 'Ana Costa', portrait: 'person-20', when: 'Yesterday', text: 'Fixed the broken link to the RDF primer.', likes: 0, liked: false, resolved: true }
];

// Reply, react and resolve per comment; the switch hides resolved threads.
export function Pattern() {
  const id = useId();
  const filterRef = useRef(null);
  const replyTrigger = useRef(null);
  const [draft, setDraft] = useState('');
  const closeReply = () => { setReplying(null); setDraft(''); replyTrigger.current?.focus(); };
  const [comments, setComments] = useState(initial);
  const [openOnly, setOpenOnly] = useState(true);
  const [replying, setReplying] = useState(null);
  const update = (id, change) => setComments((current) => current.map((comment) => (comment.id === id ? { ...comment, ...change(comment) } : comment)));
  const visible = comments.filter((comment) => !openOnly || !comment.resolved);
  const open = comments.filter((comment) => !comment.resolved).length;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='sm' variant='outline'>
          <RegistryIcon lucide='MessageCircleIcon' aria-hidden='true' />
          Comments
          <Badge size='sm' variant='secondary' className='tabular-nums'>{open}</Badge>
        </Button>
      </SheetTrigger>
      <SheetContent className='gap-0'>
        <SheetHeader className='border-b'>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>{open} open on “Small tools, long lifetimes”</SheetDescription>
          <div className='mt-2 flex items-center gap-2'>
            <Switch ref={filterRef} id={`${id}-comments-open-only`} size='sm' checked={openOnly} onCheckedChange={setOpenOnly} />
            <Label htmlFor={`${id}-comments-open-only`} className='text-sm font-normal'>Open only</Label>
          </div>
        </SheetHeader>
        <ul className='min-h-0 flex-1 divide-y overflow-y-auto'>
          {visible.map((comment) => (
            <li key={comment.id} className='grid gap-2 p-3'>
              <div className='flex items-center gap-2 text-sm'>
                <Avatar className='size-6'>
                  <AvatarImage src={`/avatars/${comment.portrait}.svg`} alt={comment.name} />
                  <AvatarFallback>{comment.name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className='font-medium'>{comment.name}</span>
                <span className='text-text-muted text-xs'>{comment.when}</span>
                {comment.resolved ? <Badge size='sm' variant='success-light' className='ms-auto'>Resolved</Badge> : null}
              </div>
              <p className='text-sm'>{comment.text}</p>
              <div className='flex flex-wrap items-center gap-1'>
                <Button size='xs' variant='ghost' aria-pressed={comment.liked} onClick={() => update(comment.id, (c) => ({ liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) }))}>
                  <RegistryIcon lucide='ThumbsUpIcon' aria-hidden='true' className={comment.liked ? 'text-accent' : undefined} />
                  <span className='tabular-nums'>{comment.likes}</span>
                  <span className='sr-only'>likes</span>
                </Button>
                <Button size='xs' variant='ghost' onClick={(event) => { replyTrigger.current = event.currentTarget; setDraft(''); setReplying(replying === comment.id ? null : comment.id); }}>
                  <RegistryIcon lucide='ReplyIcon' aria-hidden='true' />
                  Reply
                </Button>
                <Button size='xs' variant='ghost' onClick={() => { update(comment.id, (c) => ({ resolved: !c.resolved })); if (openOnly && !comment.resolved) filterRef.current?.focus(); }}>
                  <RegistryIcon lucide={comment.resolved ? 'UndoIcon' : 'CircleCheckIcon'} aria-hidden='true' />
                  {comment.resolved ? 'Reopen' : 'Resolve'}
                </Button>
              </div>
              {comment.replies?.length ? <ul className='grid gap-2 border-s ps-3 text-sm' aria-label={`Replies to ${comment.name}`}>{comment.replies.map((text, index) => <li key={index}><span className='font-medium'>You: </span>{text}</li>)}</ul> : null}
              {replying === comment.id ? (
                <div className='grid gap-2'>
                  <Textarea aria-label={`Reply to ${comment.name}`} rows={2} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder='Write a reply…' />
                  <div className='flex justify-end gap-2'>
                    <Button size='xs' variant='outline' onClick={closeReply}>Cancel</Button>
                    <Button size='xs' disabled={!draft.trim()} onClick={() => { update(comment.id, (c) => ({ replies: [...(c.replies ?? []), draft.trim()] })); closeReply(); }}>Reply</Button>
                  </div>
                </div>
              ) : null}
            </li>
          ))}
          {!visible.length ? <li className='text-text-muted p-6 text-center text-sm'>No open comments.</li> : null}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
