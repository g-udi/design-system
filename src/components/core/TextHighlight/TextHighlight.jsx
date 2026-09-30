import { createVariants } from '../../../utilities/variants';

export const textHighlightVariants = createVariants({
  'base': 'relative inline box-decoration-clone rounded-none bg-[length:100%_100%] bg-left bg-no-repeat [-webkit-box-decoration-break:clone]',
  'compoundVariants': [
    { 'className': 'bg-linear-to-r from-amber-100 to-amber-300 dark:from-amber-500 dark:to-amber-800', 'tone': 'amber', 'variant': 'marker' },
    { 'className': 'bg-linear-to-r from-blue-100 to-blue-300 dark:from-neutral-700 dark:to-neutral-800', 'tone': 'blue', 'variant': 'marker' },
    { 'className': 'bg-linear-to-r from-gray-100 to-gray-300 dark:from-gray-500 dark:to-gray-800', 'tone': 'gray', 'variant': 'marker' },
    { 'className': 'bg-linear-to-r from-green-100 to-green-300 dark:from-green-500 dark:to-green-800', 'tone': 'green', 'variant': 'marker' },
    { 'className': 'bg-linear-to-r from-sky-100 to-blue-300 dark:from-neutral-700 dark:to-neutral-800', 'tone': 'indigo', 'variant': 'marker' },
    { 'className': 'bg-linear-to-r from-neutral-100 to-neutral-300 dark:from-neutral-500 dark:to-neutral-800', 'tone': 'neutral', 'variant': 'marker' },
    { 'className': 'bg-linear-to-r from-red-100 to-red-300 dark:from-red-500 dark:to-red-800', 'tone': 'red', 'variant': 'marker' },
    { 'className': 'bg-linear-to-r from-rose-100 to-rose-300 dark:from-rose-500 dark:to-rose-800', 'tone': 'rose', 'variant': 'marker' },
    { 'className': 'bg-linear-to-r from-teal-100 to-teal-300 dark:from-teal-500 dark:to-teal-800', 'tone': 'teal', 'variant': 'marker' },
    { 'className': 'bg-linear-to-r from-yellow-100 to-yellow-300 dark:from-yellow-500 dark:to-yellow-800', 'tone': 'yellow', 'variant': 'marker' },
    { 'className': 'bg-amber-50 text-amber-950 dark:bg-amber-950 dark:text-amber-200', 'tone': 'amber', 'variant': 'soft' },
    { 'className': 'bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200', 'tone': 'blue', 'variant': 'soft' },
    { 'className': 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100', 'tone': 'gray', 'variant': 'soft' },
    { 'className': 'bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200', 'tone': 'green', 'variant': 'soft' },
    { 'className': 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200', 'tone': 'indigo', 'variant': 'soft' },
    { 'className': 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100', 'tone': 'neutral', 'variant': 'soft' },
    { 'className': 'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200', 'tone': 'red', 'variant': 'soft' },
    { 'className': 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200', 'tone': 'rose', 'variant': 'soft' },
    { 'className': 'bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200', 'tone': 'teal', 'variant': 'soft' },
    { 'className': 'bg-yellow-50 text-yellow-950 dark:bg-yellow-950 dark:text-yellow-200', 'tone': 'yellow', 'variant': 'soft' },
    { 'className': 'decoration-amber-300 dark:decoration-amber-600', 'tone': 'amber', 'variant': 'underline' },
    { 'className': 'decoration-blue-300 dark:decoration-blue-600', 'tone': 'blue', 'variant': 'underline' },
    { 'className': 'decoration-gray-300 dark:decoration-gray-600', 'tone': 'gray', 'variant': 'underline' },
    { 'className': 'decoration-green-300 dark:decoration-green-600', 'tone': 'green', 'variant': 'underline' },
    { 'className': 'decoration-indigo-300 dark:decoration-indigo-600', 'tone': 'indigo', 'variant': 'underline' },
    { 'className': 'decoration-neutral-300 dark:decoration-neutral-600', 'tone': 'neutral', 'variant': 'underline' },
    { 'className': 'decoration-red-300 dark:decoration-red-600', 'tone': 'red', 'variant': 'underline' },
    { 'className': 'decoration-rose-300 dark:decoration-rose-600', 'tone': 'rose', 'variant': 'underline' },
    { 'className': 'decoration-teal-300 dark:decoration-teal-600', 'tone': 'teal', 'variant': 'underline' },
    { 'className': 'decoration-yellow-300 dark:decoration-yellow-600', 'tone': 'yellow', 'variant': 'underline' }
  ],
  'defaultVariants': {
    'radius': 'sm',
    'tone': 'blue',
    'variant': 'marker'
  },
  'variants': {
    'radius': {
      'md': 'rounded-none',
      'none': 'rounded-none',
      'sm': 'rounded-none'
    },
    'tone': {
      'amber': '',
      'blue': '',
      'gray': '',
      'green': '',
      'indigo': '',
      'neutral': '',
      'red': '',
      'rose': '',
      'teal': '',
      'yellow': ''
    },
    'variant': {
      'marker': 'px-1 pb-0.5',
      'soft': 'px-1',
      'underline': 'rounded-none bg-none px-0 pb-0 underline decoration-4 underline-offset-2'
    }
  }
});

export const TextHighlight = ({ animate = true, children, className, radius, tone, variant }) => {
  const classes = textHighlightVariants({ className, radius, tone, variant });

  /*
   * The entrance sweep is pure CSS (ds-text-highlight-sweep in styles.css),
   * which honors prefers-reduced-motion and keeps this a server component.
   */
  return <span className={ animate ? `${classes} ds-text-highlight-animate` : classes }>{children}</span>;
};
