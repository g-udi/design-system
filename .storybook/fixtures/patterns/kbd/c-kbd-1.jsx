import {
  Kbd,
  KbdGroup
} from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const rows = [
  { label: 'Single keys', content: [<Kbd key='ctrl'>Ctrl</Kbd>, <Kbd key='cmdk'>⌘K</Kbd>, <Kbd key='ctrlb'>Ctrl + B</Kbd>] },
  {
    label: 'Grouped',
    content: [
      <KbdGroup key='palette'><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd></KbdGroup>,
      <KbdGroup key='redo'><Kbd>⌘</Kbd><Kbd>⇧</Kbd><Kbd>Z</Kbd></KbdGroup>
    ]
  },
  {
    label: 'With icons',
    content: [
      <KbdGroup key='icons'>
        <Kbd><RegistryIcon lucide='ArrowLeftIcon' aria-hidden='true' />Left</Kbd>
        <Kbd><RegistryIcon lucide='CircleDashedIcon' aria-hidden='true' />Voice enabled</Kbd>
      </KbdGroup>
    ]
  }
];
export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3'>
      {rows.map(({ label, content }) => (
        <div key={label} className='contents'>
          <span className='text-xs text-text-muted'>{label}</span>
          <div className='flex flex-wrap items-center gap-2'>{content}</div>
        </div>
      ))}
    </div>
  );
}
