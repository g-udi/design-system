'use client';
import * as React from 'react';
import {
  filterControlSizes,
  filterReadOnlyProps,
  isFilterLocked,
  useFilterActions,
  useFilterChipAutoOpen,
  useFilterChipFocused,
  useFilterFocusEmpty,
  useFilterFocusStore,
  useFilterRender,
  useFilterReorderable
} from '../FiltersContext.jsx';
import {
  FilterMenu,
  useFilterOptions,
  useFilterValueResolution
} from './FiltersEditors.jsx';
import {
  collapseFilterPath,
  FILTER_MENU_CLASS,
  FILTER_MENU_LABEL_CLASS,
  formatFilterPath,
  getFilterField,
  getFilterFieldChain
} from '../filterModel.jsx';
import {
  coerceFilterValue,
  getFilterArity,
  getFilterOperator,
  operatorTakesValue,
  visibleFilterOperators
} from '../filterOperators.jsx';
import { findFilterNode, isFilterGroup } from '../filterQuery.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import {
  ButtonGroup,
  ButtonGroupText
} from '../../ButtonGroup/ButtonGroup.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../DropdownMenu/DropdownMenuPrimitives.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/PopoverPrimitives.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../Tooltip/TooltipPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const noopAutoFocusRef = () => {};
function defaultValueDisplay(
  value,
  operator,
  resolveOption,
  labels,
  fieldPlaceholder,
  optionBacked
) {
  const emptyLabel = optionBacked
    ? labels.selectPlaceholder
    : (fieldPlaceholder ?? labels.valuePlaceholder);
  if (value === void 0 || value === null || value === '') {
    return emptyLabel;
  }
  if (getFilterArity(operator) === 'range' && Array.isArray(value)) {
    const [from, to] = value;
    return labels.valueRange(String(from ?? ''), String(to ?? ''));
  }
  if (Array.isArray(value)) {
    const values = value;
    if (values.length === 0) return emptyLabel;
    if (values.length === 1) {
      return resolveOption(values[0])?.label ?? String(values[0]);
    }
    return labels.valueCount(values.length);
  }
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  return resolveOption(String(value))?.label ?? String(value);
}
function valueWithIcon(value, text, resolveOption) {
  const single =
    value === void 0 || value === null || Array.isArray(value)
      ? Array.isArray(value) && value.length === 1
        ? String(value[0])
        : null
      : String(value);
  const icon = single ? resolveOption(single)?.icon : null;
  if (!icon) return text;
  return (
    <span className='flex items-center gap-1.5'>
      {icon}
      {text}
    </span>
  );
}
function FilterPathSeparator() {
  return (
    <RegistryIcon
      aria-hidden='true'
      data-slot='filter-path-separator'
      className='text-ui-muted-foreground mx-[3px] inline-block size-3 shrink-0 self-center align-[calc(0.3635em_-_0.375rem)]'
      lucide='ChevronRightIcon'
    />
  );
}
function FilterPathEllipsis({ full }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-hidden='true'
            data-slot='filter-path-ellipsis'
            className='text-ui-muted-foreground shrink-0 self-center'
          >
            ...
          </span>
        </TooltipTrigger>
        <TooltipContent>{full}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
export function useFilterRuleDisplay(rule, field, operator) {
  const actions = useFilterActions();
  const render = useFilterRender();
  const optionsState = useFilterOptions(field, false);
  const values =
    rule.value === void 0 || rule.value === null
      ? []
      : Array.isArray(rule.value)
        ? rule.value
        : [rule.value];
  useFilterValueResolution(field, values);
  const pathText = formatFilterPath(
    actions.index,
    rule.path,
    actions.labels.pathSeparator
  );
  const chain = getFilterFieldChain(actions.index, rule.path);
  const segments = collapseFilterPath(chain, {
    maxSegments: actions.maxPathSegments,
    collapse: actions.pathCollapse
  });
  const pathCollapsed = segments.some((segment) => segment.type === 'ellipsis');
  const pathLabel = chain.length
    ? segments.map((segment, index) => (
        <React.Fragment
          key={
            segment.type === 'field'
              ? `${index}:${segment.field.id}`
              : `${index}:ellipsis`
          }
        >
          {index > 0 ? <FilterPathSeparator /> : null}
          {segment.type === 'field' ? (
            <span>{segment.field.label}</span>
          ) : (
            <FilterPathEllipsis full={pathText} />
          )}
        </React.Fragment>
      ))
    : pathText;
  const operatorLabel = operator
    ? rule.negated
      ? actions.labels.negated(operator.label)
      : operator.label
    : rule.operator || actions.labels.selectCondition;
  const valueEmpty =
    rule.value === void 0 ||
    rule.value === null ||
    rule.value === '' ||
    values.length === 0;
  if (!field) {
    return {
      pathText,
      pathLabel,
      pathCollapsed,
      operatorLabel,
      valueLabel: '',
      valueText: '',
      valueFullText: '',
      valueEmpty
    };
  }
  const valueContext = {
    value: rule.value,
    values,
    field,
    operator: operator ?? { value: rule.operator, label: rule.operator },
    // Resolved, not empty: a custom display needs the option behind each value.
    options: values
      .map((entry) => optionsState.resolve(String(entry)))
      .filter(Boolean),
    labels: actions.labels
  };
  const valueText = field.valueText
    ? field.valueText(valueContext)
    : defaultValueDisplay(
        rule.value,
        operator,
        optionsState.resolve,
        actions.labels,
        field.placeholder,
        // Option-backed by the FIELD, not the operator: `is any of` is
        // multi-value on a plain text field too, and that one is typed into.
        field.type === 'select' ||
          field.type === 'multiselect' ||
          Boolean(field.options?.length) ||
          Boolean(field.loadOptions)
      );
  const valueLabel = render.renderValue
    ? render.renderValue(valueContext)
    : field.renderValue
      ? field.renderValue(valueContext)
      : valueWithIcon(rule.value, valueText, optionsState.resolve);
  const valueFullText =
    field.valueText ||
    !Array.isArray(rule.value) ||
    getFilterArity(operator) === 'range' ||
    values.length < 2
      ? valueText
      : actions.labels.valueDetail(
          valueText,
          values.map(
            (entry) =>
              optionsState.resolve(String(entry))?.label ?? String(entry)
          )
        );
  return {
    pathText,
    pathLabel,
    pathCollapsed,
    operatorLabel,
    valueLabel,
    valueText,
    valueFullText,
    valueEmpty
  };
}
function FilterValueEditor({ rule, field, operator, open, onClose }) {
  const actions = useFilterActions();
  const [draft, setDraft] = React.useState(rule.value);
  React.useEffect(() => {
    if (open) setDraft(rule.value);
  }, [open, rule.value]);
  const options = useFilterOptions(field, open);
  const editor = React.useMemo(
    () => actions.resolveEditor(field, operator),
    [actions, field, operator]
  );
  if (!editor) return null;
  const editorProps = {
    field,
    operator,
    value: draft,
    onValueChange: (next) => setDraft(next),
    host: 'amend',
    autoFocusProps: {
      ref: noopAutoFocusRef,
      autoFocus: true
    },
    commit: (next, commitOptions) => {
      actions.updateRule(rule.id, {
        value: next === void 0 ? draft : next
      });
      if (commitOptions?.close === false) return;
      onClose();
    },
    cancel: onClose,
    // The same as cancel, honestly: `back` means something only to a `create`
    // host.
    back: onClose,
    options,
    labels: actions.labels
  };
  return <>{React.createElement(editor, editorProps)}</>;
}
function FilterStepHandoff({ onRelease }) {
  React.useEffect(() => onRelease, [onRelease]);
  return null;
}
export function FilterValuePopover({
  rule,
  field,
  operator,
  trigger,
  className
}) {
  const actions = useFilterActions();
  const focusStore = useFilterFocusStore();
  const autoOpen = useFilterChipAutoOpen(rule.id) === 'value';
  const [open, setOpen] = React.useState(false);
  const [editorSession, setEditorSession] = React.useState(0);
  const locked = isFilterLocked(actions);
  React.useEffect(() => {
    if (!autoOpen || open) return;
    if (!locked) {
      setEditorSession(session => session + 1);
      setOpen(true);
    }
    focusStore.set({ id: rule.id, segment: 'value', autoOpen: false });
  }, [autoOpen, open, focusStore, rule.id, locked]);
  if (!operator || !actions.resolveEditor(field, operator)) {
    return React.cloneElement(trigger, {
      disabled: actions.disabled,
      ...filterReadOnlyProps(actions)
    });
  }
  return (
    // REFUSES to open while locked rather than leaving it to the trigger: an
    // `aria-disabled` control that still opens an editor is one that lied.
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next && locked) return;
        if (next && !open) setEditorSession(session => session + 1);
        setOpen(next);
      }}
    >
      {/* The trigger IS the segment, never a wrapper, and `asChild` keeps it
         from becoming one. `ButtonGroup` fuses DIRECT children only
         (`[&>*:not(:last-child)]:rounded-r-none`,
         `[&>*:not(:first-child)]:border-l-0`), so a nested one keeps its own
         border and the chip reads as separate badges. */}
      <PopoverTrigger
        asChild
        disabled={actions.disabled}
        {...filterReadOnlyProps(actions)}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent align='start' className={cn('w-auto p-0', className)}>
        <FilterValueEditor
          // Reopening during the exit transition starts a fresh edit session,
          // including consumer editor state and completion callbacks.
          key={editorSession}
          rule={rule}
          field={field}
          operator={operator}
          open={open}
          onClose={() => {
            setOpen(false);
            focusStore.set({ id: rule.id, segment: 'value', autoOpen: false });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
export function FilterOperatorPopover({ rule, field, trigger, className }) {
  const actions = useFilterActions();
  const focusStore = useFilterFocusStore();
  const autoOpen = useFilterChipAutoOpen(rule.id) === 'operator';
  const [open, setOpen] = React.useState(false);
  const locked = isFilterLocked(actions);
  const handoff = React.useRef(false);
  const operators = actions.resolveOperators(field);
  const _operator = getFilterOperator(operators, rule.operator);
  const items = React.useMemo(
    () =>
      visibleFilterOperators(operators).map((entry) => ({
        value: entry.value,
        label: entry.label
      })),
    [operators]
  );
  React.useEffect(() => {
    if (!autoOpen || open) return;
    handoff.current = false;
    if (!locked) setOpen(true);
    focusStore.set({ id: rule.id, segment: 'operator', autoOpen: false });
  }, [autoOpen, open, focusStore, rule.id, locked]);
  const close = () => {
    handoff.current = false;
    setOpen(false);
    focusStore.set({ id: rule.id, segment: 'operator', autoOpen: false });
  };
  const release = React.useCallback(() => {
    if (!handoff.current) return;
    focusStore.set({ id: rule.id, segment: 'value', autoOpen: true });
  }, [focusStore, rule.id]);
  React.useEffect(
    () => () => {
      handoff.current = false;
    },
    []
  );
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next && locked) return;
        if (next) handoff.current = false;
        setOpen(next);
      }}
    >
      {/* `asChild` for the reason spelled out on the value popover's copy. */}
      <PopoverTrigger
        asChild
        disabled={actions.disabled}
        {...filterReadOnlyProps(actions)}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        align='start'
        onCloseAutoFocus={(event) => {
          if (!handoff.current) return;
          handoff.current = false;
          event.preventDefault();
        }}
        className={cn('w-auto min-w-40 p-0', className)}
      >
        {/* INSIDE the panel deliberately: only a child of the content is
       unmounted by the exit transition rather than by the close. */}
        <FilterStepHandoff onRelease={release} />
        <FilterMenu
          items={items}
          selected={rule.operator ? [rule.operator] : []}
          onSelectionChange={(values) => {
            const value = values[0];
            if (value === void 0) {
              close();
              return;
            }
            const chosen = getFilterOperator(operators, value);
            const building = !rule.operator;
            actions.updateRule(rule.id, {
              operator: value,
              /* The value moves with the operator: "is" to "is any of" would
           leave a bare string where every reader expects an array. */
              value: coerceFilterValue(
                rule.value,
                getFilterOperator(operators, rule.operator),
                chosen
              )
            });
            if (building && operatorTakesValue(chosen)) {
              handoff.current = true;
              setOpen(false);
              return;
            }
            close();
          }}
          labels={actions.labels}
          ariaLabel={field.label}
          searchPlaceholder={actions.labels.searchOperators}
          searchable={false}
          maxHeight={320}
        />
      </PopoverContent>
    </Popover>
  );
}
export function FilterMoveToMenuItems({ nodeId }) {
  const actions = useFilterActions();
  const reorderable = useFilterReorderable();
  const locked = isFilterLocked(actions);
  const query = actions.getQuery();
  const found = findFilterNode(query, nodeId);
  if (!found || !found.parent) return null;
  const destinations = [];
  if (found.parent.id !== query.id) {
    destinations.push({
      id: query.id,
      label: actions.labels.moveToTopLevel,
      size: query.rules.length
    });
  }
  let position = 0;
  const visit = (group, inside) => {
    for (const child of group.rules) {
      if (!isFilterGroup(child)) continue;
      position += 1;
      const within = inside || child.id === nodeId;
      if (!within && child.id !== found.parent.id) {
        destinations.push({
          id: child.id,
          label: actions.labels.moveToGroup(position),
          size: child.rules.length
        });
      }
      visit(child, within);
    }
  };
  visit(query, false);
  if (destinations.length === 0) return null;
  if (!reorderable) return null;
  return (
    <>
      {destinations.map((destination) => (
        <DropdownMenuItem
          key={destination.id}
          disabled={locked}
          onClick={() =>
            actions.moveNodeTo(nodeId, destination.id, destination.size)
          }
        >
          {/* A bend into the destination: movement, not duplication or nesting. */}
          <RegistryIcon lucide='CornerDownRightIcon' aria-hidden='true' />
          <span className={FILTER_MENU_LABEL_CLASS}>{destination.label}</span>
        </DropdownMenuItem>
      ))}
    </>
  );
}
export function FilterRuleMenuItems({
  ruleId,
  /** Offer "Wrap in condition group". Off for the chip row, which cannot draw
   *  a group; on in the builder, the only way to nest without dragging. */
  allowGrouping = false
}) {
  const actions = useFilterActions();
  const locked = isFilterLocked(actions);
  return (
    /* Every row leads with an icon. `RegistryIcon` because the source ships
       under five icon sets; no size class, because each style already sizes an
       unsized svg in a menu row; `aria-hidden`, the label IS the name. */
    <>
      <DropdownMenuItem
        disabled={locked}
        onClick={() => actions.duplicateNode(ruleId)}
      >
        <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
        <span className={FILTER_MENU_LABEL_CLASS}>
          {actions.labels.duplicate}
        </span>
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={locked}
        onClick={() => actions.negateRule(ruleId)}
      >
        {/* Two arrows swapping: negation flips to the declared inverse. */}
        <RegistryIcon lucide='ArrowLeftRightIcon' aria-hidden='true' />
        <span className={FILTER_MENU_LABEL_CLASS}>{actions.labels.negate}</span>
      </DropdownMenuItem>
      {allowGrouping ? (
        <DropdownMenuItem
          disabled={locked}
          onClick={() => actions.wrapNodeInGroup(ruleId)}
        >
          {/* Layers: braces read as grouping in only three of the five sets. */}
          <RegistryIcon lucide='LayersIcon' aria-hidden='true' />
          <span className={FILTER_MENU_LABEL_CLASS}>
            {actions.labels.wrapInGroup}
          </span>
        </DropdownMenuItem>
      ) : null}
      {allowGrouping ? <FilterMoveToMenuItems nodeId={ruleId} /> : null}
      {/* OPTIONAL, and gated on both halves of "would this do anything": the
         handler is the consumer's opt-in, and an already-advanced bar has
         nothing to convert. NOT gated on `locked`: it changes no query, is
         handed no mutator, and the shipped kebab will not open while locked. */}
      {actions.convertToAdvanced && actions.variant !== 'advanced' ? (
        <DropdownMenuItem onClick={() => actions.convertToAdvanced?.()}>
          {/* Sliders: the one "advanced settings" glyph in all five sets. */}
          <RegistryIcon lucide='SlidersHorizontalIcon' aria-hidden='true' />
          <span className={FILTER_MENU_LABEL_CLASS}>
            {actions.labels.convertToAdvanced}
          </span>
        </DropdownMenuItem>
      ) : null}
      <DropdownMenuItem
        variant='destructive'
        disabled={locked}
        onClick={() => actions.removeNode(ruleId)}
      >
        {/* No colour: the destructive variant already paints the row's svgs. */}
        <RegistryIcon lucide='Trash2Icon' aria-hidden='true' />
        <span className={FILTER_MENU_LABEL_CLASS}>{actions.labels.remove}</span>
      </DropdownMenuItem>
    </>
  );
}
function FilterChipImpl({ rule, index }) {
  const actions = useFilterActions();
  const render = useFilterRender();
  const focusStore = useFilterFocusStore();
  const focused = useFilterChipFocused(rule.id);
  const noFocus = useFilterFocusEmpty();
  const locked = isFilterLocked(actions);
  const sizes = filterControlSizes(actions);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isTabStop = focused || (noFocus && index === 0);
  const field = getFilterField(actions.index, rule.path);
  const operators = field ? actions.resolveOperators(field) : [];
  const operator = getFilterOperator(operators, rule.operator);
  const {
    pathText,
    pathLabel,
    pathCollapsed,
    operatorLabel,
    valueLabel,
    valueText,
    valueFullText,
    valueEmpty
  } = useFilterRuleDisplay(rule, field, operator);
  if (!field) {
    return (
      <ButtonGroup
        data-slot='filter-chip'
        data-unknown=''
        role='group'
        aria-label={actions.labels.filterLabel(
          rule.path.join(actions.labels.pathSeparator)
        )}
        data-focused={focused || void 0}
        data-rule-id={rule.id}
        data-index={index}
        tabIndex={isTabStop ? 0 : -1}
        onFocusCapture={() => {
          if (!focused)
            focusStore.set({ id: rule.id, segment: null, autoOpen: false });
        }}
      >
        <ButtonGroupText className='bg-ui-background dark:bg-ui-input/30 text-ui-muted-foreground'>
          {rule.path.join(actions.labels.pathSeparator)}
        </ButtonGroupText>
        <Button
          variant='outline'
          size={sizes.icon}
          className='bg-ui-background dark:bg-ui-input/30'
          aria-label={actions.labels.remove}
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
          onClick={() => actions.removeNode(rule.id)}
        >
          <RegistryIcon lucide='XIcon' />
        </Button>
      </ButtonGroup>
    );
  }
  if (render.renderChip) return <>{render.renderChip(rule)}</>;
  const focusSegment = (segment) =>
    focusStore.set({ id: rule.id, segment, autoOpen: false });
  const incomplete = !rule.operator;
  const hasValue = Boolean(rule.operator) && operatorTakesValue(operator);
  const valueName =
    valueEmpty && !field.valueText ? actions.labels.noValue : valueText;
  return (
    <ButtonGroup
      data-slot='filter-chip'
      role='group'
      aria-label={actions.labels.filterLabel(
        `${pathText} ${operatorLabel}${hasValue ? ` ${valueName}` : ''}`.trim() +
          (incomplete ? `, ${actions.labels.incomplete}` : '')
      )}
      data-focused={focused || void 0}
      data-incomplete={incomplete || void 0}
      data-rule-id={rule.id}
      tabIndex={isTabStop ? 0 : -1}
      className={cn(

        'max-w-full overflow-x-auto'
      )}
      onFocusCapture={() => {
        if (!focused)
          focusStore.set({ id: rule.id, segment: null, autoOpen: false });
      }}
      data-index={index}
    >
      {/* DISPLAY ONLY: a div, not a button, not a tab stop, no popover. The
       attribute is fixed for the life of the chip. */}
      <ButtonGroupText
        title={pathCollapsed ? void 0 : pathText}
        className='bg-ui-background dark:bg-ui-input/30 cursor-default gap-1.5'
      >
        {field.icon}
        {/* Zero gap INSIDE the path, so the separator's own margin is the only
       air around a chevron; `gap-1.5` used to stack 6px a side on it. */}
        <span className='flex items-center'>{pathLabel}</span>
      </ButtonGroupText>

      <FilterOperatorPopover
        rule={rule}
        field={field}
        trigger={
          <ButtonGroupText
            asChild
            className={cn(
              'hover:bg-ui-accent bg-ui-background dark:bg-ui-input/30 cursor-default',
              /* The operator is connective tissue between the field and the
           value, so it reads quieter than either - unless it is still
           the prompt "Select condition", the one thing to act on. */
              incomplete ? 'text-ui-foreground' : 'text-ui-muted-foreground'
            )}
            onPointerDown={() => focusSegment('operator')}
          >
            {/* ONE element that is both the group text and the trigger: an
         extra wrapper here is the direct child the group would fuse. */}
            <button type='button'>{operatorLabel}</button>
          </ButtonGroupText>
        }
      />

      {/* No condition, no value: `getFilterArity(undefined)` defaults to "one",
       so testing the operator alone renders a stray value segment. */}
      {hasValue ? (
        <FilterValuePopover
          rule={rule}
          field={field}
          operator={operator}
          trigger={
            <ButtonGroupText
              asChild
              aria-label={locked ? valueFullText : valueText}
              title={valueFullText === valueText ? void 0 : valueFullText}
              className={cn(
                'hover:bg-ui-accent bg-ui-background dark:bg-ui-input/30 cursor-default',
                valueEmpty && 'text-ui-muted-foreground'
              )}
              onPointerDown={() => focusSegment('value')}
            >
              {/* One element, for the reason on the operator segment. */}
              <button type='button'>{valueLabel}</button>
            </ButtonGroupText>
          }
        />
      ) : null}

      <DropdownMenu
        open={menuOpen}
        onOpenChange={(next) => {
          if (next && locked) return;
          setMenuOpen(next);
        }}
      >
        <DropdownMenuTrigger
          asChild
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
        >
          <Button
            variant='outline'
            size={sizes.icon}
            className='bg-ui-background dark:bg-ui-input/30'
            aria-label={actions.labels.chipMenu(field.label)}
            onPointerDown={() => focusSegment('menu')}
          >
            <RegistryIcon lucide='EllipsisVerticalIcon' />
          </Button>
        </DropdownMenuTrigger>
        {/* The SAME sizing the builder's menus use, from one constant: a menu
       that cuts "Convert to group" in one chrome is one defect twice. */}
        <DropdownMenuContent
          align='end'
          className={cn(FILTER_MENU_CLASS, actions.menuClassName)}
        >
          <FilterRuleMenuItems ruleId={rule.id} />
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
export const FilterChip = React.memo(FilterChipImpl);
