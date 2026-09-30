import {
  Avatar,
  AvatarFallback
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className='after:border-ui-primary'>
        <AvatarFallback className='bg-ui-primary text-ui-primary-foreground'>
          AB
        </AvatarFallback>
      </Avatar>
      <Avatar className='after:border-ui-destructive'>
        <AvatarFallback className='bg-ui-destructive text-ui-destructive-foreground'>
          AB
        </AvatarFallback>
      </Avatar>
      <Avatar className='after:border-green-500'>
        <AvatarFallback className='bg-green-700 text-white'>AB</AvatarFallback>
      </Avatar>
      <Avatar className='after:border-blue-500'>
        <AvatarFallback className='bg-blue-600 text-white'>CB</AvatarFallback>
      </Avatar>
    </div>
  );
}
