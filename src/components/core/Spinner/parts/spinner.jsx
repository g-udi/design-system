// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cn } from '../../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function Spinner({ className, ...props }) {
  return (
    <RegistryIcon
      lucide='Loader2Icon'
      data-slot='spinner'
      role='status'
      aria-label='Loading'
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}
export { Spinner };
