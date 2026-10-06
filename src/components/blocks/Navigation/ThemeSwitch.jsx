'use client';

import { useTheme } from 'next-themes';
import { useIsClient } from '../../../hooks/environment/use-is-client.js';
import Button from '../../core/Button';
import Icon from '../../core/Icon';

/** Toggle the resolved light/dark appearance, including when the preference is system. */
export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useIsClient();
  const dark = mounted && resolvedTheme === 'dark';

  return (
    <Button
      variant='ghost'
      tone='neutral'
      size='icon'
      className='size-11'
      aria-label='Toggle Dark Mode'
      aria-pressed={dark}
      disabled={!mounted}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      <Icon name={dark ? 'MoonFill' : 'SunFill'} decorative className='size-5 lg:size-4' />
    </Button>
  );
}
