import { useState } from 'react';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '@gaudi/design-system/core/Banner';
import {
  Frame,
  FramePanel
} from '@gaudi/design-system/core/Card';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';

const messages = [
  {
    id: 'alex',
    name: 'Anouk Varga',
    initials: 'AV',
    photo: '/avatars/person-41.svg',
    action: 'sent you a message',
    body: '"I have finished the draft for the new design system. Let me know what you think."',
    buttons: ['View', 'Reply']
  },
  {
    id: 'sarah',
    name: 'Sabine Okafor',
    initials: 'SO',
    photo: '/avatars/person-20.svg',
    action: 'mentioned you in a comment',
    body: '"Great work on the profile layout! I added suggestions for the avatar spacing."',
    buttons: ['Dismiss', 'View'],
    invert: true
  }
];

export function Pattern() {
  const [dismissed, setDismissed] = useState([]);
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3'>
      {messages.filter(({ id }) => !dismissed.includes(id)).map(({ id, name, initials, photo, action, body, buttons, invert }) => (
        <Frame key={name}>
          <FramePanel className='overflow-hidden p-0!'>
            <Alert variant={invert ? 'invert' : 'default'} className='grid-cols-[32px_1fr] gap-x-3 border-0 shadow-none'>
              <Avatar className={invert ? 'border-ui-border/10 size-8 border' : 'size-8 border'}>
                <AvatarImage src={photo} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <AlertTitle className='block'>
                <span>{name}</span>{' '}
                <span className={invert ? 'text-invert-foreground/60 font-normal' : 'text-ui-muted-foreground font-normal'}>
                  {action}
                </span>
              </AlertTitle>
              <AlertAction>
                <Button size='xs' variant={invert ? 'soft' : 'outline'} href={buttons[0] === 'View' ? `/messages/${id}` : undefined} onClick={buttons[0] === 'Dismiss' ? () => setDismissed((ids) => [...ids, id]) : undefined}>
                  {buttons[0]}
                </Button>
                <Button size='xs' href={`/messages/${id}${buttons[1] === 'Reply' ? '?reply=1' : ''}`}>{buttons[1]}</Button>
              </AlertAction>
              <AlertDescription className='line-clamp-1'>{body}</AlertDescription>
            </Alert>
          </FramePanel>
        </Frame>
      ))}
      {dismissed.length ? <Button variant='outline' size='sm' className='justify-self-start' onClick={() => setDismissed([])}>Restore messages</Button> : null}
    </div>
  );
}
