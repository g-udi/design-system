import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <Button size='sm' className='rounded-control gap-1 pl-0.5'>
      <Avatar className='border-ui-primary size-6 border'>
        <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='@alexjohnson' />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <span className='text-xs'>@alexjohnson</span>
    </Button>
  );
}
