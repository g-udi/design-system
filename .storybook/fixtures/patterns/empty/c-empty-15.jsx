import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
function StackedCardsIllustration() {
  return (
    <div className='relative h-24 w-52' aria-hidden='true'>
      {/* Back card */}
      <div className='bg-ui-muted/60 dark:bg-ui-muted/30 border-ui-border/50 absolute inset-x-6 top-0 h-6 rounded-t-lg border' />
      {/* Middle card */}
      <div className='bg-ui-muted/80 dark:bg-ui-muted/50 border-ui-border/60 absolute inset-x-3 top-3 h-6 rounded-t-lg border' />
      {/* Front card */}
      <div className='bg-ui-background border-ui-border absolute inset-x-0 top-6 flex h-16 items-center gap-3 rounded-lg border px-4 shadow-sm'>
        <div className='bg-ui-muted size-8 shrink-0 rounded' />
        <div className='flex flex-1 flex-col gap-1.5'>
          <div className='bg-ui-muted h-2.5 w-3/4 rounded' />
          <div className='bg-ui-muted/60 h-2 w-1/2 rounded' />
        </div>
      </div>
      {/* Fade overlay */}
      <div className='from-ui-background/0 via-ui-background/60 to-ui-background pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-b' />
    </div>
  );
}
export function Pattern() {
  return (
    <div className='flex items-center justify-center p-4'>
      <Empty className='py-8'>
        <EmptyHeader>
          <EmptyMedia>
            <StackedCardsIllustration />
          </EmptyMedia>
          <EmptyTitle>No products</EmptyTitle>
          <EmptyDescription>
            No data here yet. We will notify you when there&apos;s an update.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
