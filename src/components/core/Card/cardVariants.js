import { createVariants } from '../../../utilities/variants';

export const cardVariants = createVariants({
  base: 'overflow-hidden transition-shadow duration-200',
  defaultVariants: { fill: true, padding: 'md', radius: 'md', variant: 'elevated' },
  variants: {
    fill: { true: 'h-full w-full', false: '' },
    padding: { lg: 'p-4', md: 'p-3', none: 'p-0', sm: 'p-2', sections: 'flex flex-col' },
    radius: { lg: 'rounded-lg', md: 'rounded-md', none: 'rounded-none', sm: 'rounded-sm', xl: 'rounded-xl' },
    variant: {
      compound: 'ring-ui-foreground/10 bg-ui-card text-ui-card-foreground ring-1',
      elevated: 'border border-border bg-surface text-text shadow-sm',
      flat: 'border border-transparent bg-transparent shadow-none',
      outline: 'border border-border bg-surface text-text shadow-none',
      soft: 'border border-border bg-surface-muted text-text shadow-none'
    }
  }
});
