import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className='bg-invert text-invert-foreground rounded-md flex w-[356px] flex-col gap-3 border border-transparent p-4 shadow-lg'>
        <div className='flex items-start gap-3'>
          <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white'>
            <RegistryIcon lucide='XIcon' className='size-3.5' />
          </div>
          <div className='flex flex-1 flex-col gap-1'>
            <p className='text-sm font-semibold'>Build Failed</p>
            <p className='text-invert-foreground/70 text-sm'>
              Compilation error in 2 files. Fix errors before deploying.
            </p>
          </div>
        </div>
        <Separator className='bg-ui-border/10' />
        <div className='text-invert-foreground/60 space-y-1 font-mono text-xs'>
          <p>src/api/auth.ts:42 — TypeError: undefined is not a function</p>
          <p>src/utils/parse.ts:18 — SyntaxError: Unexpected token</p>
        </div>
        <div className='flex gap-2'>
          <Button
            size='xs'
            variant='outline'
            className='bg-ui-background/10 border-ui-border/10 text-invert-foreground flex-1'
            onClick={() => toast.dismiss()}
          >
            View Logs
          </Button>
          <Button
            size='xs'
            className='flex-1 border-red-800 bg-red-500 text-white hover:border-red-900 hover:bg-red-600'
            onClick={() => toast.dismiss()}
          >
            Retry Build
          </Button>
        </div>
      </div>
    ));
  };
  return (
    <div className='flex items-center justify-center'>
      <Button onClick={showToast} variant='outline' className='w-fit'>
        Invert Error Toast
      </Button>
    </div>
  );
}
