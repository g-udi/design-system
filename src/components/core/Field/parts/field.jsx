'use client';
import { useMemo } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { Label } from './label.jsx';
import { Separator } from '../../Separator/parts/separator.jsx';
function FieldSet({ className, ...props }) {
  return (
    <fieldset
      data-slot='field-set'
      className={cn('ds-part-field-set min-w-0 flex flex-col', className)}
      {...props}
    />
  );
}
function FieldLegend({ className, variant = 'legend', ...props }) {
  return (
    <legend
      data-slot='field-legend'
      data-variant={variant}
      className={cn('ds-part-field-legend', className)}
      {...props}
    />
  );
}
function FieldGroup({ className, ...props }) {
  return (
    <div
      data-slot='field-group'
      className={cn(
        'ds-part-field-group group/field-group @container/field-group flex w-full flex-col',
        className
      )}
      {...props}
    />
  );
}
const fieldVariants = cva('ds-part-field group/field flex w-full', {
  variants: {
    orientation: {
      vertical:
        'ds-part-field-orientation-vertical flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'ds-part-field-orientation-horizontal flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'ds-part-field-orientation-responsive flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px'
    }
  },
  defaultVariants: {
    orientation: 'vertical'
  }
});
function Field({ className, orientation = 'vertical', ...props }) {
  return (
    <div
      role='group'
      data-slot='field'
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}
function FieldContent({ className, ...props }) {
  return (
    <div
      data-slot='field-content'
      className={cn(
        'ds-part-field-content group/field-content min-w-0 flex flex-1 flex-col leading-snug',
        className
      )}
      {...props}
    />
  );
}
function FieldLabel({ className, ...props }) {
  return (
    <Label
      data-slot='field-label'
      className={cn(
        'ds-part-field-label group/field-label peer/field-label flex w-fit',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        className
      )}
      {...props}
    />
  );
}
function FieldTitle({ className, ...props }) {
  return (
    <div
      data-slot='field-label'
      className={cn('ds-part-field-title flex w-fit items-center', className)}
      {...props}
    />
  );
}
function FieldDescription({ className, ...props }) {
  return (
    <p
      data-slot='field-description'
      className={cn(
        'ds-part-field-description leading-normal font-normal group-has-data-horizontal/field:text-balance',
        'last:mt-0 nth-last-2:-mt-1',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-ui-primary',
        className
      )}
      {...props}
    />
  );
}
function FieldSeparator({ children, className, ...props }) {
  return (
    <div
      data-slot='field-separator'
      data-content={!!children}
      className={cn('ds-part-field-separator relative', className)}
      {...props}
    >
      <Separator className='absolute inset-0 top-1/2' />
      {children && (
        <span
          className='ds-part-field-separator-content relative mx-auto block w-fit bg-ui-background'
          data-slot='field-separator-content'
        >
          {children}
        </span>
      )}
    </div>
  );
}
function FieldError({ className, children, errors, ...props }) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }
    if (!errors?.length) {
      return null;
    }
    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values()
    ];
    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message;
    }
    return (
      <ul className='ml-4 flex list-disc flex-col gap-1'>
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    );
  }, [children, errors]);
  if (!content) {
    return null;
  }
  return (
    <div
      role='alert'
      data-slot='field-error'
      className={cn('ds-part-field-error font-normal', className)}
      {...props}
    >
      {content}
    </div>
  );
}
export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle
};
