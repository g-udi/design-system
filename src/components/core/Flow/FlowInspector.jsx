'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '../Banner/Alert.jsx';
import { default as Button } from '../Button/index.js';
import { default as Icon } from '../Icon/index.js';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../Sheet/index.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs/index.js';
import { cn } from '../../../utilities/cn/index.js';
import { FlowStatus } from './FlowNode.jsx';
import { useElementSize } from '../../../hooks/layout/use-element-size.js';
import { DEFAULT_FLOW_INSPECTOR_LABELS } from './flowModel.js';

const calloutVariants = { info: 'info', success: 'success', warning: 'warning', danger: 'destructive', destructive: 'destructive' };

/**
 * A rich side panel for the selected node, rendered as a child of `Flow`. It floats in
 * from the right over the graph, inside the canvas, and becomes a Sheet when the canvas
 * is narrower than `breakpoint` (768px). The header shows the node's `icon`, `title`
 * and run `status`; `tabs` hold the sections (for example Settings and Wiring); a
 * `callout` explains the node's state above the footer; and the footer offers Cancel and
 * Save, with Save disabled until `dirty`. Focus moves into the panel when it opens and
 * returns to the node (`nodeId`) when it closes; Escape closes it.
 */
export function FlowInspector({
  open,
  onOpenChange,
  nodeId,
  title,
  icon,
  status,
  statusLabel,
  description,
  tabs = [],
  defaultTab,
  callout,
  dirty = false,
  onSave,
  onCancel,
  footer,
  labels: custom,
  breakpoint = 768,
  className,
  children
}) {
  const labels = { ...DEFAULT_FLOW_INSPECTOR_LABELS, ...custom };
  const sentinel = useRef(null);
  const panel = useRef(null);
  const [measureCanvas, canvasSize] = useElementSize({ initialSize: { width: breakpoint, height: 0 } });
  const attachAnchor = useCallback((node) => {
    sentinel.current = node;
    measureCanvas(node?.closest('.ds-flow') ?? null);
  }, [measureCanvas]);
  const wide = canvasSize.width >= breakpoint;
  const titleId = useId();
  const [tab, setTab] = useState(defaultTab ?? tabs[0]?.value);
  const activeTab = tabs.find(item => item.value === tab)?.value
    ?? tabs.find(item => item.value === defaultTab)?.value
    ?? tabs[0]?.value;

  // Back to the node that opened the panel, so keyboard users keep their place on the canvas.
  const returnFocus = () => {
    if (!nodeId) return;
    const canvas = sentinel.current?.closest('.ds-flow');
    const node = canvas?.querySelector(`.react-flow__node[data-id="${CSS.escape(nodeId)}"]`);
    window.requestAnimationFrame(() => node?.focus({ preventScroll: true }));
  };
  const close = () => {
    onOpenChange?.(false);
    returnFocus();
  };
  const cancel = () => {
    onCancel?.();
    close();
  };

  useEffect(() => {
    if (open && wide) panel.current?.focus({ preventScroll: true });
  }, [open, wide, nodeId]);

  // Only the title names the dialog; the icon and status badge sit beside it.
  const header = (Title) => (
    <div className='flex min-w-0 items-center gap-2'>
      {icon && <span aria-hidden='true' className='ds-flow-inspector-icon'>{typeof icon === 'string' ? <Icon name={icon} decorative size='sm' /> : icon}</span>}
      {/* The sheet's title keeps the id Radix wires up; the floating panel labels itself. */}
      <Title {...(Title === 'span' ? { id: titleId } : {})} className='truncate text-sm font-semibold'>{title}</Title>
      {status && <FlowStatus status={status} label={statusLabel} className='shrink-0' />}
    </div>
  );
  const body = (
    <>
      {tabs.length > 0 && (
        <Tabs value={activeTab} onValueChange={setTab} className='ds-flow-inspector-tabs'>
          <TabsList variant='underline' aria-label={labels.tabs} className='px-4'>
            {tabs.map((item) => <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>)}
          </TabsList>
          {tabs.map((item) => (
            <TabsContent key={item.value} value={item.value} className='ds-flow-inspector-body'>
              {item.content}
            </TabsContent>
          ))}
        </Tabs>
      )}
      {children && <div className='ds-flow-inspector-body'>{children}</div>}
      {callout && (
        <div className='px-4 pb-3'>
          <Alert variant={calloutVariants[callout.tone] || 'default'}>
            {callout.icon && <Icon name={callout.icon} decorative />}
            <AlertTitle>{callout.title}</AlertTitle>
            {callout.description && <AlertDescription>{callout.description}</AlertDescription>}
            {callout.action && <AlertAction>{callout.action}</AlertAction>}
          </Alert>
        </div>
      )}
    </>
  );
  const actions = footer ?? (
    <>
      <Button variant='outline' tone='neutral' className='flex-1' onClick={cancel}>{labels.cancel}</Button>
      <Button className='flex-1' disabled={!dirty} onClick={() => onSave?.()}>{labels.save}</Button>
    </>
  );

  return (
    <>
      <span ref={attachAnchor} hidden data-slot='flow-inspector-anchor' data-wide={wide || undefined} />
      {wide ? (
        open && (
          <div
            ref={panel}
            role='dialog'
            aria-modal='false'
            aria-labelledby={titleId}
            tabIndex={-1}
            data-slot='flow-inspector'
            className={cn('ds-flow-inspector nodrag nopan nowheel', className)}
            onKeyDown={(event) => {
              if (event.key !== 'Escape' || event.defaultPrevented) return;
              event.stopPropagation();
              close();
            }}
          >
            <div className='ds-flow-inspector-header'>
              {header('span')}
              <Button size='icon-sm' variant='ghost' tone='neutral' className='ms-auto shrink-0' aria-label={labels.close} onClick={close}>
                <Icon name='X' decorative />
              </Button>
            </div>
            {description && <p className='text-text-muted px-4 pt-2 text-xs'>{description}</p>}
            <div className='ds-flow-inspector-scroll'>{body}</div>
            <div className='ds-flow-inspector-footer'>{actions}</div>
          </div>
        )
      ) : (
        <Sheet open={open} onOpenChange={(next) => (next ? onOpenChange?.(true) : close())}>
          <SheetContent
            side='right'
            className='ds-flow-inspector-sheet gap-0'
            onCloseAutoFocus={(event) => {
              // The sheet had no trigger; focus goes back to the node instead.
              event.preventDefault();
              returnFocus();
            }}
          >
            {/* Room on the end for the sheet's own close button. */}
            <SheetHeader className='border-b pe-12'>
              {header(SheetTitle)}
              <SheetDescription className={description ? undefined : 'sr-only'}>{description || title}</SheetDescription>
            </SheetHeader>
            <div className='ds-flow-inspector-scroll'>{body}</div>
            <SheetFooter className='flex-row border-t'>{actions}</SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
