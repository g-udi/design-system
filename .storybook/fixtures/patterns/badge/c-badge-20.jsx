import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Badge variant='outline'>
      <RegistryIcon lucide='CheckIcon' />
      Badge
    </Badge>
  );
}
