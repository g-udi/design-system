import { Separator } from '@gaudi/design-system/core/Separator';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-6'>
      <div className='grid items-center'>
        <Separator className='col-start-1 row-start-1' />
        <span className='bg-ui-background text-ui-muted-foreground col-start-1 row-start-1 justify-self-center px-2 text-xs'>
          or continue with
        </span>
      </div>
    </div>
  );
}
