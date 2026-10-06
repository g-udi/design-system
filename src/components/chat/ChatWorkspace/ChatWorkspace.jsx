'use client';
import { useEffect, useRef } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import { cn } from '../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Button from '../../core/Button/index.js';
import EmptyState from '../../core/EmptyState/index.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../core/Tabs/index.js';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia, ItemTitle } from '../../core/Item/index.js';
import { ChatAgentMark } from '../ChatAgentMark/index.js';
import { ChatActivityIndicator } from '../ChatActivityIndicator/index.js';
import { ChatFileExplorer } from '../ChatFileExplorer/index.js';

const EMPTY_AGENTS = [];
const EMPTY_EXPLORER = {};
const LABELS = {
  files: 'Files', agents: 'Agents', allFiles: 'All files', viewFiles: 'View files',
  noAgents: 'No agents yet', noAgentsDescription: 'Agents working on this conversation will appear here.',
  noAgentFiles: 'No files yet'
};

/** A workspace context panel: an agent roster leads into scoped folders in the existing explorer. */
function ChatWorkspace({
  agents = EMPTY_AGENTS, fileExplorerProps = EMPTY_EXPLORER,
  view, defaultView = 'files', onViewChange,
  agentId, defaultAgentId = null, onAgentChange,
  title = 'Workspace', description, actions, labels: labelOverrides, className
}) {
  const labels = { ...LABELS, ...labelOverrides };
  const [currentView, setView] = useControllableState({ value: view, defaultValue: defaultView, onChange: onViewChange });
  const [currentAgentId, setAgentId] = useControllableState({ value: agentId, defaultValue: defaultAgentId, onChange: onAgentChange });
  const filesTab = useRef(null);
  const lastPanelFocus = useRef(null);
  const focusFiles = useRef(false);
  const hasFolder = (agent) => agent.fileRootId != null && Array.isArray(fileExplorerProps.items?.[agent.fileRootId]?.children);
  const activeAgent = agents.find((agent) => agent.id === currentAgentId && hasFolder(agent));
  const rootId = activeAgent?.fileRootId ?? fileExplorerProps.rootId ?? 'root';
  useIsomorphicLayoutEffect(() => {
    const previous = lastPanelFocus.current;
    if (currentView !== 'files' || !previous || previous.isConnected) return;
    lastPanelFocus.current = null;
    const document = previous.ownerDocument;
    if (document.hasFocus() && document.activeElement === document.body) filesTab.current?.focus();
  }, [rootId, currentView]);
  const openFiles = (id) => {
    focusFiles.current = true;
    setAgentId(id);
    setView('files');
  };
  useEffect(() => {
    // Wait for the host to accept the tab change. Focusing before that would ask
    // Radix's automatic tab activation to send the same controlled change twice.
    if (focusFiles.current && currentView === 'files') {
      focusFiles.current = false;
      filesTab.current?.focus();
    }
  }, [currentView, currentAgentId]);

  return (
    <section data-slot='chat-workspace' aria-label={title} className={cn('flex min-h-0 min-w-0 flex-col gap-3', className)} onFocusCapture={(event) => { lastPanelFocus.current = event.target; }} onBlurCapture={(event) => {
      if (event.target.isConnected && !event.currentTarget.contains(event.relatedTarget)) lastPanelFocus.current = null;
    }}>
      <header className='flex min-w-0 flex-wrap items-start gap-2'>
        <div className='min-w-0 flex-1'>
          <h2 className='break-words text-sm font-semibold'>{title}</h2>
          {description ? <p className='mt-1 break-words text-xs text-text-muted'>{description}</p> : null}
        </div>
        {actions}
      </header>
      <Tabs value={currentView} onValueChange={setView} className='min-h-0 gap-3'>
        <TabsList aria-label={title} className='w-full'>
          <TabsTrigger ref={filesTab} value='files' className='min-w-0 flex-1'>{labels.files}</TabsTrigger>
          <TabsTrigger value='agents' className='min-w-0 flex-1'>{labels.agents}<span aria-hidden='true' className='ms-1 text-text-muted'>{agents.length}</span></TabsTrigger>
        </TabsList>
        <TabsContent value='files' className='min-h-0 min-w-0'>
          {activeAgent ? (
            <div className='mb-3 flex min-w-0 flex-wrap items-center gap-2'>
              <Button variant='ghost' size='sm' onClick={() => openFiles(null)}><RegistryIcon lucide='ArrowLeft' />{labels.allFiles}</Button>
            </div>
          ) : null}
          <ChatFileExplorer key={rootId} {...fileExplorerProps} rootId={rootId} label={activeAgent?.name ?? fileExplorerProps.label ?? labels.files} />
        </TabsContent>
        <TabsContent value='agents' className='min-h-0 min-w-0'>
          {agents.length ? (
            <ItemGroup role='list' aria-label={labels.agents}>
              {agents.map((agent) => (
                <Item key={agent.id} role='listitem' size='sm' className='min-w-0 flex-nowrap items-start rounded-none border-b px-0 last:border-b-0'>
                  <ItemMedia><ChatAgentMark name={agent.name} seed={agent.id} size='sm' decorative /></ItemMedia>
                  <ItemContent className='min-w-0 gap-2'>
                    <ItemTitle className='w-full min-w-0 whitespace-normal break-words [overflow-wrap:anywhere]'>{agent.name}</ItemTitle>
                    {agent.description ? <ItemDescription className='line-clamp-none break-words [overflow-wrap:anywhere]'>{agent.description}</ItemDescription> : null}
                    <ItemHeader className='min-w-0 flex-wrap gap-2'>
                      <ChatActivityIndicator state={agent.state} labels={agent.labels} showLabel />
                      {hasFolder(agent) ? (
                        <Button variant='ghost' size='xs' aria-label={`${labels.viewFiles}: ${agent.name}`} onClick={() => openFiles(agent.id)}>{labels.viewFiles}<RegistryIcon lucide='ArrowRight' /></Button>
                      ) : <span className='text-xs text-text-muted'>{labels.noAgentFiles}</span>}
                    </ItemHeader>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          ) : <EmptyState compact icon={<RegistryIcon lucide='Bot' />} title={labels.noAgents} description={labels.noAgentsDescription} />}
        </TabsContent>
      </Tabs>
    </section>
  );
}

export { ChatWorkspace };
