import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  ButtonGroup,
  ButtonGroupSeparator
} from '@gaudi/design-system/core/ButtonGroup';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const Icon = ({ name }) => <RegistryIcon lucide={name} aria-hidden='true' />;
const iconGroups = [
  { label: 'Transform', size: 'icon', items: [['Flip horizontally', 'FlipHorizontalIcon'], ['Flip vertically', 'FlipVerticalIcon'], ['Rotate clockwise', 'RotateCwIcon']] },
  { label: 'Text alignment', size: 'icon-sm', items: [['Align left', 'AlignLeftIcon'], ['Align center', 'AlignCenterIcon'], ['Align right', 'AlignRightIcon'], ['Align justify', 'MenuIcon']] },
  { label: 'Playback', size: 'icon', items: [['Skip back', 'SkipBackIcon'], ['Play', 'PlayIcon'], ['Skip forward', 'SkipForwardIcon']] }
];
function Row({ label, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-xs text-text-muted'>{label}</span>
      <div className='flex flex-wrap items-center gap-2'>{children}</div>
    </div>
  );
}
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <Row label='Labelled, one disabled'>
        <ButtonGroup aria-label='Library'>
          <Button variant='outline'><Icon name='FileIcon' />Files</Button>
          <Button variant='outline' disabled><Icon name='FolderIcon' />Folder</Button>
          <Button variant='outline'><Icon name='TrashIcon' />Trash</Button>
        </ButtonGroup>
      </Row>
      <Row label='Icon only'>
        {iconGroups.map(({ label, size, items }) => (
          <ButtonGroup key={label} aria-label={label}>
            {items.map(([name, icon]) => (
              <Button key={name} variant='outline' size={size} aria-label={name}><Icon name={icon} /></Button>
            ))}
          </ButtonGroup>
        ))}
      </Row>
      <Row label='Icons and a badge'>
        <ButtonGroup aria-label='Document'>
          <Button variant='outline'><Icon name='FileTextIcon' /><Badge variant='warning-light'>Draft</Badge></Button>
          <Button variant='outline'><Icon name='PencilIcon' />Edit</Button>
          <Button variant='outline' size='icon' aria-label='Upload'><Icon name='UploadIcon' /></Button>
        </ButtonGroup>
      </Row>
      <Row label='Separators'>
        <ButtonGroup aria-label='Media library' className='**:data-[slot=button]:border-0'>
          <Button><Icon name='FileIcon' />Docs</Button>
          <ButtonGroupSeparator className='bg-ui-primary-foreground/20' />
          <Button><Icon name='FolderIcon' />Projects</Button>
          <ButtonGroupSeparator className='bg-ui-primary-foreground/20' />
          <Button><Icon name='ImageIcon' />Media</Button>
        </ButtonGroup>
        <ButtonGroup aria-label='Dashboard actions'>
          <Button variant='outline' size='icon-sm' aria-label='Refresh'><Icon name='RefreshCwIcon' /></Button>
          <Button variant='outline' size='sm'><Icon name='Share2Icon' />Share</Button>
          <ButtonGroupSeparator />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon-sm' aria-label='More options'><Icon name='MoreHorizontalIcon' /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-44'>
              <DropdownMenuGroup>
                <DropdownMenuItem><Icon name='PencilIcon' />Edit dashboard</DropdownMenuItem>
                <DropdownMenuItem><Icon name='CopyIcon' />Copy link</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem><Icon name='FileTextIcon' />Export CSV</DropdownMenuItem>
                <DropdownMenuItem><Icon name='ImageIcon' />Export PNG</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Icon name='SettingsIcon' />Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </Row>
    </div>
  );
}
