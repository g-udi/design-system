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
          <Alert
            variant='invert'
            className='grid-cols-[32px_1fr] gap-x-3 border-0 shadow-none'
          >
            <Avatar className='border-ui-border/10 size-8 border'>
              <AvatarImage
                src='https://randomuser.me/api/portraits/women/44.jpg'
                alt='Sarah Chen'
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <AlertTitle className='flex items-center gap-2'>
              <span className='truncate'>Sarah Chen</span>
              <span className='text-invert-foreground/60 truncate font-normal'>
                mentioned you in a comment
              </span>
            </AlertTitle>
            <AlertAction>
              <Button
                variant='outline'
                size='xs'
                className='bg-ui-background/10 border-ui-border/10'
              >
                Dismiss
              </Button>
              <Button
                size='xs'
                className='border-blue-800 bg-blue-600 text-white hover:border-blue-900 hover:bg-blue-600'
              >
                View
              </Button>
            </AlertAction>
            <AlertDescription className='text-invert-foreground/70 line-clamp-1'>
              &quot;Great work on the user profile layout! I&apos;ve added some
              suggestions for the avatar spacing.&quot;
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
