import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <Button disabled>
      <Spinner aria-hidden='true' />
      Please wait
    </Button>
  );
}
