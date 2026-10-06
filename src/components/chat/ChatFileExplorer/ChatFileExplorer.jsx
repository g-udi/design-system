'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import { getFocusableElements } from '../../../hooks/shared/dom.js';
import { cn } from '../../../utilities/cn/index.js';
import { Tree, TreeItem, TreeItemLabel } from '../../core/Tree/Tree.jsx';
import Input from '../../core/Input';
import Button from '../../core/Button';
import { Badge } from '../../core/Pill';
import { Alert, AlertTitle, AlertDescription } from '../../core/Banner';
import EmptyState from '../../core/EmptyState';
import Skeleton from '../../core/Skeleton';
import { ChatAgentMark } from '../ChatAgentMark';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { fileDownloadUrl, fileIcon, fileType, prepareFileTree } from './chatFileExplorerModel.js';

const EMPTY_ITEMS = {};
const EMPTY_EXPANDED = [];
const keepActivationSelection = () => {};
const activateFocusedRow = (_event, tree) => tree.getFocusedItem()?.getElement()?.click();
const fileTreeHotkeys = {
  activateFile: { hotkey: 'Enter', preventDefault: true, handler: activateFocusedRow },
  selectFile: { hotkey: 'Space', preventDefault: true, handler: activateFocusedRow }
};
const defaultLabels = {
  search: 'Search files', clearSearch: 'Clear search', preview: 'Preview', download: 'Download',
  refresh: 'Refresh files', loading: 'Loading files…', errorTitle: 'Could not load files', retry: 'Try again',
  emptyTitle: 'No files yet', emptyDescription: 'Shared files, uploads, and agent outputs will appear here.',
  noResultsTitle: 'No matching files', noResultsDescription: 'Try another filename, type, or folder.'
};

/** A conversation's prepared file hierarchy; Core Tree owns navigation, expansion and focus. */
function ChatFileExplorer({
  items = EMPTY_ITEMS, rootId = 'root', defaultExpanded = EMPTY_EXPANDED,
  selectedId, defaultSelectedId = null, onSelect, onPreview,
  searchable = true, loading = false, error, onRetry, onRefresh, refreshing = false,
  actions, label = 'Files', labels: labelOverrides, className
}) {
  const labels = { ...defaultLabels, ...labelOverrides };
  const panelRef = useRef(null);
  const lastTreeFocus = useRef(null);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [searchExpanded, setSearchExpanded] = useState([]);
  const [selection, setSelection] = useControllableState({ value: selectedId, defaultValue: defaultSelectedId });
  const searching = searchable && Boolean(query.trim());
  const model = useMemo(() => prepareFileTree(items, rootId, searchable ? query : ''), [items, rootId, query, searchable]);
  const expandedItems = searching ? searchExpanded : expanded;
  const selectedItems = selection != null && model.items[selection] && !Array.isArray(model.items[selection].children) ? [selection] : [];
  const activate = (id) => {
    const file = items[id];
    if (!file || Array.isArray(file.children)) return;
    setSelection(id);
    onSelect?.(id, file);
  };
  const tree = useTree({
    rootItemId: rootId,
    hotkeys: fileTreeHotkeys,
    state: { selectedItems, expandedItems },
    setExpandedItems: searching ? setSearchExpanded : setExpanded,
    // File activation is single-selection; modifier shortcuts must not select entire folders.
    setSelectedItems: keepActivationSelection,
    getItemName: (item) => item.getItemData()?.name || '',
    isItemFolder: (item) => Array.isArray(item.getItemData()?.children),
    onPrimaryAction: (item) => { if (!item.isFolder()) activate(item.getId()); },
    dataLoader: {
      getItem: (id) => model.items[id] ?? { name: '' },
      getChildren: (id) => model.items[id]?.children ?? []
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
  });
  useEffect(() => { setSearchExpanded(model.expanded); }, [model]);
  useEffect(() => {
    tree.rebuildTree();
    const focused = tree.getState().focusedItem;
    if (focused != null && !tree.getItems().some((item) => item.getId() === focused)) tree.getItems()[0]?.setFocused();
  }, [model, expandedItems, rootId, tree]);

  const busy = loading || refreshing;
  const retry = onRetry || onRefresh;
  const hasItems = model.hasItems;
  const hasVisibleItems = model.items[rootId].children.length > 0;
  // Removing a focused row drops browser focus to <body> without a blur event.
  // Wait for Core Tree's rebuilt rows to mount before restoring that owned focus.
  useIsomorphicLayoutEffect(() => {
    const previous = lastTreeFocus.current;
    if (!previous || previous.isConnected) return;
    const document = previous.ownerDocument;
    if (!document.hasFocus() || (document.activeElement && document.activeElement !== document.body)) {
      lastTreeFocus.current = null;
      return;
    }
    const visible = tree.getItems().filter((item) => model.items[item.getId()] && item.getElement()?.isConnected);
    const next = visible.find((item) => item.isFocused()) || visible[0];
    if (next) {
      next.setFocused();
      next.getElement().focus();
    } else if (!hasVisibleItems) {
      lastTreeFocus.current = null;
      (getFocusableElements(panelRef.current)[0] || panelRef.current)?.focus();
    }
  });
  return (
    <section ref={panelRef} tabIndex={-1} data-slot='chat-file-explorer' aria-label={label} aria-busy={busy || undefined} className={cn('ds-part-chat-file-explorer flex min-h-0 min-w-0 flex-col gap-3', className)}>
      <header className='flex min-w-0 flex-wrap items-center gap-2'>
        <h2 className='min-w-0 flex-1 break-words text-sm font-semibold'>{label}</h2>
        <Badge variant='secondary' size='sm' aria-label={`${model.total} ${model.total === 1 ? 'file' : 'files'}`}>{model.total}</Badge>
        {onRefresh ? <Button variant='ghost' size='icon-sm' aria-label={labels.refresh} title={labels.refresh} disabled={busy} onClick={onRefresh}><RegistryIcon lucide='RefreshCw' className={cn(busy && 'motion-safe:animate-spin')} /></Button> : null}
        {actions}
      </header>
      {searchable && (hasItems || searching) ? (
        <Input type='search' value={query} onChange={(event) => setQuery(event.target.value)} aria-label={labels.search} placeholder={labels.search} className='w-full' prefix={<RegistryIcon lucide='Search' className='size-4' />} suffix={query ? <Button variant='ghost' size='icon-xs' aria-label={labels.clearSearch} onClick={() => setQuery('')}><RegistryIcon lucide='X' /></Button> : undefined} />
      ) : null}
      {error ? <Alert variant='destructive'><RegistryIcon lucide='CircleAlert' /><AlertTitle className='line-clamp-none'>{labels.errorTitle}</AlertTitle><AlertDescription className='min-w-0 break-words'>{error}{retry ? <Button variant='outline' size='sm' disabled={busy} onClick={retry}>{labels.retry}</Button> : null}</AlertDescription></Alert> : null}
      <span role='status' className='sr-only'>{busy ? labels.loading : searching ? `${model.matches} matching ${model.matches === 1 ? 'file' : 'files'}` : ''}</span>
      {!hasItems && busy ? (
        <div className='grid gap-3' aria-hidden='true'>{[0, 1, 2].map((row) => <div key={row} className='flex items-center gap-2'><Skeleton className='size-6 shrink-0' /><div className='grid flex-1 gap-1'><Skeleton className='h-3 w-3/4' /><Skeleton className='h-2 w-1/2' /></div></div>)}</div>
      ) : !hasItems && !error ? (
        <EmptyState compact icon={<RegistryIcon lucide='FolderOpen' />} title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : hasItems && searching && !hasVisibleItems ? (
        <EmptyState compact icon={<RegistryIcon lucide='Search' />} title={labels.noResultsTitle} description={labels.noResultsDescription} actions={<Button variant='outline' size='sm' onClick={() => setQuery('')}>{labels.clearSearch}</Button>} />
      ) : hasVisibleItems ? (
        <div className='min-h-0 min-w-0 overflow-y-auto overscroll-contain' onFocusCapture={(event) => { lastTreeFocus.current = event.target; }} onBlurCapture={(event) => {
          if (event.target.isConnected && !event.currentTarget.contains(event.relatedTarget)) lastTreeFocus.current = null;
        }}>
          <Tree indent={16} tree={tree} aria-label={label} aria-multiselectable={false} className='min-w-0 gap-0.5'>
            {tree.getItems().map((item) => {
              const id = item.getId();
              const data = model.items[id];
              if (!data) return null;
              const folder = Array.isArray(data.children);
              const download = folder ? null : fileDownloadUrl(data.downloadUrl);
              const type = data.typeLabel ?? fileType(data.name);
              const canPreview = !folder && onPreview && data.canPreview !== false;
              const metadata = [data.sizeLabel, data.modifiedLabel, data.meta].filter(Boolean);
              return (
                <TreeItem key={id} item={item} asChild>
                  <div data-file-id={id} className='min-w-0' onFocus={() => item.setFocused()}>
                    <TreeItemLabel className='min-h-11 min-w-0 flex-1 py-2 text-sm'>
                        {folder && data.agent ? <ChatAgentMark {...data.agent} size='xs' decorative /> : <RegistryIcon lucide={folder ? (item.isExpanded() ? 'FolderOpen' : 'Folder') : fileIcon(data.name)} className='size-4 shrink-0 text-text-muted' />}
                        <span className='grid min-w-0 flex-1 gap-0.5'>
                          <span className='truncate text-start font-medium' title={data.name}>{data.name}</span>
                          {!folder && (metadata.length || type) ? <span className='flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-text-muted'>
                            {type ? <Badge variant='outline' size='sm' className='max-w-16 truncate'>{type}</Badge> : null}
                            {data.sizeLabel ? <span className='max-w-full truncate tabular-nums'>{data.sizeLabel}</span> : null}
                            {data.modifiedLabel ? <time dateTime={data.modifiedAt} className='max-w-full truncate'>{data.modifiedLabel}</time> : null}
                            {data.meta ? <span className='max-w-full truncate'>{data.meta}</span> : null}
                          </span> : null}
                        </span>
                        {folder ? <span className='shrink-0 text-xs tabular-nums text-text-muted' aria-label={`${model.counts[id]} files`}>{model.counts[id]}</span> : null}
                        {canPreview || download ? <span className='flex shrink-0 items-center gap-0.5' onClick={(event) => event.stopPropagation()} onKeyDownCapture={(event) => event.stopPropagation()}>
                          {canPreview ? <Button variant='ghost' size='icon-sm' tabIndex={item.isFocused() ? 0 : -1} aria-label={`${labels.preview}: ${data.name}`} title={labels.preview} onClick={() => { activate(id); onPreview(id, items[id]); }}><RegistryIcon lucide='Eye' /></Button> : null}
                          {download ? <Button asChild variant='ghost' size='icon-sm'><a href={download} download={data.downloadName || data.name} tabIndex={item.isFocused() ? 0 : -1} aria-label={`${labels.download}: ${data.name}`} title={labels.download}><RegistryIcon lucide='Download' /></a></Button> : null}
                        </span> : null}
                    </TreeItemLabel>
                  </div>
                </TreeItem>
              );
            })}
          </Tree>
        </div>
      ) : null}
    </section>
  );
}

export { ChatFileExplorer };
