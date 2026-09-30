import { cn } from '../../../../utilities/cn/index.js';
function Card({ className, size = 'default', ...props }) {
  return (
    <div
      data-slot='card'
      data-size={size}
      className={cn('ds-part-card group/card flex flex-col', className)}
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
function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot='card-title'
      className={cn('ds-part-card-title ds-part-font-heading', className)}
      {...props}
    />
  );
}
function CardDescription({ className, ...props }) {
  return (
    <div
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
