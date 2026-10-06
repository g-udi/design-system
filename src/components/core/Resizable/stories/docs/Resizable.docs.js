import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Resizable": {
    ...definition('Resizable panes with accessible separators and bounded panel sizes.', [p('ResizablePanelGroup.orientation', 'horizontal | vertical', 'Required', 'Direction in which panels are arranged.'), p('ResizablePanelGroup.onLayoutChanged', 'function', '—', 'Observe committed panel sizes.'), p('ResizablePanel.defaultSize / minSize / maxSize', 'number | string', '—', 'Initial size and bounds accepted by react-resizable-panels.'), p('ResizablePanel.collapsible', 'boolean', 'false', 'Allow a panel to collapse.'), p('ResizableHandle.withHandle', 'boolean', 'false', 'Show a visible grip.'), children, className], 'Separators support keyboard resizing. Keep minimum sizes large enough for panel content and retain a way to restore collapsed panes.'),
    usage: "import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@gaudi/design-system/core/Resizable';\n\n<ResizablePanelGroup orientation='horizontal'>\n  <ResizablePanel defaultSize='30%'>{navigation}</ResizablePanel>\n  <ResizableHandle aria-label='Resize navigation' />\n  <ResizablePanel>{content}</ResizablePanel>\n</ResizablePanelGroup>"
  }
};
