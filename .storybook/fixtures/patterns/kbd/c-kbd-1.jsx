import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Kbd>Ctrl</Kbd>
      <Kbd>⌘K</Kbd>
      <Kbd>Ctrl + B</Kbd>
    </div>
  );
}
