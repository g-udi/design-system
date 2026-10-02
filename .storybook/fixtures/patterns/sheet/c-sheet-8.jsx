'use client';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../src/components/core/Sheet/parts/sheet.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const initial = [
  { id: 1, name: 'Maya Patel', portrait: 'women/65', when: '10:24', text: 'The second paragraph repeats the intro; could we cut it?', likes: 2, liked: false, resolved: false },
  { id: 2, name: 'Leo Martins', portrait: 'men/32', when: '11:02', text: 'Love the new cover. Should the caption credit the photographer?', likes: 1, liked: true, resolved: false },
  { id: 3, name: 'Ana Costa', portrait: 'women/44', when: 'Yesterday', text: 'Fixed the broken link to the RDF primer.', likes: 0, liked: false, resolved: true }
];

// Reply, react and resolve per comment; the switch hides resolved threads.
export function Pattern() {
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
            <Switch id='comments-open-only' size='sm' checked={openOnly} onCheckedChange={setOpenOnly} />
            <Label htmlFor='comments-open-only' className='text-sm font-normal'>Open only</Label>
          </div>
        </SheetHeader>
        <ul className='min-h-0 flex-1 divide-y overflow-y-auto'>
          {visible.map((comment) => (
            <li key={comment.id} className='grid gap-2 p-3'>
              <div className='flex items-center gap-2 text-sm'>
                <Avatar className='size-6'>
                  <AvatarImage src={`https://randomuser.me/api/portraits/${comment.portrait}.jpg`} alt={comment.name} />
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
                <Button size='xs' variant='ghost' onClick={() => setReplying(replying === comment.id ? null : comment.id)}>
                  <RegistryIcon lucide='ReplyIcon' aria-hidden='true' />
                  Reply
                </Button>
                <Button size='xs' variant='ghost' onClick={() => update(comment.id, (c) => ({ resolved: !c.resolved }))}>
                  <RegistryIcon lucide={comment.resolved ? 'UndoIcon' : 'CircleCheckIcon'} aria-hidden='true' />
                  {comment.resolved ? 'Reopen' : 'Resolve'}
                </Button>
              </div>
              {replying === comment.id ? (
                <div className='grid gap-2'>
                  <Textarea aria-label={`Reply to ${comment.name}`} rows={2} placeholder='Write a reply…' />
                  <div className='flex justify-end gap-2'>
                    <Button size='xs' variant='outline' onClick={() => setReplying(null)}>Cancel</Button>
                    <Button size='xs' onClick={() => setReplying(null)}>Reply</Button>
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
