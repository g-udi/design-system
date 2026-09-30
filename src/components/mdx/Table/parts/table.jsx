// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cn } from '../../../../utilities/cn/index.js';
function Table({ className, ...props }) {
  return (
    <div data-slot='table-container' className='ds-part-table-container'>
      <table
        data-slot='table'
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
function TableHead({ className, ...props }) {
  return (
    <th
      data-slot='table-head'
      className={cn('ds-part-table-head', className)}
      {...props}
    />
  );
}
function TableCell({ className, ...props }) {
  return (
    <td
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
