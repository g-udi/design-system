// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
function SearchCardsIllustration() {
  return (
    <div className='relative h-32 w-56' aria-hidden='true'>
      {/* Bottom card */}
      <div className='bg-ui-muted/50 dark:bg-ui-muted/25 border-ui-border/40 absolute right-6 bottom-4 left-6 flex h-12 items-center gap-2.5 rounded-lg border px-3'>
        <div className='bg-ui-muted-foreground/10 size-5 shrink-0 rounded' />
        <div className='flex flex-1 flex-col gap-1'>
          <div className='bg-ui-muted-foreground/10 h-2 w-full rounded' />
          <div className='bg-ui-muted-foreground/8 h-2 w-2/3 rounded' />
        </div>
      </div>
      {/* Middle card */}
      <div className='bg-ui-muted/70 dark:bg-ui-muted/40 border-ui-border/50 absolute right-3 bottom-8 left-3 flex h-12 items-center gap-2.5 rounded-lg border px-3'>
        <div className='bg-ui-muted-foreground/12 size-5 shrink-0 rounded' />
        <div className='flex flex-1 flex-col gap-1'>
          <div className='bg-ui-muted-foreground/12 h-2 w-full rounded' />
          <div className='bg-ui-muted-foreground/10 h-2 w-3/4 rounded' />
        </div>
      </div>
      {/* Front card */}
      <div className='bg-ui-background border-ui-border absolute inset-x-0 bottom-12 flex h-14 items-center gap-3 rounded-lg border px-3.5 shadow-sm'>
        <div className='bg-ui-muted size-7 shrink-0 rounded' />
        <div className='flex flex-1 flex-col gap-1.5'>
          <div className='bg-ui-muted h-2.5 w-full rounded' />
          <div className='bg-ui-muted/70 h-2 w-3/5 rounded' />
        </div>
      </div>
      {/* Fade */}
      <div className='from-ui-background/0 to-ui-background pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-b' />
    </div>
  );
}
export function Pattern() {
  return (
    <div className='flex items-center justify-center p-4'>
      <Empty className='py-8'>
        <EmptyHeader>
          <EmptyMedia>
            <SearchCardsIllustration />
          </EmptyMedia>
          <EmptyTitle>Looking for something?</EmptyTitle>
          <EmptyDescription>
            Type a keyword and we&apos;ll search through files, folders, #tags,
            and transcripts.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
