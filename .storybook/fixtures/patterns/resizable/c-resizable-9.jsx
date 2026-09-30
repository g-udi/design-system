'use client';
import { useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '../../../../src/components/core/Resizable/parts/resizable.jsx';

// An editor workspace: three columns, the middle one split into editor and terminal.
// String sizes are percentages; onLayoutChange reports each panel size by id.
function Pane({ label, size }) {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-1 p-3 text-center'>
      <span className='text-sm font-semibold'>{label}</span>
      <span className='text-xs tabular-nums text-ui-muted-foreground'>{Math.round(size)}%</span>
    </div>
  );
}

export function Pattern() {
  const [columns, setColumns] = useState({ files: 25, main: 50, preview: 25 });
  const [rows, setRows] = useState({ editor: 70, terminal: 30 });
  return (
    <div className='mx-auto w-full max-w-2xl'>
      <ResizablePanelGroup
        orientation='horizontal'
        className='min-h-72 rounded-2xl border border-ui-border'
        onLayoutChange={setColumns}
      >
        <ResizablePanel id='files' defaultSize='25%' minSize='15%'>
          <Pane label='Files' size={columns.files ?? 25} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id='main' defaultSize='50%' minSize='30%'>
          <ResizablePanelGroup orientation='vertical' onLayoutChange={setRows}>
            <ResizablePanel id='editor' defaultSize='70%' minSize='30%'>
              <Pane label='Editor' size={rows.editor ?? 70} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel id='terminal' defaultSize='30%' minSize='20%'>
              <Pane label='Terminal' size={rows.terminal ?? 30} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id='preview' defaultSize='25%' minSize='15%'>
          <Pane label='Preview' size={columns.preview ?? 25} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
