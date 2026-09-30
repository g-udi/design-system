'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '../../../../src/components/core/Resizable/parts/resizable.jsx';

// Pill handles draw a ::before bar that grows on hover and turns primary while dragging.
const pill =
  'before:pointer-events-none before:absolute before:top-1/2 before:left-1/2 before:z-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-control before:bg-ui-muted-foreground/25 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.32,0.72,0,1)] hover:before:bg-ui-muted-foreground/40 active:before:bg-ui-primary';
// Vertical handles (between columns) take a tall pill, horizontal handles a wide one.
const styles = [
  { name: 'Line', note: 'default', className: '' },
  { name: 'Grip', note: 'withHandle', withHandle: true },
  { name: 'Pill', note: 'grows on hover', className: `${pill} before:h-6 before:w-1 hover:before:h-8 active:before:h-12 active:before:w-1.5`, rotated: `${pill} before:h-1 before:w-6 hover:before:w-8 active:before:w-12 active:before:h-1.5` },
  { name: 'Scaling pill', note: 'scales from 75%', className: `${pill} before:h-8 before:w-1 before:scale-y-75 hover:before:scale-y-100 active:before:h-14 active:before:w-1.5`, rotated: `${pill} before:h-1 before:w-8 before:scale-x-75 hover:before:scale-x-100 active:before:w-14 active:before:h-1.5` },
  { name: 'Capsule', note: 'track tints while dragging', className: `${pill} transition-colors duration-200 active:bg-ui-primary/20 before:h-6 before:w-1 hover:before:h-10 hover:before:w-1.5 active:before:h-20`, rotated: `${pill} transition-colors duration-200 active:bg-ui-primary/20 before:h-1 before:w-6 hover:before:w-10 hover:before:h-1.5 active:before:w-20` }
];

function Sample({ style }) {
  return (
    <figure className='grid gap-1.5'>
      <ResizablePanelGroup orientation='horizontal' className='min-h-36 rounded-xl border border-ui-border'>
        <ResizablePanel defaultSize='40%' minSize='20%'>
          <div className='flex h-full items-center justify-center text-xs text-ui-muted-foreground'>Nav</div>
        </ResizablePanel>
        <ResizableHandle withHandle={style.withHandle} className={style.className} />
        <ResizablePanel defaultSize='60%' minSize='30%'>
          <ResizablePanelGroup orientation='vertical'>
            <ResizablePanel defaultSize='50%' minSize='25%'>
              <div className='flex h-full items-center justify-center text-xs text-ui-muted-foreground'>Top</div>
            </ResizablePanel>
            <ResizableHandle withHandle={style.withHandle} className={style.rotated ?? style.className} />
            <ResizablePanel defaultSize='50%' minSize='25%'>
              <div className='flex h-full items-center justify-center text-xs text-ui-muted-foreground'>Bottom</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      <figcaption className='text-xs'>
        <span className='font-medium'>{style.name}</span>
        <span className='text-ui-muted-foreground'> · {style.note}</span>
      </figcaption>
    </figure>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {styles.map((style) => (
        <Sample key={style.name} style={style} />
      ))}
    </div>
  );
}
