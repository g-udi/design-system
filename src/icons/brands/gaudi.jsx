// Generated from the official SVGs in artwork/. Run pnpm brand:build after changing them.
import { cn } from '../../utilities/cn/index.js';

/** Official G tile. The dark background and white mark stay consistent in both themes. */
export function GaudiLogo({ className, tile = true, tone = 'dark', ...props }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox={tile ? '0 0 400 400' : '-16 -16 344 332'} width="1em" height="1em"
    role="img" aria-label="Gaudi" focusable="false" className={cn('inline-block shrink-0 text-black dark:text-white', className)} {...props}>
    {tile ? <><rect x="6" y="6" width="388" height="388" rx="48" fill={tone === 'light' ? '#ffffff' : '#171717'} stroke={tone === 'light' ? '#dedede' : '#404040'} strokeWidth="12"/><g transform="translate(69.3953488372093 74.4186046511628) scale(0.8372093023255814)"><path fill={tone === 'light' ? '#000000' : '#ffffff'} d="M0 0H228L294 66H66V234H246V188H194L132 122H312V300H66L0 234Z"/></g></> : <><path fill="currentColor" d="M0 0H228L294 66H66V234H246V188H194L132 122H312V300H66L0 234Z"/></>}
  </svg>;
}

/** Compact Gaudi branding: the official tile followed by an ordinary text label. */
export function GaudiBrand({ className, logoClassName, ...props }) {
  return <span className={cn('inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-semibold', className)} {...props}>
    <GaudiLogo aria-hidden="true" className={cn('size-6', logoClassName)} />
    <span>Gaudi</span>
  </span>;
}

/** Official Gaudi artwork. Decorative when aria-hidden is supplied by its labelled parent. */
export function GaudiWordmark({ className, ...props }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 494 124" width="3.984em" height="1em"
    role="img" aria-label="Gaudi" focusable="false" className={cn('inline-block shrink-0 text-black dark:text-white', className)} {...props}>
    <g fill="currentColor"><path transform="translate(0 0)" fillRule="evenodd" d="M0 20L20 0H90L70 20H20V80H70V60H45L60 40H90V100H20L0 80Z"/><path transform="translate(104 0)" fillRule="evenodd" d="M0 100L55 0L110 100H85L55 45L25 100Z"/><path transform="translate(228 0)" fillRule="evenodd" d="M0 0H22V78H68V0H90V80L70 100H20L0 80Z"/><path transform="translate(336 0)" fillRule="evenodd" d="M0 0H65L90 25V75L65 100H0Z M22 22V78H56L68 66V34L56 22Z"/><path transform="translate(448 0)" fillRule="evenodd" d="M0 0H22V100H0Z"/></g>
  </svg>;
}
