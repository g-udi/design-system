import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';
import Card, { cardVariants } from '../Card/Card';
import { CardDescription, CardTitle } from '../Card/parts/card.jsx';

export const gridVariants = createVariants({
  'base': 'mx-auto grid grid-cols-1',
  'defaultVariants': {
    'columns': '3',
    'gap': 'md'
  },
  'variants': {
    'columns': {
      '2': 'md:grid-cols-2',
      '3': 'md:grid-cols-3',
      '4': 'md:grid-cols-2 lg:grid-cols-4'
    },
    'gap': {
      'lg': 'gap-6',
      'md': 'gap-4',
      'sm': 'gap-3'
    }
  }
});

// GridItem is a Card laid out for grids, so both share one surface scale.
export const gridItemVariants = cardVariants;

export const Grid = ({ children, className, columns, gap }) => (
  <div className={ gridVariants({ className, columns, gap }) }>
    {children}
  </div>
);

export const GridItem = ({ className, classNames = {}, description, header, icon, padding, radius, title, variant = 'elevated' }) => (
  <Card
    className={ cn('group/grid', className, classNames.root) }
    classNames={ { 'body': 'flex h-full flex-col justify-between gap-4' } }
    interactive={ variant === 'elevated' }
    padding={ padding }
    radius={ radius }
    variant={ variant }
  >
    {header}
    <div className={ cn('transition duration-200 group-hover/grid:translate-x-2 motion-reduce:transition-none', classNames.body) }>
      {icon}
      <CardTitle className={ cn('my-2', classNames.title) }>{title}</CardTitle>
      <CardDescription className={ cn('text-xs', classNames.description) }>{description}</CardDescription>
    </div>
  </Card>
);
