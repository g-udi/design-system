// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <div className='grid grid-cols-3 gap-4'>
      <Badge>
        <Spinner data-icon='inline-start' />
        Updating
      </Badge>
      <Badge variant='secondary'>
        <Spinner data-icon='inline-start' />
        Syncing
      </Badge>
      <Badge variant='outline'>
        <Spinner data-icon='inline-start' />
        Loading
      </Badge>
      <Badge variant='destructive-light'>
        <Spinner data-icon='inline-start' />
        Updating
      </Badge>
      <Badge variant='success-light'>
        <Spinner data-icon='inline-start' />
        Syncing
      </Badge>
      <Badge variant='info-light'>
        <Spinner data-icon='inline-start' />
        Loading
      </Badge>
    </div>
  );
}
