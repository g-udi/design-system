'use client';
import { CardTitle, CardRoot } from '@gaudi/design-system/core/Card';
import { MetaSeparator } from '@gaudi/design-system/core/Separator';
import Loader from '@gaudi/design-system/core/Loader';
import { useEffect, useState } from 'react';
import { formatBytes, FileUploadDropzone, useFileUpload } from '@gaudi/design-system/core/FileUpload';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@gaudi/design-system/core/EmptyState';
import { IconTile } from '@gaudi/design-system/core/Icon';
import { ProgressRing } from '@gaudi/design-system/core/Progress';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@gaudi/design-system/core/Banner';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern({
  maxSize = 5 * 1024 * 1024,
  // 5MB default
  accept = 'image/jpeg,image/png,image/webp',
  className,
  onImageChange
}) {
  const defaultCoverImage = {
    id: 'default-cover',
    name: 'cover-image.jpg',
    size: 2048e3,
    type: 'image/jpeg',
    url: 'static/images/art/0.svg'
  };
  const [imageLoading, setImageLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [upload, setUpload] = useState({ progress: 0, status: 'idle' });
  const [{ files, errors }, {
    clearFiles, dropzoneProps,
    openFileDialog, getInputProps
  }] = useFileUpload({
    maxFiles: 1, maxSize, accept, multiple: false, initialFiles: [defaultCoverImage],
    onFilesChange: (next) => onImageChange?.(next[0]?.file ?? null),
    onFilesAdded: ([entry]) => {
      setImageLoading(true);
      setUpload({ progress: 0, status: 'uploading' });
      setRequest({ id: entry.id, fail: true });
    }
  });
  const coverImage = files[0];
  useEffect(() => {
    if (!request) return;
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(progress + 20, 100);
      const finished = progress === 100;
      setUpload({ progress, status: finished ? (request.fail ? 'error' : 'success') : 'uploading' });
      if (finished) clearInterval(timer);
    }, 150);
    return () => clearInterval(timer);
  }, [request]);
  const removeCoverImage = () => {
    setRequest(null);
    clearFiles();
    setImageLoading(false);
    setUpload({ progress: 0, status: 'idle' });
  };
  const retryUpload = () => {
    if (!coverImage) return;
    setUpload({ progress: 0, status: 'uploading' });
    setRequest({ id: coverImage.id, fail: false });
  };
  const isUploading = upload.status === 'uploading';
  const uploadError = upload.status === 'error' ? 'Simulated interruption. Retry to complete this local demo.' : null;
  const hasImage = coverImage && coverImage.preview;
  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      {/* Cover Upload Area */}
      <FileUploadDropzone {...dropzoneProps}
        className={cn('group relative block overflow-hidden rounded-xl p-0', hasImage && 'border-solid')}
      >
        {/* Hidden file input */}
        <input {...getInputProps({ 'aria-label': 'Choose cover image' })} className='sr-only' />

        {hasImage ? (
          <>
            {/* Cover Image Display */}
            <div className='relative aspect-21/9 w-full'>
              {/* Loading placeholder */}
              {imageLoading && (
                <div className='bg-ui-muted absolute inset-0 flex items-center justify-center gap-2 text-sm text-text-muted'>
                  <Loader label='Loading cover image' size='sm' />
                  Loading image…
                </div>
              )}

              {/* Actual image */}
              <img
                src={coverImage.preview}
                alt='Cover'
                className={cn(
                  'h-full w-full object-cover transition-opacity duration-300',
                  imageLoading ? 'opacity-0' : 'opacity-100'
                )}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />

              {/* Keep actions discoverable on touch and visible during keyboard focus. */}
              <div className='absolute inset-0 bg-black/0 transition-colors duration-200 [@media(hover:none)]:bg-black/40 [@media(pointer:coarse)]:bg-black/40 group-hover:bg-black/40 group-focus-within:bg-black/40' />

              {/* Action buttons overlay */}
              <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 [@media(hover:none)]:opacity-100 [@media(pointer:coarse)]:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100'>
                <div className='flex gap-2'>
                  <Button onClick={openFileDialog} size='sm' variant='outline'>
                    <RegistryIcon lucide='UploadIcon' />
                    Change Cover
                  </Button>
                  <Button onClick={removeCoverImage} size='sm'>
                    <RegistryIcon lucide='XIcon' />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Upload progress */}
              {isUploading && (
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40'>
                  <CardRoot variant='outline' radius='lg' padding='md'>
                    <ProgressRing value={upload.progress} size='lg' label={`Uploading ${coverImage.file.name}`} showValue />
                  </CardRoot>
                </div>
              )}
            </div>
          </>
        ) : (
          <Empty className='min-h-48 gap-4 p-6'>
            <EmptyHeader>
              <IconTile variant='muted' size='xl' aria-hidden='true' className='mb-2 size-16 rounded-full bg-ui-primary/10 text-ui-primary'>
                <RegistryIcon lucide='CloudUploadIcon' className='size-8' />
              </IconTile>
              <EmptyTitle as='h3' className='text-lg font-semibold'>Add a cover image</EmptyTitle>
              <EmptyDescription>
                Drag and drop an image here, or click to browse
              </EmptyDescription>
              <p className='text-ui-muted-foreground text-xs'>
                Recommended size: 1200x514px <MetaSeparator /> Max size: {formatBytes(maxSize)}
              </p>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={openFileDialog} variant='outline' size='sm'>
                <RegistryIcon lucide='ImageIcon' />
                Browse Files
              </Button>
            </EmptyContent>
          </Empty>
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

      {/* Upload Error */}
      {uploadError && (
        <Alert variant='destructive' className='mt-5'>
          <RegistryIcon lucide='CircleAlertIcon' />
          <AlertTitle>Upload failed</AlertTitle>
          <AlertDescription>
            <p>{uploadError}</p>
            <Button onClick={retryUpload} size='sm'>
              Retry Upload
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {upload.status === 'success' && <p role='status'>Cover image ready locally.</p>}

      {/* Upload Tips */}
      <CardRoot as='section' variant='soft' radius='lg' padding='none' className='p-4'>
        <CardTitle as='h4' className='mb-2 text-sm font-medium'>Cover image tips</CardTitle>
        <ul className='text-ui-muted-foreground list-disc space-y-1 ps-4 text-xs'>
          <li>Pick an image that still reads when cropped to a thumbnail</li>
          <li>Wide images (about 21:9) fill the article header best</li>
          <li>Keep faces and text away from the edges</li>
          <li>Accepted file types: {accept}</li>
          <li>Progress is simulated; the first attempt fails so you can try recovery.</li>
        </ul>
      </CardRoot>
    </div>
  );
}
