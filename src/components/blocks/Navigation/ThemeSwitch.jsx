'use client';

import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { useIsClient } from '../../../hooks/environment/use-is-client.js';
import Button from '../../core/Button';
import Icon from '../../core/Icon';

/*
 * Animates the change with a view transition: the browser snapshots the page and ThemeSwitch.css
 * plays the style named by `data-theme-transition` on <html> (fade by default; circle, wipe, blur or
 * none). Reduced motion and browsers without view transitions switch instantly.
 */
function switchTheme(apply, button) {
  const root = document.documentElement;
  const instant = !document.startViewTransition
    || root.dataset.themeTransition === 'none'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (instant) return apply();

  // The circle grows from the toggle to the farthest corner of the viewport.
  const bounds = button.getBoundingClientRect();
  const x = bounds.left + bounds.width / 2;
  const y = bounds.top + bounds.height / 2;
  root.style.setProperty('--ds-theme-x', `${x}px`);
  root.style.setProperty('--ds-theme-y', `${y}px`);
  root.style.setProperty('--ds-theme-radius', `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
  root.classList.add('ds-theme-transition');
  // flushSync applies the new theme inside the transition callback, before the new snapshot.
  const transition = document.startViewTransition(() => flushSync(apply));
  transition.finished.finally(() => root.classList.remove('ds-theme-transition'));
  return undefined;
}

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
      onClick={(event) => switchTheme(() => setTheme(dark ? 'light' : 'dark'), event.currentTarget)}
    >
      <Icon name={dark ? 'MoonFill' : 'SunFill'} decorative className='size-5 lg:size-4' />
    </Button>
  );
}
