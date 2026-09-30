// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern({
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  // 5MB
  accept = 'image/*',
  multiple = true,
  className,
  onFilesChange
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingImages, setLoadingImages] = useState({});
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const defaultImages = [
    {
      id: 'default-1',
      name: 'avatar-1.png',
      size: 44608,
      type: 'image/png',
      url: 'https://picsum.photos/1000/800?random=1'
    },
    {
      id: 'default-2',
      name: 'avatar-2.png',
      size: 42144,
      type: 'image/png',
      url: 'https://picsum.photos/1000/800?random=2'
    },
    {
      id: 'default-3',
      name: 'avatar-2.png',
      size: 42144,
      type: 'image/png',
      url: 'https://picsum.photos/1000/800?random=3'
    }
  ];
  const [
    { files, isDragging, errors },
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
    initialFiles: defaultImages,
    onFilesChange
  });
  const isImage = (file) => {
    const type = file instanceof File ? file.type : file.type;
    return type.startsWith('image/');
  };
  return (
    <div className={cn('w-full max-w-4xl', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-lg border border-dashed p-8 text-center transition-colors',
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
              'flex h-16 w-16 items-center justify-center rounded-control',
              isDragging ? 'bg-ui-primary/10' : 'bg-ui-muted'
            )}
          >
            <RegistryIcon
              lucide='ImageIcon'
              className={cn(
                'h-5 w-5',
                isDragging ? 'text-ui-primary' : 'text-ui-muted-foreground'
              )}
            />
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Upload images to gallery</h3>
            <p className='text-ui-muted-foreground text-sm'>
              Drag and drop images here or click to browse
            </p>
            <p className='text-ui-muted-foreground text-xs'>
              PNG, JPG, GIF up to {formatBytes(maxSize)} each (max {maxFiles}{' '}
              files)
            </p>
          </div>

          <Button onClick={openFileDialog}>
            <RegistryIcon lucide='UploadIcon' className='h-4 w-4' />
            Select images
          </Button>
        </div>
      </div>

      {/* Gallery Stats */}
      {files.length > 0 && (
        <div className='mt-6 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <h4 className='text-sm font-medium'>
              Gallery ({files.length}/{maxFiles})
            </h4>
            <div className='text-ui-muted-foreground text-xs'>
              Total:{' '}
              {formatBytes(
                files.reduce((acc, file) => acc + file.file.size, 0)
              )}
            </div>
          </div>
          <Button onClick={clearFiles} variant='outline' size='sm'>
            Clear all
          </Button>
        </div>
      )}

      {/* Image Grid */}
      {files.length > 0 && (
        <div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
          {files.map((fileItem) => (
            <div
              key={fileItem.id}
              className='group/item relative aspect-square'
            >
              {isImage(fileItem.file) && fileItem.preview ? (
                <>
                  {loadingImages[fileItem.id] !== false && (
                    <div className='bg-ui-muted/50 absolute inset-0 flex items-center justify-center rounded-lg border'>
                      <Spinner className='text-ui-muted-foreground size-6' />
                    </div>
                  )}
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    onLoad={() =>
                      setLoadingImages((prev) => ({
                        ...prev,
                        [fileItem.id]: false
                      }))
                    }
                    className={cn(
                      'h-full w-full rounded-lg border object-cover transition-all group-hover/item:scale-105',
                      loadingImages[fileItem.id] !== false
                        ? 'opacity-0'
                        : 'opacity-100'
                    )}
                  />
                </>
              ) : (
                <div className='bg-ui-muted flex h-full w-full items-center justify-center rounded-lg border'>
                  <RegistryIcon
                    lucide='ImageIcon'
                    className='text-ui-muted-foreground h-8 w-8'
                  />
                </div>
              )}

              {/* Overlay */}
              <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover/item:opacity-100'>
                {/* View Button */}
                {fileItem.preview && (
                  <Button
                    aria-label='Preview image'
                    onClick={() => {
                      setSelectedImage(fileItem.preview);
                      setIsPreviewLoading(true);
                    }}
                    variant='secondary'
                    size='icon'
                    className='size-7'
                  >
                    <RegistryIcon lucide='ZoomInIcon' />
                  </Button>
                )}

                {/* Remove Button */}
                <Button
                  aria-label='Close'
                  onClick={() => removeFile(fileItem.id)}
                  variant='secondary'
                  size='icon'
                  className='size-7'
                >
                  <RegistryIcon lucide='XIcon' />
                </Button>
              </div>

              {/* File Info */}
              <div className='absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100'>
                <p className='truncate text-xs font-medium'>
                  {fileItem.file.name}
                </p>
                <p className='text-xs text-gray-300'>
                  {formatBytes(fileItem.file.size)}
                </p>
              </div>
            </div>
          ))}
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

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className='[&_[data-slot=dialog-close]]:text-ui-muted-foreground [&_[data-slot=dialog-close]]:hover:text-ui-foreground [&_[data-slot=dialog-close]]:bg-ui-background w-full border-none bg-transparent p-0 shadow-none sm:max-w-xl [&_[data-slot=dialog-close]]:-end-7 [&_[data-slot=dialog-close]]:-top-7 [&_[data-slot=dialog-close]]:size-7 [&_[data-slot=dialog-close]]:rounded-full'>
          <DialogHeader className='sr-only'>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-center'>
            {selectedImage && (
              <>
                {isPreviewLoading && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Spinner className='size-8 text-white' />
                  </div>
                )}
                <img
                  src={selectedImage}
                  alt='Preview'
                  onLoad={() => setIsPreviewLoading(false)}
                  className={cn(
                    'h-full w-auto rounded-lg object-contain transition-opacity duration-300',
                    isPreviewLoading ? 'opacity-0' : 'opacity-100'
                  )}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
