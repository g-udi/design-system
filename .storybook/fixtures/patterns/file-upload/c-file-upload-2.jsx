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
  maxSize = 2 * 1024 * 1024,
  // 2MB
  className,
  onFileChange,
  defaultAvatar
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
    maxFiles: 1,
    maxSize,
    accept: 'image/*',
    multiple: false,
    onFilesChange: (files2) => {
      onFileChange?.(files2[0] || null);
    }
  });
  const currentFile = files[0];
  const previewUrl = currentFile?.preview || defaultAvatar;
  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
  };
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Avatar Preview */}
      <div className='relative'>
        <div
          className={cn(
            'group/avatar relative size-24 cursor-pointer overflow-hidden rounded-control border border-dashed transition-colors',
            isDragging
              ? 'border-ui-primary bg-ui-primary/5'
              : 'border-ui-muted-foreground/25 hover:border-ui-muted-foreground/20',
            previewUrl && 'border-solid'
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className='sr-only' />

          {previewUrl ? (
            <img
              src={previewUrl}
              alt='Avatar'
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <RegistryIcon
                lucide='UserIcon'
                className='text-ui-muted-foreground size-6'
              />
            </div>
          )}
        </div>

        {/* Remove Button - only show when file is uploaded */}
        {currentFile && (
          <Button
            size='icon'
            variant='outline'
            onClick={handleRemove}
            className='absolute end-0.5 top-0.5 z-10 size-6 rounded-control'
            aria-label='Remove avatar'
          >
            <RegistryIcon lucide='XIcon' className='size-3.5' />
          </Button>
        )}
      </div>

      {/* Picker button, file name, and limits */}
      <div className='grid justify-items-center gap-1.5 text-center'>
        <Button size='sm' variant='outline' onClick={openFileDialog} aria-haspopup='dialog'>
          <RegistryIcon lucide='UploadIcon' className='size-3.5' />
          {currentFile ? 'Change image' : 'Upload image'}
        </Button>
        <p className='max-w-56 truncate text-xs text-ui-muted-foreground' aria-live='polite'>
          {currentFile ? currentFile.file.name : `PNG or JPG up to ${formatBytes(maxSize)}`}
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant='destructive'>
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
