// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Empty className='border'>
        <EmptyHeader>
          <EmptyTitle>404 — Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <InputGroup className='w-3/4'>
            <InputGroupInput
              aria-label='Try searching for pages…'
              placeholder='Try searching for pages…'
            />
            <InputGroupAddon>
              <RegistryIcon lucide='CircleDashedIcon' />
            </InputGroupAddon>
            <InputGroupAddon align='inline-end'>
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <EmptyDescription>
            Need help? <a href='#'>Contact support</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}
