'use client';
import { cn } from '../../../utilities/cn/index.js';
function Table({ className, density = 'normal', containerProps = {}, ...props }) {
  const { className: containerClassName, ...containerAttributes } = containerProps;
  return (
    <div {...containerAttributes} data-slot='table-container' className={cn('ds-part-table-container', containerClassName)}>
      <table
        data-slot='table'
        data-density={density}
        className={cn('ds-part-table', className)}
        {...props}
      />
    </div>
  );
}
function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot='table-header'
      className={cn('ds-part-table-header', className)}
      {...props}
    />
  );
}
function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot='table-body'
      className={cn('ds-part-table-body', className)}
      {...props}
    />
  );
}
function TableFooter({ className, ...props }) {
  return (
    <tfoot
      data-slot='table-footer'
      className={cn('ds-part-table-footer', className)}
      {...props}
    />
  );
}
function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot='table-row'
      className={cn(
        'ds-part-table-row has-aria-expanded:bg-ui-muted/50',
        className
      )}
      {...props}
    />
  );
}
function TableHead({ className, variant = 'muted', ...props }) {
  return (
    <th
      data-slot='table-head'
      data-variant={variant}
      className={cn('ds-part-table-head', className)}
      {...props}
    />
  );
}
function TableCell({ as: Component = 'td', className, ...props }) {
  return (
    <Component
      data-slot='table-cell'
      className={cn('ds-part-table-cell', className)}
      {...props}
    />
  );
}
function TableCaption({ className, ...props }) {
  return (
    <caption
      data-slot='table-caption'
      className={cn('ds-part-table-caption', className)}
      {...props}
    />
  );
}
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
};
