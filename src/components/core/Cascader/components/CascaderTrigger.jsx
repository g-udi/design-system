'use client';
import * as React from 'react';
import { useMergedRefs } from '../../../../hooks/state/use-merged-refs.js';
import { useCascaderActions, useCascaderState } from '../CascaderContext.jsx';
import {
  applyCascadeSelection,
  collapseCascaderPath,
  findAmbiguousCascaderLabels,
  getCascaderCheckedValues,
  getCascaderPath,
  warnCascaderOnce
} from '../cascaderModel.jsx';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { ComboboxChips } from '../../Select/Combobox.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function CascaderTrigger({
  className,
  children,
  showIcon = true,
  ref,
  ...props
}) {
  const { invalid } = useCascaderActions();
  const triggerRef = React.useRef(null);
  const setTrigger = useMergedRefs(triggerRef, ref);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const element = triggerRef.current;
    if (!element) return;
    const named =
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.closest('label') !== null ||
      (element.id !== '' &&
        element.ownerDocument.querySelector(
          `label[for="${CSS.escape(element.id)}"]`
        ) !== null);
    if (named) return;
    warnCascaderOnce(
      'trigger-unnamed',
      "`CascaderTrigger` has no accessible name. Its contents are the field's VALUE - they change with the selection - so a screen reader hears what is picked but never what the field is for. Pass `aria-label` or `aria-labelledby`, or reference the trigger's `id` from a `<label>`."
    );
  });
  return (
    <ComboboxPrimitive.Trigger
      ref={setTrigger}
      data-slot='cascader-trigger'
      {...(invalid ? { 'aria-invalid': true, 'data-invalid': '' } : null)}
      className={cn(TRIGGER_ICON_FALLBACK_CLASS, className)}
      {...props}
    >
      {children}
      {showIcon ? (
        <RegistryIcon
          lucide='ChevronDownIcon'
          className={`${TRIGGER_ICON_CLASS} pointer-events-none shrink-0`}
        />
      ) : null}
    </ComboboxPrimitive.Trigger>
  );
}
const TRIGGER_ICON_CLASS = 'text-ui-muted-foreground size-4';
const TRIGGER_ICON_FALLBACK_CLASS = "[&_svg:not([class*='size-'])]:size-4";
export function useCascaderAnchor() {
  return React.useRef(null);
}
function CascaderChips({
  className,
  children,
  placeholder,
  strategy = 'all',
  ...props
}) {
  const {
    labels,
    multiple,
    invalid,
    resolveNode,
    index,
    isSelectable,
    setSelection
  } = useCascaderActions();
  const { selectedValues } = useCascaderState();
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (multiple) return;
    warnCascaderOnce(
      'chips-without-multiple',
      '`CascaderChips` renders one chip per selection and there is only ever one without `multiple`. Use `CascaderValue` for a single-select trigger.'
    );
  }, [multiple]);
  const displayedValues =
    strategy === 'all'
      ? selectedValues
      : getCascaderCheckedValues(index, selectedValues, strategy);
  const nodes = displayedValues.map(resolveNode);
  const ambiguous = findAmbiguousCascaderLabels(nodes);
  const removeClosure = (node) => {
    setSelection(
      applyCascadeSelection(
        index,
        selectedValues,
        node.value,
        false,
        isSelectable
      ),
      'deselect'
    );
  };
  const content = typeof children === 'function' ? children(nodes) : children;
  return (
    <ComboboxChips
      data-slot='cascader-chips'
      aria-label={labels.chipsLabel}
      {...(invalid ? { 'aria-invalid': true, 'data-invalid': '' } : null)}
      className={className}
      {...props}
    >
      {content ??
        (nodes.length === 0 ? (
          <span
            data-slot='cascader-chips-placeholder'
            className='text-ui-muted-foreground truncate'
          >
            {placeholder}
          </span>
        ) : (
          nodes.map((node) => (
            <CascaderChip
              key={node.value}
              node={node}
              showPath={ambiguous.has(node.value)}
              {...(strategy !== 'all'
                ? { onRemove: () => removeClosure(node) }
                : null)}
            />
          ))
        ))}
    </ComboboxChips>
  );
}
function CascaderChip({
  className,
  node,
  showPath = false,
  maxSegments = 2,
  showRemove = true,
  onRemove,
  children,
  ...props
}) {
  const { labels, index } = useCascaderActions();
  const chain = showPath ? getCascaderPath(index, node.value) : [];
  const segments = collapseCascaderPath(chain, {
    maxSegments,
    collapse: 'start'
  });
  const label = segments.length
    ? segments
        .map((segment) =>
          segment.type === 'node' ? segment.node.label : '\u2026'
        )
        .join(` ${labels.pathSeparator} `)
    : node.label;
  return (
    <ComboboxPrimitive.Chip
      data-slot='cascader-chip'
      {...(onRemove
        ? {
            onKeyDown: (event) => {
              if (event.key !== 'Backspace' && event.key !== 'Delete') return;
              event.preventBaseUIHandler();
              onRemove();
            }
          }
        : null)}
      className={cn(
        'ds-part-combobox-chip has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children ?? <span className='truncate'>{label}</span>}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant='ghost' size='icon-xs' />}
          data-slot='cascader-chip-remove'
          aria-label={labels.removeChip(label)}
          {...(onRemove
            ? {
                onClick: (event) => {
                  event.preventBaseUIHandler();
                  onRemove();
                }
              }
            : null)}
          className='ds-part-combobox-chip-remove'
        >
          <RegistryIcon lucide='XIcon' className='pointer-events-none' />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
}
export { CascaderTrigger, CascaderChips, CascaderChip };
