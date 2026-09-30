import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
export function Pattern() {
  return (
    <div className='flex flex-col items-center justify-center gap-6'>
      <div className='flex items-center gap-2.5'>
        <Badge size='sm'>
          3
        </Badge>
        <Badge size='default'>
          3
        </Badge>
        <Badge size='lg'>
          3
        </Badge>
      </div>
      <div className='flex items-center gap-2.5'>
        <Badge size='sm'>
          New
        </Badge>
        <Badge>New</Badge>
        <Badge size='lg'>
          New
        </Badge>
      </div>
      <div className='flex items-center gap-2.5'>
        <Badge size='sm' variant='outline'>
          New
        </Badge>
        <Badge variant='secondary'>
          New
        </Badge>
        <Badge size='lg' variant='success-light'>
          New
        </Badge>
      </div>
    </div>
  );
}
