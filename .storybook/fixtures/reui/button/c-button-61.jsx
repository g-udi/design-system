// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [theme, setTheme] = useState('light');
  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <RegistryIcon
        lucide='SunIcon'
        className={cn(
          'size-4 transition-all duration-300',
          theme === 'dark'
            ? 'scale-0 -rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100'
        )}
      />
      <RegistryIcon
        lucide='MoonIcon'
        className={cn(
          'absolute size-4 transition-all duration-300',
          theme === 'dark'
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 rotate-90 opacity-0'
        )}
      />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
