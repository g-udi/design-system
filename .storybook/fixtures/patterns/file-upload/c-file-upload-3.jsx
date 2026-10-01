'use client';
import {
  formatBytes,
  useFileUpload
} from '../../../../src/components/core/FileUpload/use-file-upload.js';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
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
    const type = file instanceof File ? file.type : file.type;
    return type.startsWith('image/');
  };
  return (
    <div className={cn('w-full max-w-lg', className)}>
      {/* Compact Upload Area */}
      <div
        className={cn(
          'border-ui-border rounded-lg flex items-center gap-3 border border-dashed p-4 transition-colors',
          isDragging
            ? 'border-ui-primary bg-ui-primary/5'
            : 'border-ui-muted-foreground/25 hover:border-ui-muted-foreground/50'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
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
        <div className='flex flex-1 items-center gap-2'>
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
                  <div
                    className='bg-ui-muted flex size-12 items-center justify-center rounded-lg border'
                    title={`${fileItem.file.name} (${formatBytes(fileItem.file.size)})`}
                  >
                    <RegistryIcon
                      lucide='FileIcon'
                      className='text-ui-muted-foreground size-5'
                    />
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  aria-label='Close'
                  onClick={() => removeFile(fileItem.id)}
                  variant='outline'
                  size='icon'
                  className='absolute -end-2 -top-2 size-5 rounded-control opacity-0 shadow-md transition-opacity group-hover/item:opacity-100'
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
      </div>

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
