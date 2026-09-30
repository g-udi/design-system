// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { createContext, Fragment, useContext } from 'react';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const TreeContext = createContext({
  indent: 20,
  currentItem: void 0,
  tree: void 0,
  toggleIconType: 'plus-minus'
});
function useTreeContext() {
  return useContext(TreeContext);
}
function Tree({
  indent = 20,
  tree,
  className,
  toggleIconType = 'chevron',
  asChild = false,
  ...props
}) {
  const containerProps =
    tree && typeof tree.getContainerProps === 'function'
      ? tree.getContainerProps()
      : {};
  const mergedProps = { ...props, ...containerProps };
  const { style: propStyle, ...otherProps } = mergedProps;
  const mergedStyle = {
    ...propStyle,
    '--tree-indent': `${indent}px`
  };
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <TreeContext.Provider value={{ indent, tree, toggleIconType }}>
      <Comp
        data-slot='tree'
        style={mergedStyle}
        className={cn('flex flex-col', className)}
        {...otherProps}
      />
    </TreeContext.Provider>
  );
}
function TreeItem({ item, className, asChild = false, children, ...props }) {
  const parentContext = useTreeContext();
  const { indent } = parentContext;
  const itemProps = typeof item.getProps === 'function' ? item.getProps() : {};
  const mergedProps = { ...props, children, ...itemProps };
  const { style: propStyle, ...otherProps } = mergedProps;
  const mergedStyle = {
    ...propStyle,
    '--tree-padding': `${item.getItemMeta().level * indent}px`
  };
  const defaultProps = {
    'data-slot': 'tree-item',
    style: mergedStyle,
    className: cn(
      'z-10 ps-(--tree-padding) outline-hidden select-none not-last:pb-0.5 focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    ),
    'data-focus':
      typeof item.isFocused === 'function' ? item.isFocused() || false : void 0,
    'data-folder':
      typeof item.isFolder === 'function' ? item.isFolder() || false : void 0,
    'data-selected':
      typeof item.isSelected === 'function'
        ? item.isSelected() || false
        : void 0,
    'data-drag-target':
      typeof item.isDragTarget === 'function'
        ? item.isDragTarget() || false
        : void 0,
    'data-search-match':
      typeof item.isMatchingSearch === 'function'
        ? item.isMatchingSearch() || false
        : void 0,
    'aria-expanded': item.isExpanded()
  };
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <TreeContext.Provider value={{ ...parentContext, currentItem: item }}>
      <Comp {...defaultProps} {...otherProps}>
        {children}
      </Comp>
    </TreeContext.Provider>
  );
}
function TreeItemLabel({
  item: propItem,
  children,
  className,
  asChild = false,
  ...props
}) {
  const { currentItem, toggleIconType } = useTreeContext();
  const item = propItem || currentItem;
  if (!item) {
    console.warn('TreeItemLabel: No item provided via props or context');
    return null;
  }
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot='tree-item-label'
      className={cn(
        'in-focus-visible:ring-ui-ring/50 bg-ui-background hover:bg-ui-accent in-data-[selected=true]:bg-ui-accent in-data-[selected=true]:text-ui-accent-foreground in-data-[drag-target=true]:bg-ui-accent flex items-center gap-1 transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] in-data-[search-match=true]:bg-blue-50! [&_svg]:pointer-events-none [&_svg]:shrink-0',
        'rounded-md',
        'py-1.5',
        'px-2',
        'text-sm',
        className
      )}
      {...props}
    >
      <Fragment>
        {item.isFolder() &&
          (toggleIconType === 'plus-minus' ? (
            item.isExpanded() ? (
              <RegistryIcon
                lucide='MinusIcon'
                className='text-ui-muted-foreground size-3.5'
                stroke='currentColor'
                strokeWidth='1'
              />
            ) : (
              <RegistryIcon
                lucide='PlusIcon'
                className='text-ui-muted-foreground size-3.5'
                stroke='currentColor'
                strokeWidth='1'
              />
            )
          ) : (
            <RegistryIcon
              lucide='ChevronDownIcon'
              className='text-ui-muted-foreground size-4 in-aria-[expanded=false]:-rotate-90'
            />
          ))}
        {children ||
          (typeof item.getItemName === 'function' ? item.getItemName() : null)}
      </Fragment>
    </Comp>
  );
}
function TreeDragLine({ className, ...props }) {
  const { tree } = useTreeContext();
  if (!tree || typeof tree.getDragLineStyle !== 'function') {
    console.warn(
      'TreeDragLine: No tree provided via context or tree does not have getDragLineStyle method'
    );
    return null;
  }
  const dragLine = tree.getDragLineStyle();
  return (
    <div
      style={dragLine}
      className={cn(
        'bg-ui-primary before:bg-ui-background before:border-ui-primary absolute z-30 -mt-px h-0.5 w-[unset] before:absolute before:-top-[3px] before:left-0 before:size-2 before:border-2',
        'before:rounded-full',
        className
      )}
      {...props}
    />
  );
}
export { Tree, TreeItem, TreeItemLabel, TreeDragLine };
