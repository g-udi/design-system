'use client';
import * as React from 'react';
import {
  Cascader,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus
} from '../../Cascader/parts/cascader-extended.jsx';
import { CascaderFooter } from '../../Cascader/parts/cascader-footer-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav
} from '../../Cascader/parts/cascader-nav-extended.jsx';
import { CascaderVirtualItems } from '../../Cascader/parts/cascader-virtual-extended.jsx';
import {
  filterControlSizes,
  filterReadOnlyProps,
  useFilterActions,
  useFilterFocusStore,
  useFilterState
} from './filters-context-extended.jsx';
import {
  FILTER_FIELD_PICKER_CLASS,
  getFilterField,
  getFilterFieldCount,
  joinFilterPath,
  splitFilterPath
} from './filters-lib-extended.jsx';
import { getDefaultFilterOperator } from './filters-operators-extended.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function toCascaderNodes(fields, parentPath = []) {
  return fields.map((field) => {
    const path = [...parentPath, field.id];
    const node = {
      value: joinFilterPath(path),
      label: field.label,
      icon: field.icon,
      description: field.description,
      keywords: field.keywords,
      disabled: field.disabled,
      data: field
    };
    if (field.fields?.length) {
      node.children = toCascaderNodes(field.fields, path);
      node.count = getFilterFieldCount(field);
    }
    return node;
  });
}
export function FilterFieldPicker({
  path,
  onPathChange,
  query,
  onQueryChange,
  onSelect,
  maxHeight = 260,
  labels: labelsProp,
  actions: actionItems
}) {
  const actions = useFilterActions();
  const items = React.useMemo(
    () => toCascaderNodes(actions.index.roots),
    [actions.index]
  );
  const cascaderLabels = React.useMemo(
    () => ({
      search: actions.labels.searchFields,
      back: actions.labels.back,
      empty: actions.labels.empty,
      pathSeparator: actions.labels.pathSeparator.trim() || '/',
      itemCount: actions.labels.itemCount,
      branchAffordance: actions.labels.branchAffordance,
      rootLevel: actions.labels.fieldsLabel,
      panelLabel: actions.labels.fieldsLabel,
      resultsAnnouncement: actions.labels.resultsAnnouncement,
      actionsLabel: actions.labels.actionsLabel,
      ...labelsProp
    }),
    [actions.labels, labelsProp]
  );
  return (
    <Cascader
      inline
      open
      onOpenChange={() => {}}
      items={items}
      searchScope='deep'
      indicator={false}
      path={path}
      onPathChange={onPathChange}
      inputValue={query}
      onInputValueChange={onQueryChange}
      value=''
      onValueChange={(value) => {
        const nextPath = splitFilterPath(value);
        const field = getFilterField(actions.index, nextPath);
        if (!field) return;
        onSelect(
          nextPath,
          getDefaultFilterOperator(field, actions.resolveOperators(field))
        );
      }}
      labels={cascaderLabels}
      actions={actionItems}
      maxHeight={maxHeight}
    >
      <CascaderPanel>
        <CascaderNav>
          <CascaderInput placeholder={actions.labels.searchFields} />
        </CascaderNav>
        <CascaderBreadcrumb />
        <CascaderEmpty />
        <CascaderList>
          {/* WINDOWED: the picker is where scale lives and nothing here pins.
     Below the threshold it renders what `CascaderItems` does. */}
          <CascaderVirtualItems />
        </CascaderList>
        <CascaderFooter />
        <CascaderStatus />
      </CascaderPanel>
    </Cascader>
  );
}
function FieldStep() {
  const actions = useFilterActions();
  const { draft } = useFilterState();
  return (
    <FilterFieldPicker
      path={draft?.cascaderPath ?? []}
      onPathChange={(next) =>
        actions.dispatchDraft({ type: 'setCascaderPath', path: next })
      }
      query={draft?.query ?? ''}
      onQueryChange={(query) =>
        actions.dispatchDraft({ type: 'setQuery', query })
      }
      onSelect={(path, defaultOperator) =>
        actions.dispatchDraft({ type: 'selectField', path, defaultOperator })
      }
    />
  );
}
export function FiltersBuilder({ trigger, className }) {
  const actions = useFilterActions();
  const sizes = filterControlSizes(actions);
  const { draft, ruleCount } = useFilterState();
  const focusStore = useFilterFocusStore();
  const open = draft !== null && draft.ruleId === null;
  const committing =
    draft !== null && draft.ruleId === null && draft.status === 'ready';
  const [instantExit, setInstantExit] = React.useState(false);
  if (committing && !instantExit) setInstantExit(true);
  else if (open && !committing && instantExit) setInstantExit(false);
  const compact = ruleCount > 0;
  const handoffRef = React.useRef(false);
  React.useEffect(() => {
    if (!open) return;
    handoffRef.current = false;
    return focusStore.subscribe(() => {
      if (focusStore.getSnapshot().autoOpen) handoffRef.current = true;
    });
  }, [focusStore, open]);
  const onCloseAutoFocus = (event) => {
    if (!handoffRef.current) return;
    handoffRef.current = false;
    event.preventDefault();
  };
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) actions.closeDraft();
        else actions.openCreate();
      }}
    >
      <PopoverTrigger
        asChild
        disabled={actions.disabled}
        {...filterReadOnlyProps(actions)}
      >
        {trigger ? (
          trigger
        ) : (
          <Button
            variant='outline'
            size={compact ? sizes.icon : sizes.button}
            aria-label={compact ? actions.labels.addFilter : void 0}
            className='transition-[color,background-color,border-color,box-shadow]'
          >
            {/* No filter-plus glyph in phosphor or remixicon. */}
            <RegistryIcon lucide='ListFilterPlusIcon' />
            {compact ? null : actions.labels.addFilter}
          </Button>
        )}
      </PopoverTrigger>
      {/* The default, then the root override, then this `className` last, so
     the specific wins. */}
      <PopoverContent
        align='start'
        onCloseAutoFocus={onCloseAutoFocus}
        className={cn(
          FILTER_FIELD_PICKER_CLASS,
          /* See `instantExit`. Both PROPERTIES (an `exit` animation AND a
         transition each paint over the successor) and both twins (Base UI
         `data-ending-style`, Radix `data-[state=closed]`); only one can
         match in a given build. The string stays identical on both sides
         because listing only the Base UI half left the radix twin fading
         a 224px card over its successor. */
          instantExit &&
            cn(
              'data-ending-style:animate-none data-ending-style:transition-none',
              'data-[state=closed]:animate-none data-[state=closed]:transition-none'
            ),
          actions.fieldPickerClassName,
          className
        )}
      >
        <FieldStep />
      </PopoverContent>
    </Popover>
  );
}
export { toCascaderNodes };
