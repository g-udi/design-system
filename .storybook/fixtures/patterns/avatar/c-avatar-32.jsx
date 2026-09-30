import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='relative w-fit'>
      <Avatar className='ring-offset-background motion-reduce:animate-none animate-pulse ring-2 ring-green-500 ring-offset-2'>
        <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='@alexjohnson' />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <span className='border-ui-background absolute -right-1 -bottom-1 size-3 rounded-full border-2 bg-green-500' />
    </div>
  );
}
