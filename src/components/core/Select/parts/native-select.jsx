import { cn } from '../../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function NativeSelect({ className, size = 'default', ...props }) {
  return (
    <div
      className={cn(
        'ds-part-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50',
        className
      )}
      data-slot='native-select-wrapper'
      data-size={size}
    >
      <select
        data-slot='native-select'
        data-size={size}
        className='ds-part-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed'
        {...props}
      />
      <RegistryIcon
        lucide='ChevronDownIcon'
        className='ds-part-native-select-icon pointer-events-none absolute select-none'
        aria-hidden='true'
        data-slot='native-select-icon'
      />
    </div>
  );
}
function NativeSelectOption({ className, ...props }) {
  return (
    <option
      data-slot='native-select-option'
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
}
function NativeSelectOptGroup({ className, ...props }) {
  return (
    <optgroup
      data-slot='native-select-optgroup'
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
}
export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
