import { Avatar } from '../../../src/components/core/Avatar/index.js';
import { default as Icon } from '../../../src/components/core/Icon/index.js';

export function IdentityFallbacks() {
  return (
    <div className='grid w-full max-w-lg gap-5'>
      <div className='flex flex-wrap gap-6'>
        <div className='grid justify-items-center gap-2'><Avatar name='Research library' surface='plain' size='lg' shape='tile' fallback={<Icon name='BookOpen' decorative size='lg' />} /><span className='text-xs text-ui-muted-foreground'>Workspace</span></div>
        <div className='grid justify-items-center gap-2'><Avatar name='External source' surface='bare' size='lg' fallback={<Icon name='Globe' decorative size='lg' />} /><span className='text-xs text-ui-muted-foreground'>Source</span></div>
        <div className='grid justify-items-center gap-2'><Avatar name='Guest account' surface='tinted' size='lg' shape='circle' fallback /><span className='text-xs text-ui-muted-foreground'>Guest</span></div>
      </div>
      <ul className='grid gap-4'>
        {['Élodie Brontë', 'محمد أحمد', '李明', 'Alexandria Cassandra Montgomery-Wellington'].map((name) => (
          <li key={name} className='flex min-w-0 items-center gap-3' dir={name === 'محمد أحمد' ? 'rtl' : undefined}>
            <Avatar name={name} shape='circle' surface='tinted' alt='' />
            <span className='min-w-0 break-words text-sm'>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
