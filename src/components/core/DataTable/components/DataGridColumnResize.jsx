'use client';
import { useIsomorphicLayoutEffect } from '../../../../hooks/state/use-isomorphic-layout-effect.js';
import { useEffect, useRef } from 'react';
import { useDataGrid } from '../DataGrid.jsx';
import { cn } from '../../../../utilities/cn/index.js';
function isDataGridTouchEvent(event) {
  return 'touches' in event;
}
function findTouchClientX(list, identifier) {
  for (let i = 0; i < list.length; i++) {
    const touch = list.item(i);
    if (touch && touch.identifier === identifier) return touch.clientX;
  }
  return void 0;
}
function getDataGridResizeEventClientX(event, touchIdentifier) {
  if (isDataGridTouchEvent(event)) {
    if (typeof touchIdentifier === 'number') {
      return (
        findTouchClientX(event.touches, touchIdentifier) ??
        findTouchClientX(event.changedTouches, touchIdentifier)
      );
    }
    return event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX;
  }
  return event.clientX;
}
function startDataGridColumnResizeOnEnd(event, header, table, live = false) {
  const column = table.getColumn(header.column.id);
  if (!column || !column.getCanResize()) return;
  const isTouchSession = isDataGridTouchEvent(event);
  if (isTouchSession && event.touches.length > 1) return;
  event.persist?.();
  const ownerDocument = event.currentTarget.ownerDocument;
  const ownerWindow = ownerDocument.defaultView;
  const previousBodyCursor = ownerDocument.body.style.cursor;
  const previousDocumentCursor = ownerDocument.documentElement.style.cursor;
  const startSize = header.getSize();
  const touchIdentifier = isTouchSession
    ? event.touches[0]?.identifier
    : void 0;
  const dragStartClientX = getDataGridResizeEventClientX(
    event,
    touchIdentifier
  );
  const headerCell = event.currentTarget.closest('th');
  const headerRect = headerCell?.getBoundingClientRect();
  const liveTableElement = live ? headerCell?.closest('table') : null;
  const resizeRtl =
    (table.options.columnResizeDirection === 'rtl') !==
    (column.getIsPinned() === 'end');
  const startOffset =
    headerRect &&
    Number.isFinite(resizeRtl ? headerRect.left : headerRect.right)
      ? resizeRtl
        ? headerRect.left
        : headerRect.right
      : dragStartClientX;
  if (typeof dragStartClientX !== 'number' || typeof startOffset !== 'number') {
    return;
  }
  ownerDocument.body.style.cursor = 'col-resize';
  ownerDocument.documentElement.style.cursor = 'col-resize';
  const columnSizingStart = header
    .getLeafHeaders()
    .map((leafHeader) => [leafHeader.column.id, leafHeader.column.getSize()]);
  const directionMultiplier = resizeRtl ? -1 : 1;
  let minDeltaPercentage = -0.999999;
  let maxDeltaPercentage = Number.POSITIVE_INFINITY;
  columnSizingStart.forEach(([columnId, headerSize]) => {
    if (headerSize <= 0) return;
    const leafColumn = table.getColumn(columnId);
    const minSize = leafColumn?.columnDef.minSize;
    const maxSize = leafColumn?.columnDef.maxSize;
    if (typeof minSize === 'number') {
      minDeltaPercentage = Math.max(
        minDeltaPercentage,
        minSize / headerSize - 1
      );
    }
    if (typeof maxSize === 'number' && Number.isFinite(maxSize)) {
      maxDeltaPercentage = Math.min(
        maxDeltaPercentage,
        maxSize / headerSize - 1
      );
    }
  });
  let lastClientX = dragStartClientX;
  let ended = false;
  const stopListeners = [];
  const updateOffset = (clientXPos, commit = false) => {
    if (typeof clientXPos !== 'number') return;
    lastClientX = clientXPos;
    const nextColumnSizing = {};
    const deltaPercentage = Math.min(
      Math.max(
        ((clientXPos - dragStartClientX) * directionMultiplier) / startSize,
        minDeltaPercentage
      ),
      maxDeltaPercentage
    );
    const deltaOffset = deltaPercentage * startSize;
    columnSizingStart.forEach(([columnId, headerSize]) => {
      nextColumnSizing[columnId] =
        Math.round(
          Math.max(headerSize + headerSize * deltaPercentage, 0) * 100
        ) / 100;
    });
    if (liveTableElement) {
      columnSizingStart.forEach(([columnId]) => {
        const nextSize = nextColumnSizing[columnId];
        if (typeof nextSize !== 'number') return;
        liveTableElement.style.setProperty(
          `--col-${columnId}-size`,
          String(nextSize)
        );
        liveTableElement.style.setProperty(
          `--header-${columnId}-size`,
          String(nextSize)
        );
      });
    } else {
      table.setColumnResizing((old) => ({
        ...old,
        startOffset,
        startSize,
        deltaOffset,
        deltaPercentage,
        columnSizingStart,
        isResizingColumn: column.id
      }));
    }
    if (commit) {
      table.setColumnSizing((old) => ({
        ...old,
        ...nextColumnSizing
      }));
    }
  };
  const endResize = (clientXPos, commit = true) => {
    if (ended) return;
    ended = true;
    stopListeners.forEach((stop) => stop());
    if (commit) updateOffset(clientXPos, true);
    else if (liveTableElement) {
      columnSizingStart.forEach(([columnId, size]) => {
        liveTableElement.style.setProperty(`--col-${columnId}-size`, String(size));
        liveTableElement.style.setProperty(`--header-${columnId}-size`, String(size));
      });
    }
    table.setColumnResizing((old) => ({
      ...old,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      columnSizingStart: []
    }));
    ownerDocument.body.style.cursor = previousBodyCursor;
    ownerDocument.documentElement.style.cursor = previousDocumentCursor;
  };
  const mouseMoveHandler = (moveEvent) => {
    updateOffset(moveEvent.clientX);
  };
  const mouseUpHandler = (upEvent) => {
    endResize(upEvent.clientX);
  };
  const touchMoveHandler = (moveEvent) => {
    if (moveEvent.cancelable) {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
    }
    updateOffset(getDataGridResizeEventClientX(moveEvent, touchIdentifier));
  };
  const touchEndHandler = (endEvent) => {
    const clientXPos =
      typeof touchIdentifier === 'number'
        ? findTouchClientX(endEvent.changedTouches, touchIdentifier)
        : getDataGridResizeEventClientX(endEvent);
    if (typeof clientXPos !== 'number') return;
    if (endEvent.cancelable) {
      endEvent.preventDefault();
      endEvent.stopPropagation();
    }
    endResize(clientXPos);
  };
  const touchCancelHandler = () => {
    endResize(lastClientX, false);
  };
  const windowBlurHandler = () => {
    endResize(lastClientX);
  };
  const passiveIfSupported = { passive: false };
  if (isTouchSession) {
    ownerDocument.addEventListener(
      'touchmove',
      touchMoveHandler,
      passiveIfSupported
    );
    ownerDocument.addEventListener(
      'touchend',
      touchEndHandler,
      passiveIfSupported
    );
    ownerDocument.addEventListener('touchcancel', touchCancelHandler);
    stopListeners.push(() => {
      ownerDocument.removeEventListener('touchmove', touchMoveHandler);
      ownerDocument.removeEventListener('touchend', touchEndHandler);
      ownerDocument.removeEventListener('touchcancel', touchCancelHandler);
    });
  } else {
    ownerDocument.addEventListener(
      'mousemove',
      mouseMoveHandler,
      passiveIfSupported
    );
    ownerDocument.addEventListener(
      'mouseup',
      mouseUpHandler,
      passiveIfSupported
    );
    stopListeners.push(() => {
      ownerDocument.removeEventListener('mousemove', mouseMoveHandler);
      ownerDocument.removeEventListener('mouseup', mouseUpHandler);
    });
  }
  if (ownerWindow) {
    ownerWindow.addEventListener('blur', windowBlurHandler);
    stopListeners.push(() =>
      ownerWindow.removeEventListener('blur', windowBlurHandler)
    );
  }
  table.setColumnResizing((old) => ({
    ...old,
    startOffset,
    startSize,
    deltaOffset: 0,
    deltaPercentage: 0,
    columnSizingStart,
    isResizingColumn: column.id
  }));
  return () => endResize(lastClientX, false);
}
const DATA_GRID_DEFAULT_COLUMN_RESIZE_MODE = 'onEnd';
function getDataGridColumnResizeMode(layoutMode, tableMode) {
  return layoutMode ?? tableMode ?? DATA_GRID_DEFAULT_COLUMN_RESIZE_MODE;
}
function DataGridTableHeadRowCellResize({ header }) {
  const { props, table } = useDataGrid();
  const { column } = header;
  const isPinned = column.getIsPinned();
  const isLastVisibleColumn =
    column.getIndex() ===
    header.getContext().table.getVisibleLeafColumns().length - 1;
  const isResizeModeOnEnd =
    getDataGridColumnResizeMode(
      props.tableLayout?.columnsResizeMode,
      table.options.columnResizeMode
    ) === 'onEnd';
  const stopResizeSessionRef = useRef(void 0);
  useEffect(() => {
    return () => {
      stopResizeSessionRef.current?.();
      stopResizeSessionRef.current = void 0;
    };
  }, []);
  const handleMouseDown = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    stopResizeSessionRef.current?.();
    stopResizeSessionRef.current = startDataGridColumnResizeOnEnd(
      event,
      header,
      table,
      !isResizeModeOnEnd
    );
  };
  const handleTouchStart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    stopResizeSessionRef.current?.();
    stopResizeSessionRef.current = startDataGridColumnResizeOnEnd(
      event,
      header,
      table,
      !isResizeModeOnEnd
    );
  };
  return (
    // A span, deliberately: consumers stretch end-aligned header CONTENT
    // with `[&>div]:w-full` on headerClassName, and that compiled child
    // selector (0,1,1) beats the handle's own w-5 (0,1,0) - a div handle
    // then covers the whole cell and swallows the menu click. Hardening
    // w-5 with ! was rejected: the tag change removes the fight instead
    // of escalating it.
    <span
      data-slot='data-grid-table-resize-handle'
      {...{
        onDoubleClick: () => column.resetSize(),
        onMouseDown: handleMouseDown,
        onTouchStart: handleTouchStart,
        className: cn(
          'absolute top-0 h-full cursor-col-resize touch-none select-none z-10 flex',
          isPinned === 'end'
            ? cn(
                // An end-pinned column grows from its START edge (its end is
                // anchored), so the handle lives there, inside the sticky
                // cell.
                'start-0 w-5 justify-start',
                props.tableLayout?.columnsPinnable
                  ? 'before:hidden'
                  : 'before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-ui-border'
              )
            : isLastVisibleColumn
              ? 'end-0 w-5 justify-end before:hidden'
              : isPinned
                ? cn(
                    // A pinned column is sticky, so the handle sits inside the
                    // cell instead of straddling the boundary, where the next
                    // sticky cell would paint over it.
                    'end-0 w-5 justify-end',
                    // With the pin affordance on, the pinned edge already draws
                    // its own separator and a resize line would double it. But
                    // pinning is also usable purely as an ordering lock, with no
                    // affordance and no separator -- and there this line is the
                    // only thing marking the edge, so hiding it left a resizable
                    // column showing a resize cursor and no indicator at all.
                    props.tableLayout?.columnsPinnable
                      ? 'before:hidden'
                      : 'before:absolute before:inset-y-0 before:end-0 before:w-px before:bg-ui-border'
                  )
                : cn(
                    '-end-2 w-5 justify-center',
                    // With cell borders on, the th border-e already marks every
                    // boundary and this always-on line would double it; the wide
                    // hit area and resize cursor stay.
                    props.tableLayout?.cellBorder
                      ? 'before:hidden'
                      : 'before:absolute before:inset-y-0 before:w-px before:-translate-x-px before:bg-ui-border'
                  ),
          column.getIsResizing() &&
            (isResizeModeOnEnd
              ? 'opacity-100'
              : isLastVisibleColumn
                ? 'before:absolute before:end-0 before:block before:inset-y-0 before:w-0.5 before:bg-ui-primary opacity-100'
                : 'before:block before:bg-ui-primary before:w-0.5 opacity-100')
        )
      }}
    />
  );
}
function DataGridTableResizeIndicator({ viewportNodeRef }) {
  const { props, table } = useDataGrid();
  const indicatorRef = useRef(null);
  const indicatorHeadRef = useRef(null);
  const headerHeightCacheRef = useRef({ key: false, value: 0 });
  const columnResizing = table.state.columnResizing;
  const resizingColumnId = columnResizing.isResizingColumn;
  const resizeMode = getDataGridColumnResizeMode(
    props.tableLayout?.columnsResizeMode,
    table.options.columnResizeMode
  );
  const isActive = !!(
    props.tableLayout?.columnsResizable &&
    resizeMode === 'onEnd' &&
    resizingColumnId
  );
  useIsomorphicLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const indicatorHead = indicatorHeadRef.current;
    const viewportElement = viewportNodeRef.current;
    if (!isActive || !indicator || !indicatorHead || !resizingColumnId) return;
    const resizingHeader = table
      .getFlatHeaders()
      .find(
        (header) =>
          header.column.id === resizingColumnId ||
          header.id === resizingColumnId
      );
    if (!resizingHeader) return;
    const directionMultiplier =
      (table.options.columnResizeDirection === 'rtl') !==
      (resizingHeader.column.getIsPinned() === 'end')
        ? -1
        : 1;
    const deltaOffset = (columnResizing.deltaOffset ?? 0) * directionMultiplier;
    if (headerHeightCacheRef.current.key !== resizingColumnId) {
      headerHeightCacheRef.current = {
        key: resizingColumnId,
        value:
          viewportElement
            ?.querySelector('[data-slot="data-grid-table"] thead')
            ?.getBoundingClientRect().height ?? 0
      };
    }
    const headerHeight = headerHeightCacheRef.current.value;
    const viewportRoot =
      viewportElement ??
      indicator.closest('[data-slot="data-grid-table-viewport"]');
    const headerCellElement = viewportRoot?.querySelector(
      `thead th[data-col-id="${CSS.escape(resizingHeader.column.id)}"]`
    );
    let indicatorLeft;
    if (headerCellElement && viewportRoot) {
      const anchorRect = headerCellElement.getBoundingClientRect();
      const edgeClientX =
        (table.options.columnResizeDirection === 'rtl') !==
        (resizingHeader.column.getIsPinned() === 'end')
          ? anchorRect.left
          : anchorRect.right;
      indicatorLeft = edgeClientX - viewportRoot.getBoundingClientRect().left;
    } else if (
      typeof columnResizing.startOffset === 'number' &&
      viewportElement
    ) {
      indicatorLeft =
        columnResizing.startOffset -
        viewportElement.getBoundingClientRect().left;
    } else {
      indicatorLeft = resizingHeader.getStart() + resizingHeader.getSize();
    }
    indicator.style.left = `${indicatorLeft}px`;
    indicator.style.transform = `translateX(${deltaOffset}px)`;
    indicatorHead.style.height = `${Math.max(headerHeight, 6)}px`;
  });
  if (!isActive) return null;
  return (
    <div
      ref={indicatorRef}
      aria-hidden='true'
      data-slot='data-grid-table-resize-indicator'
      className='pointer-events-none absolute inset-y-0 z-50'
    >
      <div className='bg-ui-primary/85 absolute inset-y-0 left-0 w-px -translate-x-1/2' />
      <div
        ref={indicatorHeadRef}
        className='bg-ui-primary rounded-b-sm absolute top-0 left-0 -translate-x-1/2 shadow-xs'
        style={{ width: 5 }}
      />
    </div>
  );
}
export { DataGridTableHeadRowCellResize, DataGridTableResizeIndicator };
