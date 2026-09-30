// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
export function Pattern() {
  return (
    <ButtonGroup orientation='vertical'>
      <Button variant='outline' className={cn('bg-ui-muted justify-start')}>
        Dashboard
      </Button>
      <Button variant='outline' className='justify-start'>
        Analytics
      </Button>
      <Button variant='outline' className='justify-start'>
        Settings
      </Button>
      <Button variant='outline' className='justify-start'>
        Help
      </Button>
    </ButtonGroup>
  );
}
