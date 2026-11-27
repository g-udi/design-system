'use client';
import { IconTile } from '@gaudi/design-system/core/Icon';
import {
  formatBytes,
  FileUploadDropzone, useFileUpload
} from '@gaudi/design-system/core/FileUpload';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@gaudi/design-system/core/Banner';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern({
  maxFiles = 3,
  maxSize = 2 * 1024 * 1024,
  // 2MB
  accept = 'image/*',
  multiple = true,
  className,
  onFilesChange
}) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
      dropzoneProps,
      openFileDialog,
      getInputProps
    }
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    onFilesChange
  });
  const isImage = (file) => {
    return file.type?.startsWith('image/');
  };
  return (
    <div className={cn('w-full max-w-lg', className)}>
      {/* Compact Upload Area */}
      <FileUploadDropzone {...dropzoneProps}
        className='flex flex-wrap items-center gap-3 rounded-lg p-4 text-start'
      >
        <input {...getInputProps()} className='sr-only' />

        {/* Upload Button */}
        <Button
          onClick={openFileDialog}
          size='sm'
          className={cn(
            'transition-transform duration-200 ease-out motion-reduce:transition-none',
            isDragging && 'scale-105'
          )}
        >
          <RegistryIcon lucide='PlusIcon' className='size-4' />
          Add files
        </Button>

        {/* File Previews */}
        <div className='flex min-w-0 flex-1 flex-wrap items-center gap-2'>
          {files.length === 0 ? (
            <p className='text-ui-muted-foreground text-sm'>
              Drop files here or click to browse (max {maxFiles} files)
            </p>
          ) : (
            files.map((fileItem) => (
              <div key={fileItem.id} className='group/item relative shrink-0'>
                {isImage(fileItem.file) && fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    className='size-12 rounded-lg border object-cover'
                    title={`${fileItem.file.name} (${formatBytes(fileItem.file.size)})`}
                  />
                ) : (
                  <IconTile aria-hidden='true' size='lg' className='bg-ui-muted' title={`${fileItem.file.name} (${formatBytes(fileItem.file.size)})`}>
                    <RegistryIcon
                      lucide='FileIcon'
                      className='text-ui-muted-foreground size-5'
                    />
                  </IconTile>
                )}

                {/* Remove Button */}
                <Button
                  aria-label={`Remove ${fileItem.file.name}`}
                  onClick={() => removeFile(fileItem.id)}
                  variant='outline'
                  size='icon'
                  className='absolute -end-2 -top-2 size-5 rounded-control opacity-0 shadow-md transition-opacity group-hover/item:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100'
                >
                  <RegistryIcon lucide='XIcon' className='size-3' />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* File Count */}
        {files.length > 0 && (
          <div className='text-ui-muted-foreground shrink-0 text-xs'>
            {files.length}/{maxFiles}
          </div>
        )}
      </FileUploadDropzone>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant='destructive' className='mt-5'>
          <RegistryIcon lucide='CircleAlertIcon' />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className='last:mb-0'>
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
