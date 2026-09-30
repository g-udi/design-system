// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Toggle variant='outline' aria-label='Toggle bookmark'>
        <RegistryIcon
          lucide='BookmarkIcon'
          className='group-data-[state=on]/toggle:fill-ui-accent-foreground'
        />
        Bookmark
      </Toggle>
    </div>
  );
}
