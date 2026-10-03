import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';

const messages = [
  {
    name: 'Alex Johnson',
    initials: 'AJ',
    photo: '/avatars/men/32.jpg',
    action: 'sent you a message',
    body: '"I have finished the draft for the new design system. Let me know what you think."',
    buttons: ['View', 'Reply']
  },
  {
    name: 'Sarah Chen',
    initials: 'SC',
    photo: '/avatars/women/44.jpg',
    action: 'mentioned you in a comment',
    body: '"Great work on the profile layout! I added suggestions for the avatar spacing."',
    buttons: ['Dismiss', 'View'],
    invert: true
  }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3'>
      {messages.map(({ name, initials, photo, action, body, buttons, invert }) => (
        <Frame key={name}>
          <FramePanel className='overflow-hidden p-0!'>
            <Alert variant={invert ? 'invert' : 'default'} className='grid-cols-[32px_1fr] gap-x-3 border-0 shadow-none'>
              <Avatar className={invert ? 'border-ui-border/10 size-8 border' : 'size-8 border'}>
                <AvatarImage src={photo} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <AlertTitle className='flex items-center gap-2'>
                <span className='truncate'>{name}</span>
                <span className={invert ? 'text-invert-foreground/60 truncate font-normal' : 'text-ui-muted-foreground truncate font-normal'}>
                  {action}
                </span>
              </AlertTitle>
              <AlertAction>
                <Button size='xs' variant='outline' className={invert ? 'bg-ui-background/10 border-ui-border/10' : undefined}>
                  {buttons[0]}
                </Button>
                <Button size='xs'>{buttons[1]}</Button>
              </AlertAction>
              <AlertDescription className='line-clamp-1'>{body}</AlertDescription>
            </Alert>
          </FramePanel>
        </Frame>
      ))}
    </div>
  );
}
