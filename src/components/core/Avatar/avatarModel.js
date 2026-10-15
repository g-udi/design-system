import { createVariants } from '../../../utilities/variants/variants.js';

/** Unicode-aware initials; applications can provide a custom fallback. */
export function getAvatarInitials(name) {
  const words = String(name || '').trim().split(/\s+/)
    .map((word) => word.match(/[\p{L}\p{N}]/gu) || [])
    .filter((characters) => characters.length);
  if (!words.length) return '?';
  return (words.length === 1 ? words[0].slice(0, 2) : [words[0][0], words.at(-1)[0]])
    .join('').toUpperCase();
}

export function getAvatarGroupState(avatars, max = 4) {
  const limit = Number.isFinite(max) && max > 0 ? Math.max(1, Math.floor(max)) : 0;
  const visible = limit > 0 ? avatars.slice(0, limit) : avatars;
  return { visible, overflow: avatars.length - visible.length };
}

export const avatarVariants = createVariants({
  'base': 'relative inline-flex shrink-0 items-center justify-center bg-linear-135 font-semibold',
  'defaultVariants': {
    'shape': 'square',
    'size': 'md',
    'tone': 'gray'
  },
  'variants': {
    'shape': {
      'circle': 'rounded-full',
      'square': 'rounded-md',
      'tile': 'rounded-xl'
    },
    'size': {
      '2xs': 'size-4 text-xs',
      'xl': 'size-20 text-2xl',
      'lg': 'size-14 text-base',
      'md': 'size-10 text-sm',
      'sm': 'size-8 text-xs',
      'xs': 'size-5 text-xs'
    },
    // Soft gradient shades from the Gaudi artwork palette, with the tone's ink for the initials.
    'tone': {
      'amber': 'from-amber-200 via-orange-200 to-rose-200 text-amber-950 dark:from-amber-700 dark:via-orange-800 dark:to-rose-900 dark:text-amber-50',
      'blue': 'from-sky-200 via-blue-300 to-indigo-300 text-blue-950 dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900 dark:text-blue-50',
      'gray': 'from-slate-200 via-indigo-100 to-violet-200 text-slate-800 dark:from-slate-600 dark:via-slate-700 dark:to-violet-900 dark:text-slate-50',
      'green': 'from-emerald-200 via-lime-200 to-green-300 text-green-950 dark:from-emerald-700 dark:via-green-800 dark:to-lime-900 dark:text-green-50',
      'indigo': 'from-sky-200 via-violet-300 to-fuchsia-300 text-indigo-950 dark:from-indigo-600 dark:via-violet-800 dark:to-fuchsia-900 dark:text-indigo-50',
      'neutral': 'from-neutral-200 via-stone-200 to-neutral-300 text-neutral-800 dark:from-neutral-600 dark:via-neutral-700 dark:to-stone-800 dark:text-neutral-50',
      'red': 'from-rose-200 via-red-200 to-orange-200 text-red-950 dark:from-rose-700 dark:via-red-800 dark:to-orange-900 dark:text-red-50',
      'rose': 'from-pink-200 via-rose-200 to-fuchsia-300 text-rose-950 dark:from-pink-700 dark:via-rose-800 dark:to-fuchsia-900 dark:text-rose-50',
      'teal': 'from-cyan-200 via-teal-200 to-sky-300 text-teal-950 dark:from-cyan-700 dark:via-teal-800 dark:to-sky-900 dark:text-teal-50',
      'yellow': 'from-yellow-100 via-amber-200 to-orange-200 text-yellow-950 dark:from-yellow-600 dark:via-amber-700 dark:to-orange-800 dark:text-yellow-50'
    }
  }
});
