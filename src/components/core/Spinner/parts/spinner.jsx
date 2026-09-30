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
