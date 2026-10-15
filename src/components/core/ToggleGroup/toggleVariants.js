import { cva } from 'class-variance-authority';

export const toggleVariants = cva(
  'ds-part-toggle group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-ui-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'ds-part-toggle-variant-default',
        outline: 'ds-part-toggle-variant-outline'
      },
      size: {
        default: 'ds-part-toggle-size-default',
        sm: 'ds-part-toggle-size-sm',
        lg: 'ds-part-toggle-size-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);
