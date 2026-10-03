import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';

const person = { src: '/avatars/men/32.jpg', handle: '@alexjohnson', initials: 'AJ' };

const Face = ({ className }) => (
  <Avatar className={className}>
    <AvatarImage src={person.src} alt='' />
    <AvatarFallback>{person.initials}</AvatarFallback>
  </Avatar>
);

export function Pattern() {
  return (
    <div className='mx-auto flex w-fit flex-wrap items-center gap-2'>
      <Button variant='outline' size='sm' className='gap-1.5'>
        <Face className='size-5' />
        <span className='text-xs'>{person.handle}</span>
      </Button>
      <Button variant='outline' size='sm' className='gap-1 rounded-control ps-0.5'>
        <Face className='size-6 border-2 border-ui-background' />
        <span className='text-xs'>{person.handle}</span>
      </Button>
      <Button size='sm' className='gap-1 rounded-control ps-0.5'>
        <Face className='size-6 border border-ui-primary' />
        <span className='text-xs'>{person.handle}</span>
      </Button>
    </div>
  );
}
