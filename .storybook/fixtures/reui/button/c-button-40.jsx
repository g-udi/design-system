// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Kbd,
  KbdGroup
} from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='outline' aria-label='Search (Command K)'>
      <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
      <span>Search</span>
      <KbdGroup aria-hidden='true'>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </Button>
  );
}
