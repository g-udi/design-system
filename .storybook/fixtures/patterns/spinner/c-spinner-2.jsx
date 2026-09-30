import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-4'>
      <Button>
        <Spinner data-icon='inline-start' /> Processing…
      </Button>
      <Button variant='outline' disabled>
        <Spinner data-icon='inline-start' /> Loading…
      </Button>
      <Button variant='outline' size='icon' disabled aria-label='Loading'>
        <Spinner />
      </Button>
    </div>
  );
}
