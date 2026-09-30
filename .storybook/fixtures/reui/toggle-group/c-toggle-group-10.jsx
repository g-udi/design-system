// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup type='single' defaultValue='light' variant='outline'>
        <ToggleGroupItem value='light' aria-label='Light theme'>
          <RegistryIcon lucide='SunIcon' />
          Light
        </ToggleGroupItem>
        <ToggleGroupItem value='dark' aria-label='Dark theme'>
          <RegistryIcon lucide='MoonIcon' />
          Dark
        </ToggleGroupItem>
        <ToggleGroupItem value='system' aria-label='System theme'>
          <RegistryIcon lucide='MonitorIcon' />
          System
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
