export const CASCADER_LIST_HEIGHT_CLASS =
  'max-h-[min(var(--available-height,100vh),var(--cascader-max-height,24rem))]';
export const CASCADER_LIST_PAD_CLASS = '[--cascader-list-pad:6px]';
export const CASCADER_SCROLL_CLASS =
  'size-full min-h-0 **:data-[slot=scroll-area-viewport]:h-full **:data-[slot=scroll-area-viewport]:overscroll-contain **:data-[slot=scroll-area-viewport]:scroll-py-[max(var(--cascader-list-pad,4px),4px)]';
export const CASCADER_ROWS_CLASS = 'p-(--cascader-list-pad,4px) data-empty:p-0';

// Row geometry shared by items and footer actions.
export const ROW_INSET_CLASS = '[--cascader-row-inset:6px]';
export const ROW_FLUSH_CLASS =
  'ps-[var(--cascader-row-inset,8px)]! pe-[var(--cascader-row-inset,8px)]!';
export const ROW_THEME_CLASS =
  "data-highlighted:bg-ui-accent data-highlighted:text-ui-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-ui-accent-foreground [&_svg:not([class*='size-'])]:size-4 min-h-8 rounded-md py-1.5";
export const ROW_TEXT_CLASS = 'text-sm';
export const ROW_SHELL_CLASS = `${ROW_THEME_CLASS} relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${ROW_INSET_CLASS}`;
export const CASCADER_ACTION_CLASS = `${ROW_SHELL_CLASS} ${ROW_TEXT_CLASS} ${ROW_FLUSH_CLASS} hover:bg-ui-accent hover:text-ui-accent-foreground focus-visible:bg-ui-accent focus-visible:text-ui-accent-foreground cursor-pointer gap-2 transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50`;
