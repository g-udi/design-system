import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs space-y-2'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium'>Large progress</span>
        <span className='text-ui-muted-foreground text-sm'>70%</span>
      </div>
      <Progress value={70} className='h-3' />
    </div>
  );
}
