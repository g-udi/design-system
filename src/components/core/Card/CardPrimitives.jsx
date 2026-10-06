import { cn } from '../../../utilities/cn/index.js';
import { cardVariants } from './cardVariants.js';

function Card({ className, fill = false, padding = 'sections', radius = 'xl', size = 'default', variant = 'compound', ...props }) {
  return (
    <div
      data-slot='card'
      data-size={size}
      data-padding={padding}
      className={cardVariants({ fill, padding, radius, variant, className: cn('ds-part-card group/card', className) })}
      {...props}
    />
  );
}
function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        'ds-part-card-header group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
        className
      )}
      {...props}
    />
  );
}
function CardTitle({ as: Component = 'div', className, ...props }) {
  return (
    <Component
      data-slot='card-title'
      className={cn('ds-part-card-title', className)}
      {...props}
    />
  );
}
function CardDescription({ as: Component = 'div', className, ...props }) {
  return (
    <Component
      data-slot='card-description'
      className={cn('ds-part-card-description', className)}
      {...props}
    />
  );
}
function CardAction({ className, ...props }) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        'ds-part-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}
function CardContent({ className, ...props }) {
  return (
    <div
      data-slot='card-content'
      className={cn('ds-part-card-content', className)}
      {...props}
    />
  );
}
function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot='card-footer'
      className={cn('ds-part-card-footer flex items-center', className)}
      {...props}
    />
  );
}
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent
};
