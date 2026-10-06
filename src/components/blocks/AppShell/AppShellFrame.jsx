'use client';
import * as React from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { useElementSize } from '../../../hooks/layout/use-element-size.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';

/** Frame widths below this many pixels use the phone layout: the sidebar becomes a sheet. */
const FRAME_COMPACT_BELOW = 640;

const AppShellFrameContext = React.createContext(null);

/**
 * The surrounding frame, or null outside one. Sidebar parts read it to stay inside the window: the
 * desktop rail is positioned against the frame, the phone sheet portals into it, and `compact` follows
 * the frame's width (undefined until it has been measured, so server markup matches the viewport rule).
 */
function useAppShellFrame() {
  return React.useContext(AppShellFrameContext);
}

/**
 * Presents a shell as an app window inside any container: a bordered frame on the shared card radius
 * with a fixed height (`height`, 48rem by default and 40rem on phones), clipped overflow and internal
 * scrolling. Fixed-position overlays that belong to the shell (the phone sidebar sheet) stay inside it,
 * and the shell switches to its phone layout when the frame, not the viewport, is narrower than
 * `compactBelow`. `surface='muted'` (default) suits inset panels; `surface='default'` suits floating
 * sidebars on a plain page.
 */
function AppShellFrame({
  height,
  compactBelow = FRAME_COMPACT_BELOW,
  surface = 'muted',
  label,
  className,
  style,
  children,
  ...props
}) {
  const [element, setElement] = React.useState(null);
  const [sizeRef, { width }] = useElementSize();
  const ref = useMergedRefs(setElement, sizeRef);
  const compact = width > 0 ? width < compactBelow : undefined;
  const value = React.useMemo(() => ({ container: element, compact, width }), [element, compact, width]);
  return (
    <AppShellFrameContext.Provider value={value}>
      <div
        ref={ref}
        role={label ? 'region' : undefined}
        aria-label={label}
        data-slot='app-shell-frame'
        data-surface={surface}
        data-compact={compact ? 'true' : undefined}
        className={cn('ds-app-shell-frame', className)}
        style={height ? { '--ds-app-shell-frame-height': typeof height === 'number' ? `${height}px` : height, ...style } : style}
        {...props}
      >
        {children}
      </div>
    </AppShellFrameContext.Provider>
  );
}

/**
 * The main landmark of a framed shell. `inset` (default) draws it as a bordered panel on the card radius
 * set into the frame's muted surface; `inset={false}` fills the space beside a floating sidebar. The
 * panel scrolls on its own and is a size container, so placeholder grids respond to the panel width.
 */
function AppShellPanel({ inset = true, className, ...props }) {
  return (
    <main
      data-slot='app-shell-panel'
      data-inset={inset ? 'true' : undefined}
      className={cn('ds-app-shell-panel @container', className)}
      {...props}
    />
  );
}

/** The panel's top bar: trigger, breadcrumb and actions in one row that stays put while the panel scrolls. */
function AppShellHeader({ bordered = false, className, ...props }) {
  return (
    <header
      data-slot='app-shell-header'
      data-bordered={bordered ? 'true' : undefined}
      className={cn('ds-app-shell-header', className)}
      {...props}
    />
  );
}

/** The panel body below the header. */
function AppShellBody({ className, ...props }) {
  return <div data-slot='app-shell-body' className={cn('ds-app-shell-body', className)} {...props} />;
}

export { AppShellBody, AppShellFrame, AppShellHeader, AppShellPanel, FRAME_COMPACT_BELOW, useAppShellFrame };
