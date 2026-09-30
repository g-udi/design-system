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
export function Pattern() {
  return (
    <div className='mx-auto mb-auto w-full max-w-lg'>
      <Frame>
        <FramePanel className='overflow-hidden p-0!'>
          <Alert className='grid-cols-[32px_1fr] gap-x-3 border-0 shadow-none'>
            <Avatar className='size-8 border'>
              <AvatarImage
                src='https://randomuser.me/api/portraits/men/32.jpg'
                alt='Alex Johnson'
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <AlertTitle className='flex items-center gap-2'>
              <span className='truncate'>Alex Johnson</span>
              <span className='text-ui-muted-foreground truncate font-normal'>
                sent you a message
              </span>
            </AlertTitle>
            <AlertAction>
              <Button size='xs' variant='outline'>
                View
              </Button>
              <Button size='xs'>Reply</Button>
            </AlertAction>
            <AlertDescription className='line-clamp-1'>
              &quot;Hey! I&apos;ve finished the draft for the new design system.
              Let me know what you think when you have a moment.&quot;
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
