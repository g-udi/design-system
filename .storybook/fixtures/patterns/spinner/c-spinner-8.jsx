import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <Card className='min-h-[200px] w-full max-w-xs'>
      <CardContent className='flex grow flex-col items-center justify-center gap-4'>
        <Spinner className='size-4 opacity-50' />
        <div className='flex flex-col items-center gap-1'>
          <p className='text-sm font-medium'>Setting up your workspace</p>
          <p className='text-ui-muted-foreground text-xs'>
            This may take a few seconds...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
