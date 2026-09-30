// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Kbd,
  KbdGroup
} from '../../../../src/components/core/Kbd/parts/kbd.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </div>
  );
}
