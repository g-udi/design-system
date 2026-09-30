// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
function BoardIllustration() {
  return (
    <svg
      width='180'
      height='160'
      viewBox='0 0 180 160'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      {/* Shadow */}
      <ellipse
        cx='90'
        cy='148'
        rx='60'
        ry='8'
        className='fill-ui-muted-foreground/8 dark:fill-ui-muted-foreground/5'
      />

      {/* Isometric board - back face */}
      <path
        d='M30 40 L90 10 L160 45 L100 75 Z'
        className='fill-ui-muted/80 dark:fill-ui-muted/40 stroke-ui-border'
        strokeWidth='1.5'
        strokeLinejoin='round'
      />
      {/* Board - front face */}
      <path
        d='M30 40 L100 75 L100 110 L30 75 Z'
        className='fill-ui-muted dark:fill-ui-muted/60 stroke-ui-border'
        strokeWidth='1.5'
        strokeLinejoin='round'
      />
      {/* Board - right face */}
      <path
        d='M100 75 L160 45 L160 80 L100 110 Z'
        className='fill-ui-background stroke-ui-border'
        strokeWidth='1.5'
        strokeLinejoin='round'
      />

      {/* Content lines on the board surface - isometric */}
      {/* Row 1 */}
      <circle cx='62' cy='35' r='4' className='fill-ui-primary/20' />
      <line
        x1='72'
        y1='33'
        x2='105'
        y2='17'
        className='stroke-ui-muted-foreground/20'
        strokeWidth='4'
        strokeLinecap='round'
      />
      <line
        x1='110'
        y1='15'
        x2='130'
        y2='5'
        className='stroke-ui-muted-foreground/15'
        strokeWidth='4'
        strokeLinecap='round'
      />

      {/* Row 2 */}
      <circle cx='55' cy='50' r='4' className='fill-ui-primary/30' />
      <line
        x1='65'
        y1='48'
        x2='100'
        y2='31'
        className='stroke-ui-muted-foreground/20'
        strokeWidth='4'
        strokeLinecap='round'
      />
      <line
        x1='105'
        y1='29'
        x2='135'
        y2='14'
        className='stroke-ui-muted-foreground/12'
        strokeWidth='4'
        strokeLinecap='round'
      />

      {/* Row 3 */}
      <circle cx='48' cy='65' r='4' className='fill-ui-destructive/25' />
      <line
        x1='58'
        y1='63'
        x2='88'
        y2='48'
        className='stroke-ui-muted-foreground/18'
        strokeWidth='4'
        strokeLinecap='round'
      />
    </svg>
  );
}
export function Pattern() {
  return (
    <div className='flex items-center justify-center p-4'>
      <Empty className='py-8'>
        <EmptyHeader>
          <EmptyMedia>
            <BoardIllustration />
          </EmptyMedia>
          <EmptyTitle>Be the first to share a thought</EmptyTitle>
          <EmptyDescription>
            Drop a comment on the canvas to get the conversation started.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
