// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs space-y-2'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium'>Small progress</span>
        <span className='text-ui-muted-foreground text-sm'>30%</span>
      </div>
      <Progress value={30} className='h-1' />
    </div>
  );
}
