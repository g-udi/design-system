import { cn } from '../../../utilities/cn';
import { Card as CardRoot, CardDescription, CardTitle } from './CardPrimitives.jsx';

export { cardVariants } from './cardVariants.js';

const headingLevels = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

// Convenience content uses the same surface and parts as compound cards.
const Card = ({
  children,
  className,
  classNames = {},
  interactive = false,
  padding = 'md',
  radius = 'md',
  subtitle,
  title,
  titleLevel = 3,
  variant = 'elevated',
  ...props
}) => (
  <CardRoot
    fill
    className={ cn(interactive && 'hover:shadow-md', className, classNames.root) }
    padding={ padding }
    radius={ radius }
    variant={ variant }
    { ...props }
  >
    <div className={ cn('relative z-10', classNames.body) }>
      {title != null ? (
        <CardTitle as={ headingLevels[titleLevel] || 'h3' } className={ classNames.title }>
          {title}
        </CardTitle>
      ) : null}
      {subtitle != null ? (
        <CardDescription as='p' className={ cn('mt-1', classNames.subtitle) }>
          {subtitle}
        </CardDescription>
      ) : null}
      {children}
    </div>
  </CardRoot>
);

export default Card;
