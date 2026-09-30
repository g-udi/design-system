// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
import { CascaderColumnPanel } from './cascader-columns-extended.jsx';
import {
  useCascaderActions,
  useCascaderHighlight,
  useCascaderState
} from './cascader-context-extended.jsx';
import {
  CascaderItem,
  CascaderItems,
  getCascaderMoreProps
} from './cascader-item-extended.jsx';
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
export function useCascaderVirtualizer({
  count,
  getScrollElement,
  estimateSize = 32,
  overscan = 8,
  getItemKey,
  activeIndex = -1
}) {
  const active = activeIndex >= 0 && activeIndex < count ? activeIndex : -1;
  const rangeExtractor = React.useCallback(
    (range) => {
      const indices = new Set(defaultRangeExtractor(range));
      if (active !== -1) indices.add(active);
      return Array.from(indices).sort((a, b) => a - b);
    },
    [active]
  );
  const measureEstimate = React.useCallback(() => estimateSize, [estimateSize]);
  const virtualizer = useVirtualizer({
    count,
    getScrollElement,
    estimateSize: measureEstimate,
    overscan,
    getItemKey,
    rangeExtractor
  });
  React.useEffect(() => {
    if (active === -1) return;
    virtualizer.scrollToIndex(active, { align: 'auto' });
  }, [active, count, virtualizer]);
  return virtualizer;
}
const NO_GUTTER = { block: 0, inline: 0 };
function useCascaderVirtualGutter(contentElement) {
  const [gutter, setGutter] = React.useState(NO_GUTTER);
  React.useLayoutEffect(() => {
    if (!contentElement) return;
    const styles = getComputedStyle(contentElement);
    const block = Number.parseFloat(styles.paddingTop) || 0;
    const inline =
      Number.parseFloat(styles.paddingInlineStart || styles.paddingLeft) || 0;
    setGutter((previous) =>
      previous.block === block && previous.inline === inline
        ? previous
        : { block, inline }
    );
  }, [contentElement]);
  return gutter;
}
function cascaderVirtualRowStyle(start, gutter) {
  return {
    position: 'absolute',
    top: 0,
    insetInlineStart: gutter.inline,
    insetInlineEnd: gutter.inline,
    transform: `translateY(${start + gutter.block}px)`
  };
}
function cascaderScrollElement(content) {
  if (!content) return null;
  return content.closest('[data-slot="scroll-area-viewport"]') ?? content;
}
function CascaderVirtualSpacer({ height, onContentElement }) {
  return (
    <div
      ref={(node) => onContentElement(node?.parentElement ?? null)}
      role='presentation'
      data-slot='cascader-virtual-spacer'
      style={{ height }}
    />
  );
}
function CascaderVirtualItems(props) {
  const { virtualized, registerVirtualRenderer } = useCascaderActions();
  React.useLayoutEffect(
    () => registerVirtualRenderer(),
    [registerVirtualRenderer]
  );
  if (!virtualized) return <CascaderItems />;
  return <CascaderVirtualRows {...props} />;
}
function CascaderVirtualRows({ estimateSize, overscan }) {
  'use no memo';
  const {
    estimateRowSize,
    overscan: rootOverscan,
    mode,
    isBranch,
    isSelectable,
    isSelected,
    isIndeterminate
  } = useCascaderActions();
  const { renderedItems, treeRows, deepResults, loadStates } =
    useCascaderState();
  const highlight = useCascaderHighlight();
  const [contentElement, setContentElement] = React.useState(null);
  const gutter = useCascaderVirtualGutter(contentElement);
  const tree = mode === 'tree';
  const count = tree ? treeRows.length : renderedItems.length;
  const showPath = !tree && deepResults !== null;
  const getItemKey = React.useCallback(
    (index) =>
      (tree ? treeRows[index]?.node.value : renderedItems[index]?.value) ??
      index,
    [tree, treeRows, renderedItems]
  );
  const virtualizer = useCascaderVirtualizer({
    count,
    getScrollElement: () => cascaderScrollElement(contentElement),
    estimateSize: estimateSize ?? estimateRowSize,
    overscan: overscan ?? rootOverscan,
    getItemKey,
    activeIndex: highlight.index
  });
  return (
    <>
      <CascaderVirtualSpacer
        height={virtualizer.getTotalSize()}
        onContentElement={setContentElement}
      />
      {virtualizer.getVirtualItems().map((row) => {
        const flat = tree ? treeRows[row.index] : void 0;
        const node = tree ? flat?.node : renderedItems[row.index];
        if (!node) return null;
        return (
          <CascaderItem
            key={row.key}
            ref={virtualizer.measureElement}
            data-index={row.index}
            style={cascaderVirtualRowStyle(row.start, gutter)}
            node={node}
            index={row.index}
            depth={flat?.depth}
            expanded={flat?.expanded}
            branch={flat ? flat.branch : isBranch(node)}
            selectable={isSelectable(node)}
            selected={isSelected(node)}
            indeterminate={isIndeterminate(node)}
            {...getCascaderMoreProps(node, loadStates)}
            showPath={showPath}
            aria-setsize={flat ? flat.setSize : count}
            aria-posinset={flat ? flat.posInSet : row.index + 1}
          />
        );
      })}
    </>
  );
}
function CascaderVirtualColumn({ column, estimateSize, overscan }) {
  const {
    virtualized,
    registerVirtualRenderer,
    virtualize,
    virtualizeThreshold
  } = useCascaderActions();
  React.useLayoutEffect(
    () => registerVirtualRenderer(),
    [registerVirtualRenderer]
  );
  const windowed = column.active
    ? virtualized
    : (virtualize ?? column.items.length >= virtualizeThreshold);
  if (!windowed) return <CascaderColumnPanel column={column} />;
  return (
    <CascaderColumnPanel column={column} virtualized>
      {column.active ? (
        <CascaderVirtualActiveColumnRows
          column={column}
          estimateSize={estimateSize}
          overscan={overscan}
        />
      ) : (
        <CascaderVirtualColumnRows
          column={column}
          estimateSize={estimateSize}
          overscan={overscan}
          activeIndex={-1}
        />
      )}
    </CascaderColumnPanel>
  );
}
function CascaderVirtualActiveColumnRows(props) {
  const highlight = useCascaderHighlight();
  return <CascaderVirtualColumnRows {...props} activeIndex={highlight.index} />;
}
function CascaderVirtualColumnRows({
  column,
  estimateSize,
  overscan,
  activeIndex
}) {
  'use no memo';
  const {
    estimateRowSize,
    overscan: rootOverscan,
    baseId,
    isBranch,
    isSelectable,
    isSelected,
    isIndeterminate
  } = useCascaderActions();
  const { loadStates } = useCascaderState();
  const [contentElement, setContentElement] = React.useState(null);
  const gutter = useCascaderVirtualGutter(contentElement);
  const items = column.items;
  const getItemKey = React.useCallback(
    (index) => items[index]?.value ?? index,
    [items]
  );
  const virtualizer = useCascaderVirtualizer({
    count: items.length,
    getScrollElement: () => cascaderScrollElement(contentElement),
    estimateSize: estimateSize ?? estimateRowSize,
    overscan: overscan ?? rootOverscan,
    getItemKey,
    activeIndex
  });
  return (
    <>
      <CascaderVirtualSpacer
        height={virtualizer.getTotalSize()}
        onContentElement={setContentElement}
      />
      {virtualizer.getVirtualItems().map((row) => {
        const node = items[row.index];
        if (!node) return null;
        const open = node.value === column.activeValue;
        return (
          <CascaderItem
            key={row.key}
            ref={virtualizer.measureElement}
            data-index={row.index}
            style={cascaderVirtualRowStyle(row.start, gutter)}
            node={node}
            as={column.active ? 'option' : 'button'}
            depth={column.depth}
            branch={isBranch(node)}
            selectable={isSelectable(node)}
            selected={isSelected(node)}
            indeterminate={isIndeterminate(node)}
            {...getCascaderMoreProps(node, loadStates)}
            data-open={open || void 0}
            className={
              open ? 'bg-ui-accent/60 text-ui-accent-foreground' : void 0
            }
            {...(column.active
              ? {
                  index: row.index,
                  'aria-setsize': items.length,
                  'aria-posinset': row.index + 1
                }
              : null)}
            {...(!column.active && open
              ? {
                  'aria-expanded': true,
                  'aria-controls': `${baseId}-column-${column.depth + 1}`
                }
              : null)}
          />
        );
      })}
    </>
  );
}
export { CascaderVirtualColumn, CascaderVirtualItems };
