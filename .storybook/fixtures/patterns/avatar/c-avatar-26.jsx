import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <Button variant='outline' size='sm' className='rounded-control gap-1 pl-0.5'>
      <Avatar className='border-ui-background size-6 border-2'>
        <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='@alexjohnson' />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <span className='text-xs'>@alexjohnson</span>
    </Button>
  );
}
