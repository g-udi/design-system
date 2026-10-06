'use client';

import { createContext, useContext, useId } from 'react';
import * as Primitive from '@radix-ui/react-accordion';
import Icon from '../Icon';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { cn } from '../../../utilities/cn';

const AccordionContext = createContext({});
const ItemContext = createContext({});
const normalizeValue = (value, type) =>
  type === 'multiple'
    ? Array.isArray(value)
      ? value
      : value
        ? [value]
        : []
    : value || undefined;

export function Accordion(props) {
  const {
    children,
    className,
    defaultValue,
    type = 'single',
    value,
    variant = 'outline',
    onValueChange,
    collapsible = true,
    indicator = 'chevron',
    indicatorPosition = 'end',
    headingLevel = 3,
    highlight = false,
    dir,
    ...rootProps
  } = props;
  // An explicitly supplied undefined is a controlled, fully collapsed accordion.
  const controlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const [state, setState] = useControllableState({
    value: controlled ? normalizeValue(value, type) ?? '' : undefined,
    defaultValue: () => normalizeValue(defaultValue, type),
    onChange: (next) => onValueChange?.(normalizeValue(next, type))
  });
  const currentValue = normalizeValue(state, type);
  const setValue = (nextValue) => {
    const next = normalizeValue(nextValue, type);
    if (type === 'single' && !collapsible && currentValue && !next) return;
    setState(next);
  };
  return (
    <AccordionContext.Provider
      value={{ currentValue, type, indicator, indicatorPosition, headingLevel }}
    >
      <Primitive.Root
        {...rootProps}
        type={type}
        {...(type === 'single' ? { collapsible } : {})}
        value={currentValue ?? ''}
        onValueChange={setValue}
        className={cn('ds-accordion', className)}
        data-variant={variant}
        data-highlight={highlight || undefined}
        dir={dir}
        asChild
      >
        <div dir={dir}>
          {typeof children === 'function'
            ? children({ currentValue, setValue, type })
            : children}
        </div>
      </Primitive.Root>
    </AccordionContext.Provider>
  );
}

// The root barrel historically calls the convenience group `Accordion`.
// This explicit alias makes compound composition unambiguous at every entry.
export const AccordionRoot = Accordion;

export function AccordionItem({
  children,
  className,
  value,
  headingLevel,
  ...props
}) {
  const root = useContext(AccordionContext);
  const id = useId();
  const isOpen =
    root.type === 'multiple'
      ? root.currentValue.includes(value)
      : root.currentValue === value;
  return (
    <ItemContext.Provider
      value={{
        isOpen,
        triggerId: `${id}-trigger`,
        contentId: `${id}-content`,
        headingLevel
      }}
    >
      <Primitive.Item
        {...props}
        value={value}
        className={cn('ds-accordion-item', className)}
      >
        {children}
      </Primitive.Item>
    </ItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
  contentId,
  id,
  isOpen: legacyOpen,
  onClick,
  leading,
  description,
  badge,
  indicator,
  indicatorPosition,
  headingLevel,
  ...props
}) {
  const root = useContext(AccordionContext);
  const item = useContext(ItemContext);
  const descriptionId = useId();
  const titleId = useId();
  const isOpen = legacyOpen ?? item.isOpen;
  const resolvedIndicator =
    indicator === undefined ? root.indicator : indicator;
  const position = indicatorPosition ?? root.indicatorPosition;
  const Heading = `h${Math.min(6, Math.max(2, headingLevel ?? item.headingLevel ?? root.headingLevel ?? 3))}`;
  const indicatorNode =
    typeof resolvedIndicator === 'function' ? (
      resolvedIndicator({ isOpen })
    ) : resolvedIndicator === 'chevron' || resolvedIndicator === 'arrow' ? (
      <Icon
        name={resolvedIndicator === 'arrow' ? 'ChevronRight' : 'ChevronDown'}
        decorative
        size='sm'
      />
    ) : resolvedIndicator === 'plus-minus' ? (
      <>
        <Icon name='Plus' decorative size='sm' className='ds-accordion-plus' />
        <Icon
          name='Minus'
          decorative
          size='sm'
          className='ds-accordion-minus'
        />
      </>
    ) : (
      resolvedIndicator
    );
  return (
    <Primitive.Header asChild>
      <Heading className='ds-accordion-heading'>
        <Primitive.Trigger
          {...props}
          id={id ?? item.triggerId}
          aria-controls={contentId ?? item.contentId}
          aria-labelledby={
            props['aria-labelledby'] ??
            (props['aria-label'] ? undefined : titleId)
          }
          aria-describedby={
            [props['aria-describedby'], description ? descriptionId : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={cn('ds-accordion-trigger ds-motion-state', className)}
          data-indicator-position={position}
          onClick={(event) => {
            onClick?.(event);
            // Legacy render props supply their own state update; do not toggle twice.
            if (legacyOpen !== undefined && onClick) event.preventDefault();
          }}
        >
          {leading && (
            <span className='ds-accordion-leading' aria-hidden='true'>
              {leading}
            </span>
          )}
          <span className='ds-accordion-label'>
            <span id={titleId} className='ds-accordion-title'>
              {children}
              {badge && <span className='ds-accordion-badge'>{badge}</span>}
            </span>
            {description && (
              <span id={descriptionId} className='ds-accordion-description'>
                {description}
              </span>
            )}
          </span>
          {indicatorNode && (
            <span
              aria-hidden='true'
              className='ds-accordion-indicator ds-motion-icon'
              data-indicator={
                typeof resolvedIndicator === 'string'
                  ? resolvedIndicator
                  : 'custom'
              }
            >
              {indicatorNode}
            </span>
          )}
        </Primitive.Trigger>
      </Heading>
    </Primitive.Header>
  );
}

export function AccordionContent({
  children,
  className,
  id,
  isOpen: legacyOpen,
  labelledBy,
  forceMount,
  ...props
}) {
  const item = useContext(ItemContext);
  const isOpen = legacyOpen ?? item.isOpen;
  return (
    <Primitive.Content
      {...props}
      id={id ?? item.contentId}
      aria-labelledby={labelledBy ?? item.triggerId}
      aria-hidden={!isOpen || undefined}
      inert={!isOpen || undefined}
      forceMount={forceMount}
      className='ds-accordion-content'
      data-retained={forceMount || undefined}
    >
      <div className={cn('ds-accordion-content-inner', className)}>
        {children}
      </div>
    </Primitive.Content>
  );
}

export function AccordionGroup({
  items = [],
  type = 'single',
  defaultValue,
  ...props
}) {
  const firstEnabled = items.find((item) => !item.disabled)?.value;
  const initialValue =
    defaultValue === undefined
      ? normalizeValue(firstEnabled, type)
      : defaultValue;
  return (
    <Accordion {...props} type={type} defaultValue={initialValue}>
      {items.map(
        ({
          value,
          title,
          content,
          disabled,
          leading,
          description,
          badge,
          indicator,
          indicatorPosition,
          headingLevel,
          className,
          triggerClassName,
          contentClassName,
          forceMount
        }) => (
          <AccordionItem
            key={value}
            value={value}
            disabled={disabled}
            headingLevel={headingLevel}
            className={className}
          >
            <AccordionTrigger
              leading={leading}
              description={description}
              badge={badge}
              indicator={indicator}
              indicatorPosition={indicatorPosition}
              className={triggerClassName}
            >
              {title}
            </AccordionTrigger>
            <AccordionContent
              forceMount={forceMount}
              className={contentClassName}
            >
              {content}
            </AccordionContent>
          </AccordionItem>
        )
      )}
    </Accordion>
  );
}

export default AccordionGroup;
