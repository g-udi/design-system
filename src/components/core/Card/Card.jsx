import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';
import { CardDescription, CardTitle } from './parts/card.jsx';

export const cardVariants = createVariants({
  'base': 'h-full w-full overflow-hidden border transition-shadow duration-200',
  'defaultVariants': {
    'padding': 'md',
    'radius': 'md',
    'variant': 'elevated'
  },
  'variants': {
    'padding': {
      'lg': 'p-4',
      'md': 'p-3',
      'none': 'p-0',
      'sm': 'p-2'
    },
    'radius': {
      'lg': 'rounded-lg',
      'md': 'rounded-md',
      'none': 'rounded-none',
      'sm': 'rounded-sm'
    },
    'variant': {
      'elevated': 'border-border bg-surface text-text shadow-sm',
      'flat': 'border-transparent bg-transparent shadow-none',
      'outline': 'border-border bg-surface text-text shadow-none',
      'soft': 'border-border bg-surface-muted text-text shadow-none'
    }
  }
});

const headingLevels = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

// The convenience card: a variant surface whose title and subtitle reuse the CardTitle and CardDescription parts.
const Card = ({
  children,
  className,
  classNames = {},
  interactive = false,
  padding,
  radius,
  subtitle,
  title,
  titleLevel = 3,
  variant,
  ...props
}) => (
  <div
    className={ cardVariants({
      'className': cn(interactive && 'hover:shadow-md', className, classNames.root),
      padding,
      radius,
      variant
    }) }
    { ...props }
  >
    <div className={ cn('relative z-10', classNames.body) }>
      {title ? (
        <CardTitle as={ headingLevels[titleLevel] || 'h3' } className={ classNames.title }>
          {title}
        </CardTitle>
      ) : null}
      {subtitle ? (
        <CardDescription as='p' className={ cn('mt-1', classNames.subtitle) }>
          {subtitle}
        </CardDescription>
      ) : null}
      {children}
    </div>
  </div>
);

export default Card;
