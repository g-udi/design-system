'use client';
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from '@gaudi/design-system/core/Item';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const files = [
  { id: '1', name: 'document.pdf', progress: 45, status: '2m 30s' },
  { id: '2', name: 'presentation.pptx', progress: 78, status: '45s' },
  { id: '3', name: 'spreadsheet.xlsx', progress: 12, status: '5m 12s' },
  { id: '4', name: 'image.jpg', progress: 100, status: 'Complete' }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col'>
      <ItemGroup>
        {files.map((file) => (
          <Item key={file.id} size='xs' className='px-0'>
            <ItemMedia variant='icon'>
              <RegistryIcon
                lucide='FileIcon'
                className='text-ui-muted-foreground size-4'
              />
            </ItemMedia>
            <ItemContent className='min-w-0 gap-2'>
              <div className='flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1'>
                <ItemTitle className='wrap-anywhere'>{file.name}</ItemTitle>
                <span className='text-ui-muted-foreground text-xs'>{file.status}</span>
              </div>
              <Progress value={file.progress} className='h-1' aria-label={`Upload progress for ${file.name}`} />
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
