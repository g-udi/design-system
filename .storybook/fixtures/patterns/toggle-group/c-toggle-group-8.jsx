import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Single-choice switches: icon-only where the glyph is unambiguous, icon and label where it is not.
const groups = [
  { label: 'Text alignment', value: 'left', options: [['left', 'Align left', 'AlignLeftIcon'], ['center', 'Align center', 'AlignCenterIcon'], ['right', 'Align right', 'AlignRightIcon'], ['justify', 'Justify', 'MenuIcon']] },
  { label: 'View', value: 'list', variant: 'outline', options: [['list', 'List view', 'ListIcon'], ['grid', 'Grid view', 'LayoutGridIcon'], ['board', 'Board view', 'Columns2Icon']] },
  { label: 'Columns', value: '2', variant: 'outline', options: [['1', '1 column', 'SquareIcon'], ['2', '2 columns', 'Columns2Icon'], ['3', '3 columns', 'Columns3Icon'], ['4', '4 columns', 'LayoutGridIcon']] }
];
const labelled = [
  { label: 'Theme', value: 'system', options: [['light', 'Light', 'SunIcon'], ['dark', 'Dark', 'MoonIcon'], ['system', 'System', 'MonitorIcon']] },
  { label: 'Sort', value: 'asc', size: 'sm', options: [['asc', 'Ascending', 'ArrowUpIcon'], ['desc', 'Descending', 'ArrowDownIcon']] }
];

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col items-start gap-3'>
      <div className='flex flex-wrap items-center gap-3'>
        {groups.map(({ label, value, variant, options }) => (
          <ToggleGroup key={label} type='single' variant={variant} spacing={variant ? 0 : 1} defaultValue={value} aria-label={label}>
            {options.map(([key, name, icon]) => (
              <ToggleGroupItem key={key} value={key} aria-label={name}><RegistryIcon lucide={icon} /></ToggleGroupItem>
            ))}
          </ToggleGroup>
        ))}
      </div>
      <div className='flex flex-wrap items-center gap-3'>
        {labelled.map(({ label, value, size, options }) => (
          <ToggleGroup key={label} type='single' variant='outline' size={size} spacing={0} defaultValue={value} aria-label={label}>
            {options.map(([key, name, icon]) => (
              <ToggleGroupItem key={key} value={key}><RegistryIcon lucide={icon} />{name}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        ))}
      </div>
    </div>
  );
}
