import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center p-4'>
      <Empty className='w-full max-w-md border border-dashed py-8'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='CloudUploadIcon' />
          </EmptyMedia>
          <EmptyTitle>Upload files</EmptyTitle>
          <EmptyDescription>
            Drag and drop files here, or click to browse.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant='outline' size='sm'>
            <RegistryIcon lucide='PlusIcon' data-icon='inline-start' />
            Browse Files
          </Button>
          <EmptyDescription className='text-xs'>
            PNG, JPG, SVG up to 10MB
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}
