// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
