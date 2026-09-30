// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useEffect, useState } from 'react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024,
  // 50MB
  accept = '*',
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true
}) {
  const defaultFiles = [
    {
      id: 'default-card-1',
      name: 'intro.zip',
      size: 252846,
      type: 'application/zip',
      url: '/media/files/intro.zip'
    },
    {
      id: 'default-card-2',
      name: 'image-01.jpg',
      size: 1536e3,
      type: 'image/jpeg',
      url: 'static/images/art/0.svg'
    },
    {
      id: 'default-card-3',
      name: 'audio.mp3',
      size: 1536e3,
      type: 'audio/mpeg',
      url: '/media/files/audio.mp3'
    }
  ];
  const defaultUploadFiles = defaultFiles.map((file) => ({
    id: file.id,
    file: {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type
    },
    preview: file.url,
    progress: 100,
    status: 'completed'
  }));
  const [uploadFiles, setUploadFiles] = useState(defaultUploadFiles);
  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
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
    initialFiles: defaultFiles,
    onFilesChange: (newFiles) => {
      const newUploadFiles = newFiles.map((file) => {
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id
        );
        if (existingFile) {
          return {
            ...existingFile,
            ...file
            // Update any changed properties from the file
          };
        } else {
          return {
            ...file,
            progress: 0,
            status: 'uploading'
          };
        }
      });
      setUploadFiles(newUploadFiles);
      onFilesChange?.(newUploadFiles);
    }
  });
  useEffect(() => {
    if (!simulateUpload) return;
    const uploadingFiles = uploadFiles.filter(
      (file) => file.status === 'uploading'
    );
    if (uploadingFiles.length === 0) return;
    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;
          const increment = Math.random() * 20 + 5;
          const newProgress = Math.min(file.progress + increment, 100);
          if (newProgress >= 100) {
            const shouldFail = Math.random() < 0.1;
            return {
              ...file,
              progress: 100,
              status: shouldFail ? 'error' : 'completed',
              error: shouldFail ? 'Upload failed. Please try again.' : void 0
            };
          }
          return { ...file, progress: newProgress };
        })
      );
    }, 500);
    return () => clearInterval(interval);
  }, [uploadFiles, simulateUpload]);
  const removeUploadFile = (fileId) => {
    const fileToRemove = uploadFiles.find((f) => f.id === fileId);
    if (fileToRemove) {
      removeFile(fileToRemove.id);
    }
  };
  const retryUpload = (fileId) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: 'uploading',
              error: void 0
            }
          : file
      )
    );
  };
  const getFileIcon = (file) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith('image/'))
      return (
        <RegistryIcon
          lucide='ImageIcon'
          className='text-ui-muted-foreground size-4'
        />
      );
    if (type.startsWith('video/')) return <RegistryIcon lucide='VideoIcon' />;
    if (type.startsWith('audio/'))
      return <RegistryIcon lucide='HeadphonesIcon' className='size-6' />;
    if (type.includes('pdf'))
      return <RegistryIcon lucide='FileTextIcon' className='size-6' />;
    if (type.includes('word') || type.includes('doc'))
      return <RegistryIcon lucide='FileTextIcon' className='size-6' />;
    if (type.includes('excel') || type.includes('sheet'))
      return <RegistryIcon lucide='FileSpreadsheetIcon' className='size-6' />;
    if (type.includes('zip') || type.includes('rar'))
      return <RegistryIcon lucide='FileArchiveIcon' className='size-6' />;
    return <RegistryIcon lucide='FileTextIcon' />;
  };
  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'rounded-lg relative border border-dashed p-6 text-center transition-colors',
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

        <div className='flex flex-col items-center gap-4'>
          <div
            className={cn(
              'bg-ui-muted flex h-12 w-12 items-center justify-center rounded-control transition-colors',
              isDragging
                ? 'border-ui-primary bg-ui-primary/10'
                : 'border-ui-muted-foreground/25'
            )}
          >
            <RegistryIcon
              lucide='UploadIcon'
              className='text-ui-muted-foreground h-5 w-5'
            />
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-medium'>
              Drop files here or{' '}
              <button
                type='button'
                onClick={openFileDialog}
                className='text-ui-primary cursor-pointer underline-offset-4 hover:underline'
              >
                browse files
              </button>
            </p>
            <p className='text-ui-muted-foreground text-xs'>
              Maximum file size: {formatBytes(maxSize)} • Maximum files:{' '}
              {maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* Files Grid */}
      {uploadFiles.length > 0 && (
        <div className='space-y-4'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <h3 className='text-sm font-medium'>
              Files ({uploadFiles.length})
            </h3>
            <div className='flex flex-wrap gap-2'>
              <Button onClick={openFileDialog} variant='outline' size='sm'>
                <RegistryIcon lucide='CloudUploadIcon' />
                Add files
              </Button>
              <Button onClick={clearFiles} variant='outline' size='sm'>
                <RegistryIcon lucide='Trash2Icon' />
                Remove all
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-6'>
            {uploadFiles.map((fileItem) => (
              <div key={fileItem.id} className='group/item relative'>
                {/* Remove button */}
                <Button
                  aria-label='Close'
                  onClick={() => removeUploadFile(fileItem.id)}
                  variant='outline'
                  size='icon'
                  className='absolute end-1 top-1 z-10 size-6 rounded-control opacity-0 transition-opacity group-hover/item:opacity-100 dark:bg-zinc-800 hover:dark:bg-zinc-700'
                >
                  <RegistryIcon lucide='XIcon' className='size-3.5' />
                </Button>

                {/* Wrapper */}
                <div className='bg-ui-card rounded-lg relative overflow-hidden border transition-colors'>
                  {/* Image preview or file icon area */}
                  <div className='bg-ui-muted border-ui-border relative aspect-square border-b'>
                    {fileItem.file.type.startsWith('image/') &&
                    fileItem.preview ? (
                      <>
                        {/* Image cover */}
                        <img
                          src={fileItem.preview}
                          alt={fileItem.file.name}
                          className='h-full w-full object-cover'
                        />
                        {/* Progress overlay for uploading images */}
                        {fileItem.status === 'uploading' && (
                          <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                            <div className='relative'>
                              <svg
                                className='size-12 -rotate-90'
                                viewBox='0 0 48 48'
                              >
                                <circle
                                  cx='24'
                                  cy='24'
                                  r='20'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='3'
                                  className='text-ui-muted'
                                />
                                <circle
                                  cx='24'
                                  cy='24'
                                  r='20'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='3'
                                  strokeDasharray={`${2 * Math.PI * 20}`}
                                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - fileItem.progress / 100)}`}
                                  className='text-white transition-all duration-300'
                                  strokeLinecap='round'
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* File icon area for non-images */
                      <div className='text-ui-muted-foreground flex h-full items-center justify-center'>
                        {fileItem.status === 'uploading' ? (
                          <div className='relative'>
                            <svg
                              className='size-12 -rotate-90'
                              viewBox='0 0 48 48'
                            >
                              <circle
                                cx='24'
                                cy='24'
                                r='20'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='3'
                                className='text-ui-muted-foreground'
                              />
                              <circle
                                cx='24'
                                cy='24'
                                r='20'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='3'
                                strokeDasharray={`${2 * Math.PI * 20}`}
                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - fileItem.progress / 100)}`}
                                className='text-ui-primary transition-all duration-300'
                                strokeLinecap='round'
                              />
                            </svg>
                            <div className='absolute inset-0 flex items-center justify-center'>
                              {getFileIcon(fileItem.file)}
                            </div>
                          </div>
                        ) : (
                          <div className='text-4xl'>
                            {getFileIcon(fileItem.file)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* File info footer */}
                  <div className='p-3'>
                    <div className='space-y-1'>
                      <p className='truncate text-sm font-medium'>
                        {fileItem.file.name}
                      </p>
                      <div className='relative flex flex-wrap items-center justify-between gap-2 gap-2'>
                        <span className='text-ui-muted-foreground text-xs'>
                          {formatBytes(fileItem.file.size)}
                        </span>

                        {fileItem.status === 'error' && fileItem.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  aria-label='Refresh'
                                  onClick={() => retryUpload(fileItem.id)}
                                  variant='ghost'
                                  size='icon'
                                  className='text-ui-destructive hover:bg-ui-destructive/10 hover:text-ui-destructive absolute end-0 -top-1.25 size-6'
                                >
                                  <RegistryIcon
                                    lucide='RefreshCwIcon'
                                    className='size-3 opacity-100'
                                  />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Upload failed. Retry
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
