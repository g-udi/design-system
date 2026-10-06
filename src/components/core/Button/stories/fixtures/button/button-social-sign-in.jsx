import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Provider marks come from Gaudi's icon registry; Google keeps its own colours, the others follow the text colour.
const providers = [
  { name: 'Google', icon: 'Google' },
  { name: 'X', icon: 'Twitter' },
  { name: 'Apple', icon: 'Apple' },
  { name: 'GitHub', icon: 'Github' }
];

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-3'>
      <div className='flex flex-col gap-2'>
        {providers.map(({ name, icon }) => (
          <Button key={name} variant='outline' tone='neutral'>
            <RegistryIcon lucide={icon} aria-hidden='true' size={16} />
            <span><span className='text-text-muted'>Continue with</span> {name}</span>
          </Button>
        ))}
      </div>
      <div className='flex gap-2'>
        {providers.map(({ name, icon }) => (
          <Button key={name} size='icon' variant='outline' tone='neutral' className='flex-1' aria-label={`Continue with ${name}`}>
            <RegistryIcon lucide={icon} aria-hidden='true' size={16} />
          </Button>
        ))}
      </div>
      <Button>
        <RegistryIcon lucide='MailIcon' aria-hidden='true' />
        Continue with email
      </Button>
    </div>
  );
}
