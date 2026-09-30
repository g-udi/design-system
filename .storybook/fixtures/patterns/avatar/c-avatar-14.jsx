import {
  Avatar,
  AvatarFallback
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className='after:border-ui-primary/10'>
        <AvatarFallback className='bg-ui-primary/10 text-ui-primary-strong'>
          AB
        </AvatarFallback>
      </Avatar>
      <Avatar className='after:border-ui-destructive/10'>
        <AvatarFallback className='bg-ui-destructive/10 text-ui-danger-ink'>
          DV
        </AvatarFallback>
      </Avatar>
      <Avatar className='after:border-green-200 dark:after:border-green-600'>
        <AvatarFallback className='bg-green-50 text-green-700 dark:text-green-300 dark:bg-green-900'>
          SB
        </AvatarFallback>
      </Avatar>
      <Avatar className='after:border-fuchsia-200 dark:after:border-fuchsia-600'>
        <AvatarFallback className='bg-fuchsia-50 text-fuchsia-700 dark:text-fuchsia-300 dark:bg-fuchsia-900'>
          DB
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
