// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Kbd,
  KbdGroup
} from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <KbdGroup>
        <Kbd>
          <RegistryIcon lucide='ArrowLeftIcon' />
          Left
        </Kbd>
        <Kbd>
          <RegistryIcon lucide='CircleDashedIcon' />
          Voice Enabled
        </Kbd>
      </KbdGroup>
    </div>
  );
}
