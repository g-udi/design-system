'use client';
import { cn } from '../../../utilities/cn/index.js';
import * as ResizablePrimitive from 'react-resizable-panels';
function ResizablePanelGroup({ className, ...props }) {
  return (
    <ResizablePrimitive.Group
      data-slot='resizable-panel-group'
      className={cn(
        'ds-part-resizable-panel-group flex h-full w-full aria-[orientation=vertical]:flex-col',
        className
      )}
      {...props}
    />
  );
}
function ResizablePanel({ ...props }) {
  return <ResizablePrimitive.Panel data-slot='resizable-panel' {...props} />;
}
function ResizableHandle({ withHandle, className, ...props }) {
  return (
    <ResizablePrimitive.Separator
      data-slot='resizable-handle'
      className={cn(
        'ds-part-resizable-handle relative flex w-px items-center justify-center bg-ui-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ui-primary focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className='ds-part-resizable-handle-icon z-10 flex shrink-0' />
      )}
    </ResizablePrimitive.Separator>
  );
}
export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
