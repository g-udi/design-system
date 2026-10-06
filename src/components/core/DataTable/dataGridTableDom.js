function assignRef(ref, value) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  ref.current = value;
}
function getDataGridScrollAreaViewport(node) {
  const scrollViewport = node.closest('[data-slot="scroll-area-viewport"]');
  if (!scrollViewport) return null;
  const gridContainer = node.closest('[data-slot="data-grid"]');
  if (gridContainer && !gridContainer.contains(scrollViewport)) return null;
  return scrollViewport;
}
function isDataGridCellInteractiveTarget(target) {
  return (
    target instanceof Element &&
    target.closest(
      'button, a, input, select, textarea, [contenteditable], [role="checkbox"], [data-cell-interactive], [data-slot="data-grid-table-row-expand"], [data-slot="data-grid-cell-fill-handle"]'
    ) != null
  );
}
export { getDataGridScrollAreaViewport, assignRef, isDataGridCellInteractiveTarget };
