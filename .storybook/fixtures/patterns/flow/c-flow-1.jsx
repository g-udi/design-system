'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Flow,
  FlowPanel,
  FlowProvider,
  FlowStatus,
  addEdge,
  unreachableNodes,
  useFlowHistory,
  useReactFlow
} from '../../../../src/components/core/Flow/index.js';
import {
  AlertDialogRoot as AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../../../src/components/core/AlertDialog/index.js';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '../../../../src/components/core/Banner/index.js';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/context-menu.jsx';
import { default as Field, FieldInput, FieldLabel } from '../../../../src/components/core/Field/index.js';
import { Kbd, KbdGroup } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../../src/components/core/Sheet/index.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const people = {
  maya: { name: 'Maya Chen', src: 'https://randomuser.me/api/portraits/women/44.jpg' },
  sam: { name: 'Sam Rivera', src: 'https://randomuser.me/api/portraits/men/32.jpg' },
  alex: { name: 'Alex Morgan', src: 'https://randomuser.me/api/portraits/women/68.jpg' }
};
const step = (id, x, y, data) => ({ id, type: 'step', position: { x, y }, data });
// Hand-placed positions keep the reading order a person chose; nothing re-lays them out.
// Positions are the top centre of each card (nodeOrigin), so stacked steps line up.
const initialNodes = [
  { id: 'trigger', type: 'pill', position: { x: 360, y: 0 }, deletable: false, data: { title: 'New lead captured', icon: 'Zap', tone: 'accent', target: false } },
  step('enrich', 360, 64, { title: 'Enrich company', description: 'Size, industry and region', icon: 'Building2', tone: 'info', owner: people.maya, meta: ['Avg 1.2s'], status: 'success', statusLabel: 'Last run passed' }),
  step('fit', 360, 224, { title: 'Is it a good fit?', description: 'Score 70+ in a served region', icon: 'Split', tone: 'discovery', meta: ['Avg 0.3s'], status: 'success', statusLabel: 'Last run passed', outputs: [{ id: 'yes' }, { id: 'no' }] }),
  step('assign', 130, 396, { title: 'Assign account owner', description: 'Round robin across the region team', icon: 'UserPlus', tone: 'success', owner: people.sam, meta: ['Avg 0.8s'], status: 'running', statusLabel: 'Running now' }),
  step('nurture', 590, 396, { title: 'Add to nurture list', description: 'Monthly product digest', icon: 'Mail', tone: 'warning', meta: ['Avg 0.5s'], status: 'failed', statusLabel: 'Last run failed' }),
  step('welcome', 130, 560, { title: 'Send welcome email', description: 'From the assigned owner', icon: 'Send', tone: 'accent', meta: ['Waits 5 min'], status: 'idle', statusLabel: 'Not run yet' }),
  step('notify', 830, 224, { title: 'Notify sales channel', description: 'Post a summary for the team', icon: 'Bell', owner: people.alex, status: 'idle', statusLabel: 'Not run yet' })
];
const initialEdges = [
  { id: 'trigger-enrich', source: 'trigger', target: 'enrich' },
  { id: 'enrich-fit', source: 'enrich', target: 'fit' },
  { id: 'fit-assign', source: 'fit', sourceHandle: 'yes', target: 'assign', data: { label: 'Yes', tone: 'success' } },
  { id: 'fit-nurture', source: 'fit', sourceHandle: 'no', target: 'nurture', data: { label: 'No' } },
  { id: 'assign-welcome', source: 'assign', target: 'welcome' }
];

// The inspector floats over wide canvases and becomes a sheet on narrow ones.
function useWide(ref, min = 1024) {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => setWide(entry.contentRect.width >= min));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, min]);
  return wide;
}

function Inspector({ node, onChange, onFocus, onClose, onDelete }) {
  return (
    <div className='grid gap-3'>
      <div className='flex items-center gap-2'>
        <FlowStatus status={node.data.status} label={node.data.statusLabel} />
        <span className='text-text-muted ms-auto text-xs'>{node.data.meta?.[0]}</span>
      </div>
      <Field>
        <FieldLabel>Step name</FieldLabel>
        <FieldInput value={node.data.title} onFocus={onFocus} onChange={(event) => onChange({ title: event.target.value })} />
      </Field>
      <Field>
        <FieldLabel>Description</FieldLabel>
        <FieldInput value={node.data.description || ''} onFocus={onFocus} onChange={(event) => onChange({ description: event.target.value })} />
      </Field>
      <Field>
        <FieldLabel>Owner</FieldLabel>
        <FieldInput
          as='select'
          value={Object.keys(people).find((key) => people[key].name === node.data.owner?.name) || ''}
          onFocus={onFocus}
          onChange={(event) => onChange({ owner: people[event.target.value] })}
        >
          <option value=''>Unassigned</option>
          {Object.entries(people).map(([key, person]) => <option key={key} value={key}>{person.name}</option>)}
        </FieldInput>
      </Field>
      <div className='flex gap-2'>
        <Button size='sm' variant='outline' tone='danger' onClick={onDelete}>
          <RegistryIcon lucide='Trash2Icon' aria-hidden='true' />
          Delete step
        </Button>
        {onClose && <Button size='sm' variant='ghost' tone='neutral' className='ms-auto' onClick={onClose}>Done</Button>}
      </div>
    </div>
  );
}

function LeadRouting() {
  const history = useFlowHistory({ nodes: initialNodes, edges: initialEdges });
  const { nodes, edges, setNodes, commit, undo, redo, canUndo, canRedo } = history;
  const flow = useReactFlow();
  const frame = useRef(null);
  const wide = useWide(frame);
  const [selectedId, setSelectedId] = useState(null);
  const [inspecting, setInspecting] = useState(false);
  const [menuTarget, setMenuTarget] = useState(null);
  const [pending, setPending] = useState(null);
  const counter = useRef(1);
  const selected = nodes.find((node) => node.id === selectedId);
  const orphans = unreachableNodes(nodes, edges, ['trigger']);

  const update = (id, patch) => setNodes((current) => current.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...patch } } : node)));
  const duplicate = (id) => {
    const source = nodes.find((node) => node.id === id);
    if (!source) return;
    const copy = { ...source, id: `${id}-copy-${counter.current++}`, selected: false, position: { x: source.position.x + 40, y: source.position.y + 40 }, data: { ...source.data, title: `${source.data.title} copy`, status: 'idle', statusLabel: 'Not run yet' } };
    commit([...nodes, copy]);
  };
  const remove = (id) => flow.deleteElements({ nodes: [{ id }] });
  const addStep = (position) => {
    const id = `step-${counter.current++}`;
    const at = position || flow.screenToFlowPosition({ x: frame.current.getBoundingClientRect().left + 220, y: frame.current.getBoundingClientRect().top + 200 });
    commit([...nodes.map((node) => ({ ...node, selected: false })), step(id, at.x, at.y, { title: 'New step', description: 'Describe what happens', icon: 'Settings2', status: 'idle', statusLabel: 'Not run yet' })]);
    setSelectedId(id);
    // A sheet would cover the toolbar on narrow canvases, so it opens only on request there.
    setInspecting(wide);
  };
  const edit = (id) => {
    setSelectedId(id);
    setInspecting(true);
  };
  const actions = (id) => [
    { label: 'Edit', icon: 'Settings2', onSelect: edit },
    { label: 'Duplicate', icon: 'Copy', onSelect: duplicate },
    'separator',
    { label: 'Delete', icon: 'Trash2', destructive: true, disabled: id === 'trigger', onSelect: remove }
  ];
  // Every step card offers the same actions from its menu and from a toolbar while selected.
  const decorated = nodes.map((node) => (node.type !== 'step' ? node : {
    ...node,
    data: {
      ...node.data,
      actions: actions(node.id),
      toolbar: (
        <ButtonGroup aria-label={`${node.data.title} actions`}>
          <Button size='icon-xs' variant='ghost' tone='neutral' aria-label={`Edit ${node.data.title}`} onClick={() => edit(node.id)}>
            <RegistryIcon lucide='Settings2Icon' aria-hidden='true' />
          </Button>
          <Button size='icon-xs' variant='ghost' tone='neutral' aria-label={`Duplicate ${node.data.title}`} onClick={() => duplicate(node.id)}>
            <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
          </Button>
          <Button size='icon-xs' variant='ghost' tone='danger' aria-label={`Delete ${node.data.title}`} onClick={() => remove(node.id)}>
            <RegistryIcon lucide='Trash2Icon' aria-hidden='true' />
          </Button>
        </ButtonGroup>
      )
    }
  }));

  const onKeyDown = (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'z' || event.target.closest('input, select, textarea')) return;
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
  };

  const inspector = selected && (
    <Inspector
      node={selected}
      onFocus={() => commit()}
      onChange={(patch) => update(selected.id, patch)}
      onDelete={() => remove(selected.id)}
      onClose={() => setInspecting(false)}
    />
  );

  return (
    <div ref={frame} className='grid w-full gap-3' onKeyDown={onKeyDown}>
      <div className='flex flex-wrap items-center gap-2'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href='#automations'>Automations</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Lead routing</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className='ms-auto flex flex-wrap items-center gap-2'>
          <ButtonGroup aria-label='History'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='icon-sm' variant='outline' tone='neutral' aria-label='Undo' aria-keyshortcuts='Meta+Z Control+Z' disabled={!canUndo} onClick={undo}>
                  <RegistryIcon lucide='UndoIcon' aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo <KbdGroup><Kbd>⌘</Kbd><Kbd>Z</Kbd></KbdGroup></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='icon-sm' variant='outline' tone='neutral' aria-label='Redo' aria-keyshortcuts='Meta+Shift+Z Control+Shift+Z' disabled={!canRedo} onClick={redo}>
                  <RegistryIcon lucide='RedoIcon' aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo <KbdGroup><Kbd>⇧</Kbd><Kbd>⌘</Kbd><Kbd>Z</Kbd></KbdGroup></TooltipContent>
            </Tooltip>
          </ButtonGroup>
          <Button size='sm' onClick={() => addStep()}>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            Add step
          </Button>
        </div>
      </div>
      {orphans.length > 0 && (
        <Alert variant='warning'>
          <RegistryIcon lucide='TriangleAlertIcon' aria-hidden='true' />
          <AlertTitle>{orphans.length === 1 ? '1 step is never reached' : `${orphans.length} steps are never reached`}</AlertTitle>
          <AlertDescription>{orphans.map((node) => node.data.title).join(', ')} has no path from the trigger. Connect it or delete it.</AlertDescription>
          <AlertAction>
            <Button size='xs' variant='outline' tone='neutral' onClick={() => flow.fitView({ nodes: orphans.map(({ id }) => ({ id })), duration: 300, maxZoom: 1.2 })}>Show</Button>
          </AlertAction>
        </Alert>
      )}
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div>
            <Flow
              label='Lead routing workflow'
              nodes={decorated}
              edges={edges}
              onNodesChange={history.onNodesChange}
              onEdgesChange={history.onEdgesChange}
              onConnect={(connection) => commit(undefined, addEdge({ ...connection, id: `${connection.source}-${connection.target}-${counter.current++}` }, edges))}
              onSelectionChange={({ nodes: picked }) => setSelectedId(picked[0]?.id ?? null)}
              onNodeDoubleClick={(_, node) => edit(node.id)}
              onNodeContextMenu={(_, node) => setMenuTarget({ node })}
              onPaneContextMenu={(event) => setMenuTarget({ position: flow.screenToFlowPosition({ x: event.clientX, y: event.clientY }) })}
              onBeforeDelete={({ nodes: doomed, edges: links }) => (doomed.length
                ? new Promise((resolve) => setPending({ nodes: doomed, resolve }))
                : Promise.resolve(links.length > 0))}
              nodeOrigin={[0.5, 0]}
              className='h-[34rem]'
            >
              {wide && inspecting && inspector && (
                <FlowPanel position='top-right' className='bg-surface w-72 rounded-lg border p-3 shadow-sm'>
                  <div className='grid w-full gap-1'>
                    <h3 className='text-sm font-medium'>Edit step</h3>
                    {inspector}
                  </div>
                </FlowPanel>
              )}
            </Flow>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className='w-48'>
          {menuTarget?.node ? (
            <>
              <ContextMenuItem onSelect={() => edit(menuTarget.node.id)}>Edit</ContextMenuItem>
              <ContextMenuItem disabled={menuTarget.node.type !== 'step'} onSelect={() => duplicate(menuTarget.node.id)}>Duplicate</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant='destructive' disabled={menuTarget.node.deletable === false} onSelect={() => remove(menuTarget.node.id)}>
                Delete
                <ContextMenuShortcut>⌫</ContextMenuShortcut>
              </ContextMenuItem>
            </>
          ) : (
            <>
              <ContextMenuItem onSelect={() => addStep(menuTarget?.position)}>Add step here</ContextMenuItem>
              <ContextMenuItem onSelect={() => flow.fitView({ duration: 300, padding: 0.2 })}>Fit to view</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem disabled={!canUndo} onSelect={undo}>Undo<ContextMenuShortcut>⌘Z</ContextMenuShortcut></ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
      <Sheet open={!wide && inspecting && Boolean(selected)} onOpenChange={setInspecting}>
        <SheetContent side='right' className='gap-0'>
          <SheetHeader>
            <SheetTitle>Edit step</SheetTitle>
            <SheetDescription>Changes apply to the canvas as you type.</SheetDescription>
          </SheetHeader>
          <div className='px-4 pb-4'>{inspector}</div>
        </SheetContent>
      </Sheet>
      <AlertDialog open={Boolean(pending)} onOpenChange={(open) => { if (!open && pending) { pending.resolve(false); setPending(null); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pending?.nodes.length === 1 ? `“${pending.nodes[0].data.title}”` : `${pending?.nodes.length} steps`}?</AlertDialogTitle>
            <AlertDialogDescription>Its connections are removed too. You can undo this from the toolbar.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={() => {
                pending.resolve(true);
                setPending(null);
                setInspecting(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function Pattern() {
  return (
    <TooltipProvider>
      <FlowProvider>
        <LeadRouting />
      </FlowProvider>
    </TooltipProvider>
  );
}
