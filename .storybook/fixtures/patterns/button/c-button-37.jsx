import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button className='pe-0'>
      <RegistryIcon lucide='ThumbsUpIcon' aria-hidden='true' />
      Like
      <span className='relative ms-1 px-3 text-xs font-medium  before:absolute before:inset-0 before:left-0 before:w-px before:bg-[currentColor]/60'>
        456
      </span>
    </Button>
  );
}
