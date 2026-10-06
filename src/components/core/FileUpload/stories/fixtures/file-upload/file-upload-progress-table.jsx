'use client';
import { useEffect, useState } from 'react';
import {
  formatBytes,
  useFileUpload
} from '@gaudi/design-system/core/FileUpload';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@gaudi/design-system/core/Banner';
import { Badge } from '@gaudi/design-system/core/Pill';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  TableRoot as Table,
  TableBodyPrimitive as TableBody,
  TableCellPrimitive as TableCell,
  TableHeadPrimitive as TableHead,
  TableHeader,
  TableRowPrimitive as TableRow
} from '@gaudi/design-system/mdx/Table';
import { AttachmentMedia } from '@gaudi/design-system/core/Attachment';
import { ProgressRing } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
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
      type: 'application/pdf'
    },
    {
      id: 'default-doc-2',
      name: 'intro.zip',
      size: 252846,
      type: 'application/zip'
    },
    {
      id: 'default-doc-3',
      name: 'conclusion.xlsx',
      size: 353126,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    {
      id: 'default-doc-4',
      name: 'package.json',
      size: 697,
      type: 'application/json'
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
          const increment = 20;
          const newProgress = Math.min(file.progress + increment, 100);
          if (newProgress >= 100) {
            return {
              ...file,
              progress: 100,
              status: 'completed',
              error: undefined
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
  const getFileTypeLabel = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('excel') || type.includes('sheet')) return 'Excel';
    if (type.includes('word') || type.includes('doc')) return 'Word';
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
              'bg-ui-muted flex size-12 items-center justify-center rounded-control transition-colors',
              isDragging
                ? 'border-ui-primary bg-ui-primary/10'
                : 'border-ui-muted-foreground/25'
            )}
          >
            <RegistryIcon
              lucide='UploadIcon'
              className='text-ui-muted-foreground size-5'
            />
          </div>

          <div className='space-y-1'>
            <p className='text-sm font-medium'>
              Drop files here or{' '}
              <Button
                variant='link'
                size='sm'
                onClick={openFileDialog}
                className='h-auto p-0 text-sm'
              >
                browse files
              </Button>
            </p>
            <p className='text-ui-muted-foreground text-xs'>
              Progress is simulated locally. Maximum file size: {formatBytes(maxSize)} • Maximum files:{' '}
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
                <RegistryIcon lucide='CloudUploadIcon' className='size-4' />
                Add files
              </Button>
              <Button onClick={clearFiles} variant='outline' size='sm'>
                <RegistryIcon lucide='Trash2Icon' className='size-4' />
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
                            <ProgressRing value={fileItem.progress} label={`Uploading ${fileItem.file.name}`} size='md' />
                          ) : (
                            <AttachmentMedia file={fileItem.file} variant='icon' className='size-8' />
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
                            asChild
                            size='icon'
                            variant='ghost'
                            className='size-8'
                          >
                            <a href={fileItem.preview} download={fileItem.file.name} aria-label={`Download ${fileItem.file.name}`}>
                              <RegistryIcon lucide='DownloadIcon' className='size-3.5' />
                            </a>
                          </Button>
                        )}
                        {fileItem.status === 'error' ? (
                          <Button
                            aria-label={`Retry ${fileItem.file.name}`}
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
                            aria-label={`Remove ${fileItem.file.name}`}
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
