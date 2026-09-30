'use client';
import { useCallback, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import { CascaderItems } from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const folderIcon = <RegistryIcon lucide='FolderIcon' className='size-4' />;
const fileIcon = <RegistryIcon lucide='FileTextIcon' className='size-4' />;
const TONE_BADGE = {
  primary: { variant: 'primary-outline', pin: 'text-ui-primary!' },
  success: { variant: 'success-outline', pin: 'text-success-foreground!' },
  info: { variant: 'info-outline', pin: 'text-info-foreground!' },
  warning: { variant: 'warning-outline', pin: 'text-warning-foreground!' }
};
const LARGE_ASSET_MB = 5;
const REPOSITORIES = [
  { name: 'gaudi', kind: 'components' },
  { name: 'keenicons', kind: 'icons' },
  { name: 'metronic', kind: 'templates' },
  { name: 'gaudi-blocks', kind: 'blocks' },
  { name: 'gaudi-icons', kind: 'icons' },
  { name: 'gaudi-mcp', kind: 'mcp' },
  { name: 'gaudi-templates', kind: 'templates' },
  { name: 'gaudi-cli', kind: 'cli' }
];
const RELEASES_PER_REPOSITORY = 4;
const ASSETS_PER_RELEASE = 20;
const PAGE_SIZE = 8;
const NO_ITEMS = [];
function releasesFor(repository) {
  return Array.from({ length: RELEASES_PER_REPOSITORY }, (_, i) => {
    const major = RELEASES_PER_REPOSITORY - i;
    return {
      value: `${repository}/v${major}`,
      label: `v${major}.0`,
      icon: folderIcon,
      // Without `hasChildren` an unfetched branch renders as a selectable leaf:
      // the cascader has no other way to know a level exists before it is loaded.
      hasChildren: true,
      count: ASSETS_PER_RELEASE,
      // The newest release is the one you usually want, so it takes the brand
      // accent; the rest are supported, not stale, so they read as `success`
      // rather than as a greyed-out alternative.
      data:
        i === 0
          ? { badge: 'latest', tone: 'primary' }
          : { badge: 'stable', tone: 'success' }
    };
  });
}
function filesFor(release, offset) {
  const length = Math.min(PAGE_SIZE, ASSETS_PER_RELEASE - offset);
  return Array.from({ length }, (_, i) => {
    const n = offset + i + 1;
    const megabytes = 0.6 + n * 0.37;
    return {
      value: `${release}/asset-${n}`,
      label: `asset-${String(n).padStart(2, '0')}.tar.gz`,
      icon: fileIcon,
      // A size only earns a colour once it changes your mind about the row, so
      // the amber starts at the point a download stops being free.
      data: {
        badge: `${megabytes.toFixed(1)} MB`,
        tone: megabytes >= LARGE_ASSET_MB ? 'warning' : 'info'
      }
    };
  });
}
const LATENCY_MS = 700;
const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
export function Pattern() {
  const [value, setValue] = useState('');
  const [failNext, setFailNext] = useState(false);
  const getChildren = useCallback(
    async (node, context) => {
      await wait(LATENCY_MS, context.signal);
      if (failNext) {
        setFailNext(false);
        throw new Error('The registry is unreachable.');
      }
      if (node === null) {
        return {
          items: REPOSITORIES.map((repository) => ({
            value: repository.name,
            label: repository.name,
            icon: folderIcon,
            hasChildren: true,
            count: RELEASES_PER_REPOSITORY,
            // A repository's kind is a classification, not a verdict on it, so
            // every root row reads at the same weight.
            data: { badge: repository.kind, tone: 'info' }
          }))
        };
      }
      if (REPOSITORIES.some((repository) => repository.name === node.value)) {
        return { items: releasesFor(node.value) };
      }
      const offset = context.cursor ? Number(context.cursor) : 0;
      const items = filesFor(node.value, offset);
      const next = offset + items.length;
      const more = next < ASSETS_PER_RELEASE;
      return {
        items,
        nextCursor: more ? String(next) : void 0,
        hasMore: more
      };
    },
    [failNext]
  );
  return (
    <div className='flex w-full flex-col items-center gap-3 p-4'>
      <Cascader
        items={NO_ITEMS}
        getChildren={getChildren}
        value={value}
        onValueChange={setValue}
        renderLabel={(node) => (
          <span className='flex w-full min-w-0 items-center gap-2'>
            <span className='min-w-0 flex-1 truncate text-start'>
              {node.label}
            </span>
            {node.data ? (
              <Badge
                variant={TONE_BADGE[node.data.tone].variant}
                className={cn('shrink-0', TONE_BADGE[node.data.tone].pin)}
              >
                {node.data.badge}
              </Badge>
            ) : null}
          </span>
        )}
      >
        <CascaderTrigger
          aria-label='Release asset'
          render={
            <Button
              variant='outline'
              className='w-80 justify-between gap-2 font-normal'
            />
          }
        >
          <CascaderValue placeholder='Select a release asset' />
        </CascaderTrigger>

        {/* The branch spinner is drawn by the primitive at `size-4`, the size
       of the chevron it replaces. Scoped down to 3.5 here, which is what
       the paging row's own spinner already uses, so the two loading
       states in one panel are the same weight. The 16px affordance box is
       untouched, so nothing reflows when the glyph swaps. */}
        <CascaderContent className='w-80 **:data-[slot=spinner]:size-3.5'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            {/* One element that swaps its children between loading, error and
       empty, so an async level never announces "No results found."
       on its way to being loaded. */}
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>

      <p className='text-ui-muted-foreground max-w-80 text-center text-xs text-balance'>
        Each level is fetched on press, {LATENCY_MS}ms per request.
      </p>

      <Button
        variant='outline'
        size='sm'
        disabled={failNext}
        onClick={() => setFailNext(true)}
      >
        {failNext ? 'Next request will fail' : 'Fail the next request'}
      </Button>
    </div>
  );
}
