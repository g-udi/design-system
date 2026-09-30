import { RiFacebookFill, RiGithubFill, RiGoogleFill, RiTwitterXFill } from '@remixicon/react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Brand marks keep their own colours in light mode and switch to the text colour in dark mode.
const providers = [
  { name: 'Google', Icon: RiGoogleFill, color: 'text-[#DB4437]' },
  { name: 'X', Icon: RiTwitterXFill, color: 'text-[#14171a]' },
  { name: 'Facebook', Icon: RiFacebookFill, color: 'text-[#1877f2]' },
  { name: 'GitHub', Icon: RiGithubFill, color: 'text-[#333333]' }
];

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-3'>
      <div className='flex flex-col gap-2'>
        {providers.map(({ name, Icon, color }) => (
          <Button key={name} variant='outline' tone='neutral'>
            <Icon aria-hidden='true' size={16} className={`${color} dark:text-text`} />
            <span><span className='text-text-muted'>Continue with</span> {name}</span>
          </Button>
        ))}
      </div>
      <div className='flex gap-2'>
        {providers.map(({ name, Icon, color }) => (
          <Button key={name} size='icon' variant='outline' tone='neutral' className='flex-1' aria-label={`Continue with ${name}`}>
            <Icon aria-hidden='true' size={16} className={`${color} dark:text-text`} />
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
