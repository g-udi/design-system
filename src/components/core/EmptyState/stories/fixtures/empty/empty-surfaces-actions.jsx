import { FieldErrorPrimitive as FieldError } from '@gaudi/design-system/core/Field';
import { FileUploadDropzone, useFileUpload } from '@gaudi/design-system/core/FileUpload';
import Link from '@gaudi/design-system/core/Link';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@gaudi/design-system/core/EmptyState';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

export function Pattern() {
  const [{ files, errors }, { dropzoneProps, openFileDialog, getInputProps, clearFiles }] = useFileUpload({ accept: 'image/png,image/jpeg,image/svg+xml', multiple: true, maxSize: 10 * 1024 * 1024 });
  return (
    <div className='mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-2'>
      <Empty className='rounded-lg py-6'>
        <EmptyHeader>
          <EmptyTitle>No collections yet</EmptyTitle>
          <EmptyDescription>Group related posts into a collection to give readers a path through them.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className='flex gap-2'>
            <Button size='sm' href='/projects/new'>Create collection</Button>
            <Button size='sm' variant='outline' href='/projects/import'>Import</Button>
          </div>
          <Button size='sm' variant='link' asChild className='text-ui-muted-foreground'>
            <a href='/docs/projects'>
              Learn more <RegistryIcon lucide='ArrowUpRightIcon' />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
      <Empty className='bg-ui-muted rounded-lg py-6'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='BellOffIcon' />
          </EmptyMedia>
          <EmptyTitle>No notifications</EmptyTitle>
          <EmptyDescription>When you get notifications, they&apos;ll show up here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Empty className='rounded-lg border border-solid py-6'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='FolderIcon' />
          </EmptyMedia>
          <EmptyTitle>This shelf is empty</EmptyTitle>
          <EmptyDescription>
            No posts yet. Get started by <Link href='/posts/new'>creating your first post</Link>.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size='sm' variant='outline' href='/posts/new'>
            <RegistryIcon lucide='PlusIcon' data-icon='inline-start' />
            New post
          </Button>
        </EmptyContent>
      </Empty>
      <FileUploadDropzone as={Empty} {...dropzoneProps} className='rounded-lg py-6'>
        <input {...getInputProps()} aria-label='Choose images' className='sr-only' />
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='CloudUploadIcon' />
          </EmptyMedia>
          <EmptyTitle>Upload files</EmptyTitle>
          <EmptyDescription>Drag and drop files here, or click to browse.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant='outline' size='sm' onClick={openFileDialog}>
            <RegistryIcon lucide='PlusIcon' data-icon='inline-start' />
            Browse files
          </Button>
          <EmptyDescription className='text-xs'>PNG, JPG, SVG up to 10MB. Files remain local in this demo.</EmptyDescription>
          {files.length ? <><p role='status' className='text-xs'>{files.length} image{files.length === 1 ? '' : 's'} selected</p><Button size='sm' variant='ghost' onClick={clearFiles}>Clear files</Button></> : null}
          {errors.length ? <FieldError>{errors.join(' ')}</FieldError> : null}
        </EmptyContent>
      </FileUploadDropzone>
    </div>
  );
}
