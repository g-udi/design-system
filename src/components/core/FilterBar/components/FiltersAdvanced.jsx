'use client';
import * as React from 'react';
import { FilterFieldPicker } from './FiltersBuilder.jsx';
import {
  FilterMoveToMenuItems,
  FilterOperatorPopover,
  FilterRuleMenuItems,
  FilterValuePopover,
  useFilterRuleDisplay
} from './FiltersChip.jsx';
import {
  filterControlSizes,
  filterReadOnlyProps,
  FilterReorderProvider,
  isFilterLocked,
  useFilterActions,
  useFilterChipAutoOpen,
  useFilterChipFocused,
  useFilterFocusEmpty,
  useFilterFocusStore,
  useFilterRender,
  useFilterReorderable,
  useFilterRowPending,
  useFilterRowStateStore,
  useFilterSegmentFocus,
  useFilterState
} from '../FiltersContext.jsx';
import {
  FILTER_ROW_SELECTOR,
  useFilterRowDrag
} from './FiltersDnd.jsx';
import { filterIssueLabel } from '../filterLabels.jsx';
import {
  FILTER_FIELD_PICKER_CLASS,
  FILTER_MENU_CLASS,
  FILTER_MENU_LABEL_CLASS,
  filterCombinatorSlot,
  getFilterField,
  isFilterFieldPickable,
  joinFilterPath
} from '../filterModel.jsx';
import {
  getFilterArity,
  getFilterOperator,
  operatorTakesValue
} from '../filterOperators.jsx';
import {
  collectFilterIssues,
  createFilterRule,
  isFilterRule
} from '../filterQuery.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../DropdownMenu/DropdownMenuPrimitives.jsx';
import { FieldInput as Input } from '../../Field/index.js';
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
const CONTENT_COLUMNS = ['combinator', 'field', 'operator', 'value'];
const ACTION_COLUMNS = ['drag', 'menu', 'add', 'remove'];
function nearestColumn(band, from, available) {
  const at = band.indexOf(from);
  if (at === -1) return void 0;
  for (let step = 0; step < band.length; step++) {
    const before = step === 0 ? void 0 : available.get(band[at - step] ?? '');
    if (before) return before;
    const after = available.get(band[at + step] ?? '');
    if (after) return after;
  }
  return void 0;
}
const CELL_ATTRIBUTE = 'data-filter-cell';
const CELL_INPUT_ATTRIBUTE = 'data-filter-cell-input';
const ROW_SELECTOR = FILTER_ROW_SELECTOR;
const FilterDragContext = React.createContext(null);
const FilterIssueContext = React.createContext(/* @__PURE__ */ new Map());
function cellProps(column, active) {
  return {
    'data-filter-cell': column,
    // ONE tab stop for the whole builder; the arrows move within it.
    tabIndex: active === column ? 0 : -1
  };
}
function issueProps(issue, column, message) {
  if (!issue || issue.column !== column) return null;
  return {
    'aria-invalid': true,
    'data-invalid': '',
    'aria-description': message
    // NO `title`: the hint icon carries the sentence in a real tooltip, and a
    // native one would clobber the truncation `title` beside it.
  };
}
const CELL_CLASS = cn(
  'w-full min-w-0 justify-between gap-1.5 font-normal',
  // `>svg` is the caret and only the caret: a field's own type icon sits in a
  // nested span, where it keeps full strength because it is content.
  '[&>svg]:text-ui-muted-foreground',
  // WHAT A CELL GIVES UP FIRST: padding, icon and caret cost about 44px before
  // a character is drawn, and the name is what nothing else can reconstruct.
  // Container queries and not a viewport breakpoint: the question is how wide
  // THIS cell is, and one panel holds a 300px cell and a 40px one.
  '@max-[7rem]/cell:gap-0 @max-[7rem]/cell:[&>svg]:hidden',
  '@max-[5rem]/cell:[&_span>svg]:hidden'
);
const CELL_INVALID_CLASS =
  'data-invalid:ring-ui-destructive/40 data-invalid:ring-1';
const COMBINATOR_CLASS = cn(
  'w-16 shrink-0 items-center justify-center',
  // 6px of its own on TOP of the band's `gap-1.5`: this column is the
  // sentence's connective, not a fourth control butted against the attribute.
  'me-1.5'
);
const COMBINATOR_TEXT_CLASS = cn(
  'text-ui-muted-foreground w-full truncate px-1 text-center text-sm'
);
const ROW_BAND_CLASS = 'flex min-w-0 items-center gap-1.5';
const CONTENT_BAND_CLASS = 'min-w-0 flex-1 gap-1.5';
const CELL_BOX_CLASS = '@container/cell flex min-w-0 shrink grow-0';
const FIELD_CELL_CLASS = 'ds-filter-field-cell';
const OPERATOR_CELL_CLASS = 'ds-filter-operator-cell';
const VALUE_CELL_CLASS = 'ds-filter-value-cell';
const ACTION_BAND_CLASS = cn(
  'text-ui-muted-foreground flex shrink-0 items-center gap-0.5 pe-1'
);
const ACTION_CONTROL_CLASS = cn(
  'hover:inset-ring hover:inset-ring-ui-border',
  // Base UI.
  'data-popup-open:inset-ring data-popup-open:inset-ring-ui-border',
  // Radix.
  'data-[state=open]:inset-ring data-[state=open]:inset-ring-ui-border'
);
const FILTER_ROW_GAP_CLASS = 'gap-3';
const FILTER_ROW_GAP_CANCEL_CLASS = '-mt-3';
const FILTER_ROW_HALF_GAP_CLASS = {
  // The slot names the BOUNDARY between two rows, which is the middle of the
  // gap: 6px of it less HALF the rule's own 2px, so its CENTRE lands there.
  before: 'data-[drop-edge=before]:after:mb-[5px]',
  after: 'data-[drop-edge=after]:after:mt-[5px]'
};
const PANEL_PAD_VAR = '--filter-panel-pad';
const PANEL_PAD_POPOVER = '0.75rem';
const PANEL_PAD_INLINE = '0px';
const PANEL_GUTTER_CLASS = 'px-(--filter-panel-pad)';
const PANEL_CLASS =
  'flex w-full min-w-0 flex-col gap-2 py-(--filter-panel-pad)';
const GROUP_CARD_CLASS = cn(
  'bg-ui-muted/40 min-w-0 flex-1 rounded-md',
  'inset-ring inset-ring-ui-border',
  'ps-2 pe-0',
  'data-invalid:inset-ring-ui-destructive/50',
  // The DESTINATION of a drop into this group, told apart from the insertion
  // slot by STYLE and not size: dashed is not there yet, solid exists.
  'data-drop-into:bg-ui-muted/60',
  'data-drop-into:outline-1 data-drop-into:outline-solid',
  'data-drop-into:outline-ui-border data-drop-into:-outline-offset-2'
);
const TRACK_CONTAINER_CLASS = '@container/track';
const GROUP_COMBINATOR_WRAP_CLASS = '@max-[26rem]/track:w-full';
const GROUP_COMBINATOR_WRAPPED_CLASS = '@max-[26rem]/track:w-16';
const DROP_SLOT_INDICATOR = cn(
  // The SOURCE in flight, faded rather than hidden. THREE FIFTHS is a contrast
  // measurement: at 35 under a `blur-[1px]` the text composited to #a9a9a9,
  // 2.35:1 on the light panel, under even the 3:1 line for a non-text mark.
  'relative rounded-md',
  'data-dragging:opacity-60',
  // THE INSERTION LINE lives in the gap rather than overlaying a real row.
  // `end-1` and not `end-0`: four pixels of `pe-1` are the kebab column.
  'data-drop-edge:after:absolute',
  'data-drop-edge:after:start-0 data-drop-edge:after:end-1',
  'data-drop-edge:after:h-0.5 data-drop-edge:after:rounded-full',
  'data-drop-edge:after:bg-ui-primary',
  'data-drop-edge:after:z-10',
  'data-[drop-edge=before]:after:bottom-full',
  FILTER_ROW_HALF_GAP_CLASS.before,
  'data-[drop-edge=after]:after:top-full',
  FILTER_ROW_HALF_GAP_CLASS.after
);
const DROP_INDICATOR = DROP_SLOT_INDICATOR;
const FOOTER_DROP_CLASS = cn(
  'data-drop-into:after:absolute',
  'data-drop-into:after:start-(--filter-panel-pad)',
  'data-drop-into:after:end-[calc(var(--filter-panel-pad)+4px)]',
  'data-drop-into:after:top-0 data-drop-into:after:h-0.5',
  'data-drop-into:after:rounded-full data-drop-into:after:bg-ui-primary'
);
function ownCells(row) {
  return Array.from(row.querySelectorAll(`[${CELL_ATTRIBUTE}]`)).filter(
    (cell) => cell.closest(ROW_SELECTOR) === row
  );
}
function CombinatorCell({
  index,
  parentId,
  combinator,
  active,
  onFocus,
  className
}) {
  const actions = useFilterActions();
  const sizes = filterControlSizes(actions);
  const slot = filterCombinatorSlot(index);
  const word = combinator === 'and' ? actions.labels.and : actions.labels.or;
  if (slot === 'where') {
    return (
      <span className={cn(COMBINATOR_TEXT_CLASS, className)}>
        {actions.labels.where}
      </span>
    );
  }
  if (slot === 'echo') {
    return <span className={cn(COMBINATOR_TEXT_CLASS, className)}>{word}</span>;
  }
  const name = actions.labels.combinatorLabel(word);
  return (
    <Button
      variant='outline'
      size={sizes.button}
      aria-label={name}
      title={name}
      disabled={actions.disabled}
      {...filterReadOnlyProps(actions)}
      className={cn(
        'group/combinator relative w-full min-w-0 justify-center px-1.5 font-normal',
        className
      )}
      {...cellProps('combinator', active)}
      onFocus={onFocus('combinator')}
      onClick={() => actions.toggleCombinator(parentId)}
    >
      <span className='truncate'>{word}</span>
      {/* ABSOLUTELY POSITIONED, so the word still centres at 0.00px. */}
      <span
        aria-hidden='true'
        className={cn(
          'pointer-events-none absolute end-1 opacity-0 transition-opacity',
          'group-hover/combinator:opacity-60',
          'group-focus-visible/combinator:opacity-60',
          '[&_svg]:size-3'
        )}
      >
        <RegistryIcon lucide='RefreshCwIcon' />
      </span>
    </Button>
  );
}
function canFilterNodeMove(query, position) {
  if (position.parentId !== query.id) return true;
  return query.rules.length > 1;
}
function RowIssueHint({ message, className }) {
  if (!message) return null;
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            data-slot='filter-row-issue'
            tabIndex={-1}
            aria-hidden='true'
            className={cn(
              'text-ui-destructive flex shrink-0 items-center justify-center [&_svg]:size-3.5',
              className
            )}
          >
            <RegistryIcon lucide='CircleAlertIcon' />
          </span>
        </TooltipTrigger>
        <TooltipContent side='top'>{message}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
function RowHandle({ nodeId, active, onFocus }) {
  const actions = useFilterActions();
  const sizes = filterControlSizes(actions);
  const dragProps = React.useContext(FilterDragContext);
  const locked = isFilterLocked(actions);
  return (
    <Button
      variant='ghost'
      size={sizes.icon}
      aria-label={actions.labels.reorder}
      aria-keyshortcuts='Alt+ArrowUp Alt+ArrowDown'
      aria-description={actions.labels.reorderHint}
      disabled={actions.disabled}
      {...filterReadOnlyProps(actions)}
      className={cn(
        'focus-visible:text-ui-foreground cursor-grab touch-none',
        'active:cursor-grabbing',
        ACTION_CONTROL_CLASS
      )}
      {...cellProps('drag', active)}
      onFocus={onFocus('drag')}
      {...(locked ? null : dragProps?.(nodeId))}
    >
      <RegistryIcon lucide='GripVerticalIcon' />
    </Button>
  );
}
function useActiveColumn(nodeId, columns, isFirstRow) {
  const focused = useFilterChipFocused(nodeId);
  const segment = useFilterSegmentFocus(nodeId);
  const noFocus = useFilterFocusEmpty();
  if (focused) {
    return segment && columns.includes(segment) ? segment : columns[0];
  }
  return noFocus && isFirstRow ? columns[0] : null;
}
function useFilterIssue(nodeId) {
  return React.useContext(FilterIssueContext).get(nodeId);
}
function usesInlineTextEditor(field, operator, hasCustomDisplay) {
  if (field.editor) return false;
  if (field.options || field.loadOptions) return false;
  if (field.renderValue || field.valueText || hasCustomDisplay) return false;
  const type = field.type ?? 'text';
  if (type !== 'text' && type !== 'number') return false;
  return getFilterArity(operator) === 'one';
}
function FilterInlineValueCell({
  rule,
  field,
  issue,
  issueText,
  active,
  onFocus
}) {
  const actions = useFilterActions();
  const focusStore = useFilterFocusStore();
  const locked = isFilterLocked(actions);
  const numeric = (field.type ?? 'text') === 'number';
  const autoOpen = useFilterChipAutoOpen(rule.id) === 'value';
  const inputRef = React.useRef(null);
  const committed =
    rule.value === void 0 || rule.value === null ? '' : String(rule.value);
  const [draft, setDraft] = React.useState(committed);
  const [seed, setSeed] = React.useState(committed);
  if (seed !== committed) {
    setSeed(committed);
    setDraft(committed);
  }
  React.useEffect(() => {
    if (!autoOpen) return;
    if (!locked) {
      const input = inputRef.current;
      input?.focus();
      input?.select();
    }
    focusStore.set({ id: rule.id, segment: 'value', autoOpen: false });
  }, [autoOpen, locked, focusStore, rule.id]);
  const commit = () => {
    if (draft === seed) return;
    if (numeric) {
      const text = draft.trim();
      if (text === '') {
        actions.updateRule(rule.id, { value: void 0 });
        return;
      }
      const parsed = Number(text);
      if (!Number.isFinite(parsed)) {
        setDraft(seed);
        return;
      }
      actions.updateRule(rule.id, { value: parsed });
      return;
    }
    actions.updateRule(rule.id, { value: draft });
  };
  return (
    /* A FRAGMENT, not a wrapper: the positioning context for the error mark
       is the CELL itself, which already carries the column's basis. */
    <>
      <Input
        ref={inputRef}
        aria-label={field.label}
        placeholder={field.placeholder ?? actions.labels.valuePlaceholder}
        inputMode={numeric ? 'decimal' : void 0}
        value={draft}
        className={cn('h-full', issueText && 'pe-7', CELL_INVALID_CLASS)}
        readOnly={locked}
        disabled={actions.disabled}
        {...filterReadOnlyProps(actions)}
        {...cellProps('value', active)}
        {...{ [CELL_INPUT_ATTRIBUTE]: '' }}
        {...issueProps(issue, 'value', issueText)}
        onFocus={onFocus('value')}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            event.preventDefault();
            commit();
            return;
          }
          if (event.key === 'Escape') {
            if (draft === seed) return;
            event.preventDefault();
            event.stopPropagation();
            setDraft(seed);
          }
        }}
      />
      <RowIssueHint
        message={issueText}
        className='pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 [&>*]:pointer-events-auto'
      />
    </>
  );
}
function FilterAdvancedRowImpl({ rule, position }) {
  const actions = useFilterActions();
  const render = useFilterRender();
  const sizes = filterControlSizes(actions);
  const focusStore = useFilterFocusStore();
  const locked = isFilterLocked(actions);
  const { query } = useFilterState();
  const field = getFilterField(actions.index, rule.path);
  const operators = field ? actions.resolveOperators(field) : [];
  const operator = getFilterOperator(operators, rule.operator);
  const takesValue = Boolean(rule.operator) && operatorTakesValue(operator);
  const inlineValue =
    takesValue && field
      ? usesInlineTextEditor(field, operator, Boolean(render.renderValue))
      : false;
  const issue = useFilterIssue(rule.id);
  const issueText = issue ? filterIssueLabel(issue, actions.labels) : '';
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
  const fieldAutoOpen = useFilterChipAutoOpen(rule.id) === 'field';
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [pickerPath, setPickerPath] = React.useState(() =>
    rule.path.slice(0, -1)
  );
  const [pickerQuery, setPickerQuery] = React.useState('');
  React.useEffect(() => {
    if (!fieldAutoOpen || pickerOpen) return;
    if (!locked) setPickerOpen(true);
    focusStore.set({ id: rule.id, segment: 'field', autoOpen: false });
  }, [fieldAutoOpen, pickerOpen, locked, focusStore, rule.id]);
  React.useEffect(() => {
    if (!pickerOpen) return;
    setPickerPath(rule.path.slice(0, -1));
    setPickerQuery('');
  }, [pickerOpen, rule.path]);
  const handoffRef = React.useRef(false);
  React.useEffect(() => {
    if (!pickerOpen) return;
    handoffRef.current = false;
    return focusStore.subscribe(() => {
      if (focusStore.getSnapshot().autoOpen) handoffRef.current = true;
    });
  }, [focusStore, pickerOpen]);
  const onCloseAutoFocus = (event) => {
    if (!handoffRef.current) return;
    handoffRef.current = false;
    event.preventDefault();
  };
  const slot = filterCombinatorSlot(position.index);
  const reorderable = useFilterReorderable();
  const canMove = reorderable && canFilterNodeMove(query, position);
  const rowStateStore = useFilterRowStateStore();
  const pending = useFilterRowPending(rule.id);
  const columns = React.useMemo(() => {
    const list = [];
    if (slot === 'toggle') list.push('combinator');
    list.push('field');
    if (!pending) {
      list.push('operator');
      if (takesValue) list.push('value');
    }
    if (canMove) list.push('drag');
    list.push('menu');
    return list;
  }, [slot, takesValue, canMove, pending]);
  const active = useActiveColumn(
    rule.id,
    columns,
    position.depth === 1 && position.index === 0
  );
  const onCellFocus = React.useCallback(
    (column) => () =>
      focusStore.set({ id: rule.id, segment: column, autoOpen: false }),
    [focusStore, rule.id]
  );
  if (!field) return null;
  return (
    <div
      role='group'
      aria-label={actions.labels.rowLabel(
        `${pathText} ${operatorLabel}`,
        position.depth
      )}
      data-slot='filter-row'
      data-node-id={rule.id}
      data-parent-id={position.parentId}
      data-index={position.index}
      data-depth={position.depth}
      className={cn('ds-filter-rule-row group/row min-w-0 gap-1.5', DROP_INDICATOR)}
    >
      <div className={cn(COMBINATOR_CLASS, CELL_BOX_CLASS)}>
        <CombinatorCell
          index={position.index}
          parentId={position.parentId}
          combinator={position.combinator}
          active={active}
          onFocus={onCellFocus}
        />
      </div>

      {/* THE CONTENT BAND: sized to itself, not to a share of the row. */}
      <div className={cn('ds-filter-rule-content', CONTENT_BAND_CLASS)}>
        <div className={cn(CELL_BOX_CLASS, FIELD_CELL_CLASS)}>
          <Popover
            open={pickerOpen}
            onOpenChange={(next) => {
              if (next && locked) return;
              setPickerOpen(next);
            }}
          >
            <PopoverTrigger
              asChild
              disabled={actions.disabled}
              {...filterReadOnlyProps(actions)}
            >
              <Button
                variant='outline'
                size={sizes.button}
                aria-label={pathText}
                title={pathCollapsed ? void 0 : pathText}
                className={CELL_CLASS}
                {...cellProps('field', active)}
                onFocus={onCellFocus('field')}
              >
                <span className='flex min-w-0 items-center gap-1.5 truncate'>
                  {field.icon}
                  <span className='truncate'>{pathLabel}</span>
                </span>
                <RegistryIcon lucide='ChevronDownIcon' />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align='start'
              onCloseAutoFocus={onCloseAutoFocus}
              className={cn(
                FILTER_FIELD_PICKER_CLASS,
                actions.fieldPickerClassName
              )}
            >
              <FilterFieldPicker
                path={pickerPath}
                onPathChange={setPickerPath}
                query={pickerQuery}
                onQueryChange={setPickerQuery}
                onSelect={(path, defaultOperator) => {
                  setPickerOpen(false);
                  focusStore.set({
                    id: rule.id,
                    segment: pending ? 'operator' : 'field',
                    autoOpen: pending
                  });
                  rowStateStore.resolvePending(rule.id);
                  if (joinFilterPath(path) === joinFilterPath(rule.path))
                    return;
                  actions.updateRule(rule.id, {
                    path,
                    operator: pending ? '' : (defaultOperator ?? ''),
                    value: void 0
                  });
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {pending ? null : (
          <div className={cn(CELL_BOX_CLASS, OPERATOR_CELL_CLASS)}>
            <FilterOperatorPopover
              rule={rule}
              field={field}
              trigger={
                <Button
                  variant='outline'
                  size={sizes.button}
                  title={operatorLabel}
                  className={cn(
                    CELL_CLASS,
                    CELL_INVALID_CLASS,
                    'text-ui-muted-foreground'
                  )}
                  {...cellProps('operator', active)}
                  {...issueProps(issue, 'operator', issueText)}
                  onFocus={onCellFocus('operator')}
                >
                  <span className='truncate'>{operatorLabel}</span>
                  <RegistryIcon lucide='ChevronDownIcon' />
                </Button>
              }
            />
          </div>
        )}

        {/* The cell stays even with no value: dropping it would shift the
       trailing buttons into the value column on that row alone. It goes
       ENTIRELY while the row is PENDING, the one case that argument does
       not cover: a row choosing its attribute has no column count yet. */}
        {pending ? null : (
          <div
            className={cn(
              CELL_BOX_CLASS,
              VALUE_CELL_CLASS,
              /* The positioning context for an inline editor's error mark. */
              'relative',
              /* What lets an inline box match the buttons beside it: as tall as
         the row, so `h-full` inside resolves to the button height. */
              'self-stretch'
            )}
          >
            {takesValue ? (
              inlineValue ? (
                <FilterInlineValueCell
                  rule={rule}
                  field={field}
                  issue={issue}
                  issueText={issueText}
                  active={active}
                  onFocus={onCellFocus}
                />
              ) : (
                <FilterValuePopover
                  rule={rule}
                  field={field}
                  operator={operator}
                  trigger={
                    <Button
                      variant='outline'
                      size={sizes.button}
                      aria-label={locked ? valueFullText : valueText}
                      title={valueFullText}
                      className={cn(
                        CELL_CLASS,
                        CELL_INVALID_CLASS,
                        'h-full',
                        valueEmpty && 'text-ui-muted-foreground'
                      )}
                      {...cellProps('value', active)}
                      {...issueProps(issue, 'value', issueText)}
                      onFocus={onCellFocus('value')}
                    >
                      {/* FREE OUTPUT: whatever the field draws. */}
                      <span className='min-w-0 flex-1 truncate text-start'>
                        {valueLabel}
                      </span>
                      {/* The error, INSIDE the control that failed. */}
                      <RowIssueHint message={issueText} />
                    </Button>
                  }
                />
              )
            ) : null}
          </div>
        )}
      </div>

      {/* The WEIGHT is on the CLUSTER: a `ghost` button names no colour, so
       the kebab took the full `--foreground`. */}
      <div className={ACTION_BAND_CLASS}>
        {canMove ? (
          <RowHandle nodeId={rule.id} active={active} onFocus={onCellFocus} />
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
              variant='ghost'
              size={sizes.icon}
              aria-label={actions.labels.chipMenu(field.label)}
              className={ACTION_CONTROL_CLASS}
              {...cellProps('menu', active)}
              onFocus={onCellFocus('menu')}
            >
              <RegistryIcon lucide='EllipsisVerticalIcon' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className={cn(FILTER_MENU_CLASS, actions.menuClassName)}
          >
            {/* Grouping is HERE, not on a chip: the keyboard path to
       `a AND (b OR c)`. */}
            <FilterRuleMenuItems ruleId={rule.id} allowGrouping />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
export const FilterAdvancedRow = React.memo(FilterAdvancedRowImpl);
function FilterUnknownRow({ rule, position }) {
  const actions = useFilterActions();
  const sizes = filterControlSizes(actions);
  return (
    <div
      role='group'
      aria-label={actions.labels.rowLabel(
        rule.path.join(actions.labels.pathSeparator),
        position.depth
      )}
      data-slot='filter-row'
      data-node-id={rule.id}
      data-parent-id={position.parentId}
      data-index={position.index}
      data-depth={position.depth}
      data-unknown=''
      className={cn(ROW_BAND_CLASS, DROP_INDICATOR)}
    >
      <span className='text-ui-muted-foreground min-w-0 flex-1 truncate text-sm'>
        {rule.path.join(actions.labels.pathSeparator)}
      </span>
      {/* The same trailing band, so the broken row lands on the kebab column. */}
      <div className={ACTION_BAND_CLASS}>
        <Button
          variant='ghost'
          size={sizes.icon}
          aria-label={actions.labels.remove}
          className={ACTION_CONTROL_CLASS}
          data-filter-cell='remove'
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
          onClick={() => actions.removeNode(rule.id)}
        >
          <RegistryIcon lucide='XIcon' />
        </Button>
      </div>
    </div>
  );
}
function FilterAdvancedGroup({ group, position }) {
  const actions = useFilterActions();
  const sizes = filterControlSizes(actions);
  const focusStore = useFilterFocusStore();
  const { query } = useFilterState();
  const issue = useFilterIssue(group.id);
  const issueText = issue ? filterIssueLabel(issue, actions.labels) : '';
  const reorderable = useFilterReorderable();
  const canMove = reorderable && canFilterNodeMove(query, position);
  const rowStateStore = useFilterRowStateStore();
  const slot = filterCombinatorSlot(position.index);
  const columns = React.useMemo(() => {
    const list = [];
    if (slot === 'toggle') list.push('combinator');
    list.push('add');
    if (canMove) list.push('drag');
    list.push('menu');
    return list;
  }, [slot, canMove]);
  const active = useActiveColumn(
    group.id,
    columns,
    position.depth === 1 && position.index === 0
  );
  const onCellFocus = React.useCallback(
    (column) => () =>
      focusStore.set({ id: group.id, segment: column, autoOpen: false }),
    [focusStore, group.id]
  );
  const description =
    group.combinator === 'and'
      ? actions.labels.groupAll
      : actions.labels.groupAny;
  const addInto = () => {
    const id = addFilterRow(actions, group.id);
    if (!id) return;
    rowStateStore.markPending(id);
    focusStore.set({ id, segment: 'field', autoOpen: true });
  };
  return (
    <div
      role='group'
      aria-label={actions.labels.groupLabel(description, position.depth)}
      data-slot='filter-row'
      data-node-id={group.id}
      data-parent-id={position.parentId}
      data-index={position.index}
      data-depth={position.depth}
      className={cn('flex flex-wrap items-center gap-1.5', DROP_SLOT_INDICATOR)}
    >
      <div
        className={cn(
          COMBINATOR_CLASS,
          CELL_BOX_CLASS,
          GROUP_COMBINATOR_WRAP_CLASS
        )}
      >
        <CombinatorCell
          index={position.index}
          parentId={position.parentId}
          combinator={position.combinator}
          active={active}
          onFocus={onCellFocus}
          className={GROUP_COMBINATOR_WRAPPED_CLASS}
        />
      </div>

      {/* The CARD lights up as the drop destination, not the header strip the
       engine measured. This `data-invalid` only styles; the announcement
       rides the footer's add button, which is the focusable control. */}
      <div
        data-slot='filter-group'
        data-invalid={issue ? '' : void 0}
        className={GROUP_CARD_CLASS}
      >
        {/* Eight pixels, because it is a DROP TARGET and a zone beats a row. */}
        <div
          data-slot='filter-group-header'
          className='flex h-2 items-center'
          data-drop-parent={group.id}
          data-drop-index={0}
        />

        {/* A CONTAINER: the box every child row divides up. */}
        <div
          className={cn(
            TRACK_CONTAINER_CLASS,
            'flex flex-col',
            FILTER_ROW_GAP_CLASS
          )}
        >
          {group.rules.length === 0 ? (
            <p
              className={cn(
                /* 70% foreground, not the muted token: on the card's tint the
         muted foreground measured 4.35:1 in light, under 4.5:1 AA. */
                'text-ui-foreground rounded-md border border-dashed px-2 py-3',
                'text-center text-xs',
                'data-drop-into:border-ui-primary/60 data-drop-into:bg-ui-primary/5',
                'data-drop-into:text-ui-primary'
              )}
              data-slot='filter-group-empty'
              data-drop-parent={group.id}
              data-drop-index={0}
            >
              {actions.labels.groupPlaceholder}
            </p>
          ) : (
            group.rules.map((node, index) => (
              <FilterAdvancedNode
                key={node.id}
                node={node}
                position={{
                  index,
                  parentId: group.id,
                  combinator: group.combinator,
                  depth: position.depth + 1
                }}
              />
            ))
          )}
        </div>

        {/* `flex-nowrap`, or the group's kebab leaves the kebab column. */}
        <div
          data-slot='filter-group-footer'
          className='text-ui-muted-foreground flex flex-nowrap items-center gap-2 pt-2 pb-2'
          data-drop-parent={group.id}
          data-drop-index={group.rules.length}
        >
          <Button
            variant='outline'
            size={sizes.button}
            aria-label={actions.labels.addToGroup}
            className={cn(
              /* `shrink` and not merely `min-w-0`: `shrink-0` is baked into
         the DS Button's own base class. */
              'min-w-0 shrink font-normal',
              'overflow-hidden',
              CELL_INVALID_CLASS
            )}
            disabled={actions.disabled}
            {...filterReadOnlyProps(actions)}
            {...cellProps('add', active)}
            {...issueProps(issue, 'group', issueText)}
            onFocus={onCellFocus('add')}
            onClick={addInto}
          >
            <RegistryIcon lucide='PlusIcon' />
            {actions.labels.addCondition}
          </Button>

          <div className={cn('ms-auto', ACTION_BAND_CLASS)}>
            {canMove ? (
              <RowHandle
                nodeId={group.id}
                active={active}
                onFocus={onCellFocus}
              />
            ) : null}
            <FilterGroupMenu
              group={group}
              active={active}
              onFocus={onCellFocus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function FilterGroupMenu({ group, active, onFocus }) {
  const actions = useFilterActions();
  const sizes = filterControlSizes(actions);
  const locked = isFilterLocked(actions);
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        if (next && locked) return;
        setOpen(next);
      }}
    >
      <DropdownMenuTrigger
        asChild
        disabled={actions.disabled}
        {...filterReadOnlyProps(actions)}
      >
        <Button
          variant='ghost'
          size={sizes.icon}
          aria-label={actions.labels.groupMenu}
          className={ACTION_CONTROL_CLASS}
          {...cellProps('menu', active)}
          onFocus={onFocus('menu')}
        >
          <RegistryIcon lucide='EllipsisVerticalIcon' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className={cn(FILTER_MENU_CLASS, actions.menuClassName)}
      >
        <DropdownMenuItem
          disabled={locked}
          onClick={() => actions.duplicateNode(group.id)}
        >
          <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
          <span className={FILTER_MENU_LABEL_CLASS}>
            {actions.labels.duplicate}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={locked}
          onClick={() => actions.unwrapGroup(group.id)}
        >
          {/* The inverse of the row menu's layers glyph. */}
          <RegistryIcon lucide='UngroupIcon' aria-hidden='true' />
          <span className={FILTER_MENU_LABEL_CLASS}>
            {actions.labels.ungroup}
          </span>
        </DropdownMenuItem>
        <FilterMoveToMenuItems nodeId={group.id} />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          disabled={locked}
          onClick={() => actions.removeNode(group.id)}
        >
          {/* No colour: the destructive variant paints the row's svgs. */}
          <RegistryIcon lucide='Trash2Icon' aria-hidden='true' />
          <span className={FILTER_MENU_LABEL_CLASS}>
            {actions.labels.removeGroup}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function FilterAdvancedNode({ node, position }) {
  const actions = useFilterActions();
  if (!isFilterRule(node)) {
    return <FilterAdvancedGroup group={node} position={position} />;
  }
  if (!getFilterField(actions.index, node.path)) {
    return <FilterUnknownRow rule={node} position={position} />;
  }
  return <FilterAdvancedRow rule={node} position={position} />;
}
function addFilterRow(actions, parentId) {
  if (isFilterLocked(actions)) return null;
  const entry = actions.index.all.find((candidate) =>
    isFilterFieldPickable(candidate.field)
  );
  if (!entry) return null;
  const id = actions.nextId();
  actions.addRule(
    createFilterRule({
      id,
      path: entry.path,
      // Deliberately empty: the row arrives PENDING, and a seeded default
      // would open the next menu with its own answer highlighted.
      operator: ''
    }),
    parentId
  );
  return id;
}
export function FiltersAdvancedPanel({
  mode = 'popover',
  renderEmpty,
  reorderable = false,
  className
}) {
  const actions = useFilterActions();
  const panelRender = useFilterRender();
  const sizes = filterControlSizes(actions);
  const { query, ruleCount, announcement, announcementSeq } = useFilterState();
  const focusStore = useFilterFocusStore();
  const rowStateStore = useFilterRowStateStore();
  const rowStateVersion = React.useSyncExternalStore(
    rowStateStore.subscribe,
    () => rowStateStore.version(),
    () => 0
  );
  const bodyRef = React.useRef(null);
  const locked = isFilterLocked(actions);
  const issues = React.useMemo(
    () =>
      collectFilterIssues(
        query,
        (rule) => {
          const field = getFilterField(actions.index, rule.path);
          if (!field) return null;
          return getFilterArity(
            getFilterOperator(actions.resolveOperators(field), rule.operator)
          );
        },
        // The same normalisation the display callbacks get.
        (rule) => {
          const field = getFilterField(actions.index, rule.path);
          if (!field?.validate) return null;
          const operator = getFilterOperator(
            actions.resolveOperators(field),
            rule.operator
          );
          if (!operator) return null;
          return field.validate({
            value: rule.value,
            values:
              rule.value === void 0 || rule.value === null
                ? []
                : Array.isArray(rule.value)
                  ? rule.value
                  : [rule.value],
            field,
            operator,
            arity: getFilterArity(operator) ?? 'one',
            rule,
            labels: actions.labels
          });
        }
      ),
    [query, actions]
  );
  const visibleIssueMap = React.useMemo(() => {
    const visible = /* @__PURE__ */ new Map();
    for (const issue of issues) {
      if (issue.reason !== 'custom') continue;
      if (rowStateStore.has(issue.nodeId)) visible.set(issue.nodeId, issue);
    }
    return visible;
    // rowStateVersion signals mutations to the stable row-state store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues, rowStateStore, rowStateVersion]);
  const announcedIssues = React.useRef({
    count: visibleIssueMap.size,
    seq: announcementSeq
  });
  React.useEffect(() => {
    const before = announcedIssues.current;
    announcedIssues.current = {
      count: visibleIssueMap.size,
      seq: announcementSeq
    };
    if (announcementSeq !== before.seq) return;
    if (visibleIssueMap.size <= before.count) return;
    actions.announce(actions.labels.issueSummary(visibleIssueMap.size));
  }, [visibleIssueMap, announcementSeq, actions]);
  const heldFocus = React.useRef(false);
  const addRowRef = React.useRef(null);
  const restoreFocus = React.useCallback(() => {
    if (focusStore.getSnapshot().autoOpen) return;
    if (!heldFocus.current) return;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    const rows = Array.from(
      bodyRef.current?.querySelectorAll(ROW_SELECTOR) ?? []
    );
    const { id, segment } = focusStore.getSnapshot();
    const row = id
      ? rows.find((candidate) => candidate.dataset.nodeId === id)
      : void 0;
    const cells = row ? ownCells(row) : [];
    const target =
      cells.find((entry) => entry.getAttribute(CELL_ATTRIBUTE) === segment) ??
      cells[0] ??
      (rows[0] ? ownCells(rows[0])[0] : void 0) ??
      addRowRef.current ??
      void 0;
    target?.focus();
  }, [focusStore]);
  React.useEffect(() => {
    restoreFocus();
  }, [query, announcementSeq, restoreFocus]);
  const addRow = React.useCallback(() => {
    const id = addFilterRow(actions);
    if (!id) return;
    rowStateStore.markPending(id);
    focusStore.set({ id, segment: 'field', autoOpen: true });
  }, [actions, focusStore, rowStateStore]);
  const addGroup = React.useCallback(() => {
    const id = actions.addGroup();
    if (!id) return;
    focusStore.set({ id, segment: 'add', autoOpen: false });
  }, [actions, focusStore]);
  const onKeyDown = (event) => {
    const cell = event.target.closest(`[${CELL_ATTRIBUTE}]`);
    if (event.defaultPrevented) return;
    if (!cell || event.target !== cell) return;
    const body2 = bodyRef.current;
    const row = cell.closest(ROW_SELECTOR);
    if (!body2 || !row) return;
    const editing = cell.hasAttribute(CELL_INPUT_ATTRIBUTE);
    const rows = Array.from(body2.querySelectorAll(ROW_SELECTOR));
    const cells = ownCells(row);
    const rowIndex = rows.indexOf(row);
    const cellIndex = cells.indexOf(cell);
    const rtl = getComputedStyle(cell).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    const focus = (target) => {
      if (!target) return;
      event.preventDefault();
      target.focus();
    };
    const from = cell.getAttribute(CELL_ATTRIBUTE);
    const band = CONTENT_COLUMNS.includes(from)
      ? CONTENT_COLUMNS
      : ACTION_COLUMNS;
    const bandRows = [];
    const seen = /* @__PURE__ */ new Set();
    for (const entry of body2.querySelectorAll(`[${CELL_ATTRIBUTE}]`)) {
      const column = entry.getAttribute(CELL_ATTRIBUTE);
      if (!band.includes(column)) continue;
      const owner = entry.closest(ROW_SELECTOR);
      if (!owner || seen.has(owner)) continue;
      seen.add(owner);
      bandRows.push(owner);
    }
    const bandIndex = bandRows.indexOf(row);
    const focusRow = (step) => {
      const nextRow = bandRows[bandIndex + step];
      if (!nextRow) return;
      const cellsThere = ownCells(nextRow);
      const byColumn = new Map(
        cellsThere.map((entry) => [entry.getAttribute(CELL_ATTRIBUTE), entry])
      );
      focus(nearestColumn(band, from, byColumn) ?? cellsThere[0]);
    };
    const nodeId = row.dataset.nodeId;
    if (!nodeId) return;
    if (
      event.altKey &&
      (event.key === 'ArrowUp' || event.key === 'ArrowDown')
    ) {
      if (locked || !reorderable) return;
      event.preventDefault();
      actions.moveNode(nodeId, event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'ArrowDown') return focusRow(1);
    if (event.key === 'ArrowUp') return focusRow(-1);
    if (editing) return;
    if (event.key === forward) return focus(cells[cellIndex + 1]);
    if (event.key === backward) return focus(cells[cellIndex - 1]);
    if (event.key === 'Home') {
      return focus(event.ctrlKey ? ownCells(rows[0])[0] : cells[0]);
    }
    if (event.key === 'End') {
      const scope = event.ctrlKey ? ownCells(rows[rows.length - 1]) : cells;
      return focus(scope[scope.length - 1]);
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (locked) return;
      event.preventDefault();
      actions.removeNode(nodeId);
      requestAnimationFrame(() => {
        const remaining = Array.from(
          bodyRef.current?.querySelectorAll(ROW_SELECTOR) ?? []
        );
        const target = remaining[Math.min(rowIndex, remaining.length - 1)];
        if (target) ownCells(target)[0]?.focus();
      });
    }
  };
  const dragProps = useFilterRowDrag({
    // THE PANEL, reached through the body, because the top level's append
    // zone is in the FOOTER and the footer is the body's sibling.
    root: () => bodyRef.current?.parentElement ?? null,
    disabled: locked,
    onDrop: (nodeId, drop) => {
      if (drop.copy) actions.copyNodeTo(nodeId, drop.parentId, drop.index);
      else actions.moveNodeTo(nodeId, drop.parentId, drop.index);
    }
  });
  const panelProps = {
    // The panel's programmatic NAME. `group`, because the rows inside are
    // groups too, so the tree reads as a query rather than as a landmark.
    role: 'group',
    'aria-label': actions.labels.advancedFilter,
    // WHAT IS IN IT, on entry, for a reader who did not press the trigger.
    // The read-only half rides along: `aria-readonly` is illegal here.
    'aria-description': actions.readOnly
      ? `${actions.labels.countAnnouncement(ruleCount)} ${actions.labels.readOnly}`
      : actions.labels.countAnnouncement(ruleCount),
    'data-slot': 'filters-advanced',
    'data-readonly': actions.readOnly || void 0,
    // Capture, and on the PANEL, so portaled menus report too.
    onFocusCapture: () => {
      heldFocus.current = true;
    },
    onBlurCapture: (event) => {
      if (event.relatedTarget) heldFocus.current = false;
    }
  };
  const renderEmptyState = renderEmpty ?? panelRender.renderEmpty;
  const emptyState = renderEmptyState
    ? renderEmptyState({
        labels: actions.labels,
        readOnly: Boolean(actions.readOnly),
        mode,
        addFilter: addRow,
        addGroup
      })
    : null;
  const body = (
    <>
      {/* VISIBLE, not an ARIA attribute: `aria-readonly` is illegal on every
       role here, and dimmed controls owe the reader a reason. */}
      {actions.readOnly ? (
        <p
          data-slot='filters-readonly'
          className={cn('text-ui-muted-foreground text-xs', PANEL_GUTTER_CLASS)}
        >
          {actions.labels.readOnly}
        </p>
      ) : null}

      {query.rules.length > 0 ? (
        <div
          ref={bodyRef}
          data-slot='filters-advanced-body'
          className={cn(
            TRACK_CONTAINER_CLASS,
            'flex min-w-0 flex-col',
            FILTER_ROW_GAP_CLASS,
            PANEL_GUTTER_CLASS
          )}
          onKeyDown={onKeyDown}
        >
          <FilterReorderProvider value={reorderable}>
            <FilterDragContext.Provider value={reorderable ? dragProps : null}>
              <FilterIssueContext.Provider value={visibleIssueMap}>
                {query.rules.map((node, index) => (
                  <FilterAdvancedNode
                    key={node.id}
                    node={node}
                    position={{
                      index,
                      parentId: query.id,
                      combinator: query.combinator,
                      depth: 1
                    }}
                  />
                ))}
              </FilterIssueContext.Provider>
            </FilterDragContext.Provider>
          </FilterReorderProvider>
        </div>
      ) : /*
      THE EMPTY STATE, a real state and not a missing one: with no rules
      the body renders nothing, so the panel used to open as a footer
      floating in a blank popover. The HINT is withheld when the bar is
      locked, since it points at two disabled buttons.
    */
      // The CALLBACK's presence decides, not its result: a consumer returning
      // null wants a blank panel, and `??` would hand them the default back.
      renderEmptyState ? (
        emptyState
      ) : (
        <div
          data-slot='filters-advanced-empty'
          className={cn(
            'flex flex-col items-center justify-center gap-1 py-8 text-center',
            PANEL_GUTTER_CLASS
          )}
        >
          <span
            aria-hidden='true'
            className='bg-ui-muted text-ui-muted-foreground mb-1 flex size-9 items-center justify-center rounded-full [&_svg]:size-4'
          >
            <RegistryIcon lucide='ListFilterIcon' />
          </span>
          <p className='text-sm font-medium'>{actions.labels.builderEmpty}</p>
          {actions.readOnly ? null : (
            <p className='text-ui-muted-foreground text-xs'>
              {actions.labels.builderEmptyHint}
            </p>
          )}
        </div>
      )}

      {/* `shrink-0` on all three: a button clips its label rather than
       reflowing it, so Clear all read as "ear all filters". */}
      <div
        data-slot='filters-advanced-footer'
        data-drop-parent={query.id}
        data-drop-index={query.rules.length}
        className={cn(
          'relative flex flex-wrap items-center gap-2',
          PANEL_GUTTER_CLASS,
          /* FOUR PIXELS MORE than the gutter, which is what a row's action
         band spends after its kebab. */
          'pe-[calc(var(--filter-panel-pad)+4px)]',
          FOOTER_DROP_CLASS,
          /* The strip's BOX reaches the body's bottom edge and pads its
         content back down, so the append zone TILES with the last row.
         `pt-5` and not `pt-2`: the row above already grows 4px into this
         strip, so at `pt-2` the toolbar read as the last filter's tail. */
          query.rules.length > 0 && cn(FILTER_ROW_GAP_CANCEL_CLASS, 'pt-5')
        )}
      >
        <Button
          ref={addRowRef}
          variant='outline'
          size={sizes.button}
          className='shrink-0 font-normal'
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
          onClick={addRow}
        >
          <RegistryIcon lucide='PlusIcon' />
          {actions.labels.addCondition}
        </Button>

        <Button
          variant='outline'
          size={sizes.button}
          className='shrink-0 font-normal'
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
          onClick={addGroup}
        >
          <RegistryIcon lucide='FolderPlusIcon' />
          {actions.labels.addConditionGroup}
        </Button>

        {/* NO PANEL-LEVEL SUMMARY: a validator's no belongs on the cell. */}
        {ruleCount > 0 ? (
          <Button
            variant='ghost'
            size={sizes.button}
            className='text-ui-muted-foreground hover:text-ui-foreground ms-auto shrink-0'
            disabled={actions.disabled}
            {...filterReadOnlyProps(actions)}
            onClick={() => actions.clearQuery()}
          >
            {actions.labels.clearAll}
          </Button>
        ) : null}
      </div>

      {/* The `key` is what makes a REPEATED sentence audible: `aria-live`
       fires on a mutation and React writes nothing when the string is
       unchanged, so three presses mutated the region once. */}
      <div aria-live='polite' role='status' className='sr-only'>
        <span key={announcementSeq}>{announcement}</span>
      </div>
    </>
  );
  return (
    <div
      {...panelProps}
      style={{
        [PANEL_PAD_VAR]:
          mode === 'inline' ? PANEL_PAD_INLINE : PANEL_PAD_POPOVER
      }}
      className={cn(PANEL_CLASS, className)}
    >
      {body}
    </div>
  );
}
export function FiltersAdvanced({
  mode = 'popover',
  trigger,
  reorderable = false,
  align = 'start',
  className
}) {
  const actions = useFilterActions();
  const sizes = filterControlSizes(actions);
  const { ruleCount } = useFilterState();
  const [open, setOpen] = React.useState(false);
  if (mode === 'inline') {
    return (
      <FiltersAdvancedPanel
        mode='inline'
        reorderable={reorderable}
        className={className}
      />
    );
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* `actions.disabled` alone, and READ ONLY DELIBERATELY DOES NOT
       GATE IT: opening this panel is reading, not writing. */}
      <PopoverTrigger asChild disabled={actions.disabled}>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant='outline'
            size={sizes.button}
            aria-label={
              ruleCount > 0
                ? `${actions.labels.advancedFilter}, ${actions.labels.countAnnouncement(ruleCount)}`
                : void 0
            }
          >
            <RegistryIcon lucide='ListFilterIcon' />
            {actions.labels.advancedFilter}
            {ruleCount > 0 ? (
              <span
                aria-hidden='true'
                className='bg-ui-muted text-ui-muted-foreground rounded-sm px-1.5 text-xs tabular-nums'
              >
                {ruleCount}
              </span>
            ) : null}
          </Button>
        )}
      </PopoverTrigger>
      {/* Wide enough for a nested group to keep real words at depth three;
       the rows truncate rather than wrap. */}
      <PopoverContent
        align={align}
        aria-label={actions.labels.advancedFilter}
        className={cn('w-[42rem] max-w-[95vw] p-0', className)}
      >
        {/* `mode` defaults to "popover", which keeps the panel's padding. */}
        <FiltersAdvancedPanel reorderable={reorderable} />
      </PopoverContent>
    </Popover>
  );
}
