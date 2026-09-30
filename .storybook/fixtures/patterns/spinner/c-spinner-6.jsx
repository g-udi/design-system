import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-3'>
      <Button disabled>
        <Spinner />
        Saving...
      </Button>
      <Button variant='outline' disabled>
        <Spinner />
        Loading
      </Button>
      <Button variant='secondary' disabled>
        <Spinner />
        Processing
      </Button>
    </div>
  );
}
