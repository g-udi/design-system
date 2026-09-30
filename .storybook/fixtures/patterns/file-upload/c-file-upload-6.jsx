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
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../src/components/mdx/Table/parts/table.jsx';
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
      id: 'default-doc-1',
      name: 'document.pdf',
      size: 529254,
      type: 'application/pdf',
      url: '/media/files/document.pdf'
    },
    {
      id: 'default-doc-2',
      name: 'intro.zip',
      size: 252846,
      type: 'application/zip',
      url: '/media/files/intro.zip'
    },
    {
      id: 'default-doc-3',
      name: 'conclusion.xlsx',
      size: 353126,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      url: '/media/files/conclusion.xlsx'
    },
    {
      id: 'default-doc-4',
      name: 'package.json',
      size: 697,
      type: 'application/json',
      url: '/media/files/package.json'
    }
  ];
  const seeded = {
    'default-doc-2': { progress: 100, status: 'error', error: 'Upload failed. Please try again.' },
    'default-doc-3': { progress: 35, status: 'uploading' }
  };
  const defaultUploadFiles = defaultFiles.map((file) => ({
    id: file.id,
    file: {
      name: file.name,
      size: file.size,
      type: file.type
    },
    preview: file.url,
    // Seed one row mid-upload and one failed, so every state shows at rest.
    ...(seeded[file.id] ?? { progress: 100, status: 'completed' })
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
      onFilesChange?.(newFiles);
    }
  });
  useEffect(() => {
    if (!simulateUpload) return;
    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;
          const increment = Math.random() * 15 + 5;
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
  }, [simulateUpload]);
  const removeUploadFile = (fileId) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
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
      return <RegistryIcon lucide='ImageIcon' className='size-4' />;
    if (type.startsWith('video/'))
      return <RegistryIcon lucide='VideoIcon' className='size-4' />;
    if (type.startsWith('audio/'))
      return <RegistryIcon lucide='HeadphonesIcon' className='size-4' />;
    if (type.includes('pdf'))
      return <RegistryIcon lucide='FileTextIcon' className='size-4' />;
    if (type.includes('word') || type.includes('doc'))
      return <RegistryIcon lucide='FileTextIcon' className='size-4' />;
    if (type.includes('excel') || type.includes('sheet'))
      return <RegistryIcon lucide='FileSpreadsheetIcon' className='size-4' />;
    if (type.includes('zip') || type.includes('rar'))
      return <RegistryIcon lucide='FileArchiveIcon' className='size-4' />;
    return <RegistryIcon lucide='FileTextIcon' className='size-4' />;
  };
  const getFileTypeLabel = (file) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word') || type.includes('doc')) return 'Word';
    if (type.includes('excel') || type.includes('sheet')) return 'Excel';
    if (type.includes('zip') || type.includes('rar')) return 'Archive';
    if (type.includes('json')) return 'JSON';
    if (type.includes('text')) return 'Text';
    return 'File';
  };
  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-lg border border-dashed p-4 text-center transition-colors',
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

        <div className='flex flex-col items-center gap-3'>
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

          <div className='space-y-1'>
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

      {/* Files Table */}
      {uploadFiles.length > 0 && (
        <div className='space-y-3'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <h3 className='text-sm font-medium'>
                Files ({uploadFiles.length})
              </h3>
              {[
                ['completed', 'Completed', 'success-light'],
                ['uploading', 'Uploading', 'secondary'],
                ['error', 'Failed', 'destructive-light']
              ].map(([status, label, variant]) => {
                const count = uploadFiles.filter((file) => file.status === status).length;
                return count > 0 ? (
                  <Badge key={status} size='sm' variant={variant}>
                    {label}: {count}
                  </Badge>
                ) : null;
              })}
            </div>
            <div className='flex gap-2'>
              <Button onClick={openFileDialog} variant='outline' size='sm'>
                <RegistryIcon lucide='CloudUploadIcon' className='h-4 w-4' />
                Add files
              </Button>
              <Button onClick={clearFiles} variant='outline' size='sm'>
                <RegistryIcon lucide='Trash2Icon' className='h-4 w-4' />
                Remove all
              </Button>
            </div>
          </div>

          <div className='rounded-lg border'>
            <Table>
              <TableHeader>
                <TableRow className='text-xs'>
                  <TableHead className='h-9 ps-4'>Name</TableHead>
                  <TableHead className='h-9'>Type</TableHead>
                  <TableHead className='h-9'>Size</TableHead>
                  <TableHead className='h-9 w-[100px] ps-4'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadFiles.map((fileItem) => (
                  <TableRow key={fileItem.id}>
                    <TableCell className='py-2 ps-1.5'>
                      <div className='flex items-center gap-1'>
                        <div
                          className={cn(
                            'text-ui-muted-foreground relative flex size-8 shrink-0 items-center justify-center'
                          )}
                        >
                          {fileItem.status === 'uploading' ? (
                            <div className='relative'>
                              {/* Circular progress background */}
                              <svg
                                className='size-8 -rotate-90'
                                viewBox='0 0 32 32'
                              >
                                <circle
                                  cx='16'
                                  cy='16'
                                  r='14'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  className='text-ui-muted-foreground'
                                />
                                {/* Progress circle */}
                                <circle
                                  cx='16'
                                  cy='16'
                                  r='14'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeDasharray={`${2 * Math.PI * 14}`}
                                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - fileItem.progress / 100)}`}
                                  className='text-ui-primary transition-all duration-300'
                                  strokeLinecap='round'
                                />
                              </svg>
                              {/* File icon in center */}
                              <div className='absolute inset-0 flex items-center justify-center'>
                                {getFileIcon(fileItem.file)}
                              </div>
                            </div>
                          ) : (
                            <div className='flex size-8 items-center justify-center'>
                              {getFileIcon(fileItem.file)}
                            </div>
                          )}
                        </div>
                        <p className='flex items-center gap-1 truncate text-sm font-medium'>
                          {fileItem.file.name}
                          {fileItem.status === 'error' && (
                            <Badge variant='destructive-light' size='sm'>
                              Error
                            </Badge>
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='py-2'>
                      <Badge variant='secondary' className='text-xs'>
                        {getFileTypeLabel(fileItem.file)}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-ui-muted-foreground py-2 text-sm'>
                      {formatBytes(fileItem.file.size)}
                    </TableCell>
                    <TableCell className='py-2'>
                      <div className='flex items-center gap-1'>
                        {fileItem.preview && (
                          <Button
                            aria-label='Download'
                            size='icon'
                            variant='ghost'
                            className='size-8'
                          >
                            <RegistryIcon
                              lucide='DownloadIcon'
                              className='size-3.5'
                            />
                          </Button>
                        )}
                        {fileItem.status === 'error' ? (
                          <Button
                            aria-label='Refresh'
                            onClick={() => retryUpload(fileItem.id)}
                            variant='ghost'
                            size='icon'
                            className='text-ui-destructive hover:text-ui-destructive size-8'
                          >
                            <RegistryIcon
                              lucide='RefreshCwIcon'
                              className='size-3.5'
                            />
                          </Button>
                        ) : (
                          <Button
                            aria-label='Delete'
                            onClick={() => removeUploadFile(fileItem.id)}
                            variant='ghost'
                            size='icon'
                            className='size-8'
                          >
                            <RegistryIcon
                              lucide='Trash2Icon'
                              className='size-3.5'
                            />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
