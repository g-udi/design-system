'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@gaudi/design-system/core/Banner';
import {
  Sortable,
  SortableItem,
  SortableItemHandle
} from '@gaudi/design-system/core/Sortable';
import { cn } from '@gaudi/design-system/utilities/cn';
import { toast } from 'sonner';
import { formatBytes, useFileUpload } from '@gaudi/design-system/core/FileUpload';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import {
  DialogRoot as Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@gaudi/design-system/core/Dialog';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  accept = 'image/*',
  className,
  onImagesChange,
  onUploadComplete
}) {
  const [preview, setPreview] = useState(null);
  const [progressById, setProgressById] = useState({});
  const uploadTimers = useRef(new Map());
  const completedBatch = useRef('');
  const [allImages, setAllImages] = useState([
    {
      id: 'default-1',
      src: 'static/images/art/2.svg',
      alt: 'Product view 1',
      type: 'default'
    },
    {
      id: 'default-2',
      src: 'static/images/art/6.svg',
      alt: 'Product view 2',
      type: 'default'
    },
    {
      id: 'default-3',
      src: 'static/images/art/7.svg',
      alt: 'Product view 3',
      type: 'default'
    },
    {
      id: 'default-4',
      src: 'static/images/art/9.svg',
      alt: 'Product view 4',
      type: 'default'
    },
    {
      id: 'default-5',
      src: 'static/images/art/0.svg',
      alt: 'Product view 5',
      type: 'default'
    }
  ]);
  const createSortableImage = useCallback((entry) => ({ id: entry.id, src: entry.preview, alt: entry.file.name, type: 'uploaded' }), []);
  const [{ files, isDragging, errors }, { removeFile, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }] = useFileUpload({
    maxFiles, maxSize, accept, multiple: true,
    onFilesAdded: (added) => {
      setAllImages((current) => [...current, ...added.map(createSortableImage)]);
      for (const entry of added) {
        let progress = 0;
        const timer = setInterval(() => {
          progress = Math.min(100, progress + 20);
          setProgressById((current) => ({ ...current, [entry.id]: progress }));
          if (progress === 100) { clearInterval(timer); uploadTimers.current.delete(entry.id); }
        }, 100);
        uploadTimers.current.set(entry.id, timer);
      }
    }
  });
  const images = useMemo(() => files.map((entry) => ({ ...entry, progress: progressById[entry.id] ?? 0, status: progressById[entry.id] === 100 ? 'completed' : 'uploading' })), [files, progressById]);
  useEffect(() => {
    const timers = uploadTimers.current;
    return () => { timers.forEach(clearInterval); timers.clear(); };
  }, []);
  useEffect(() => {
    onImagesChange?.(images);
    const batch = images.map((entry) => entry.id).join(',');
    if (images.length && images.every((entry) => entry.status === 'completed') && completedBatch.current !== batch) {
      completedBatch.current = batch;
      onUploadComplete?.(images);
    }
  }, [images, onImagesChange, onUploadComplete]);
  const removeImage = (id) => {
    clearInterval(uploadTimers.current.get(id));
    uploadTimers.current.delete(id);
    setAllImages((current) => current.filter((entry) => entry.id !== id));
    removeFile(id);
    setProgressById((current) => { const next = { ...current }; delete next[id]; return next; });
  };
  return (
    <div className={cn('mx-auto w-full max-w-2xl', className)}>
      {/* Instructions */}
      <div className='mb-3 text-center'>
        <p className='text-ui-muted-foreground text-sm'>
          Add up to {maxFiles} images to the prepared gallery (max{' '}
          {formatBytes(maxSize)} each). <br />
          Drag and drop images to reorder. Upload progress is simulated locally.
          {images.length > 0 && ` ${images.length}/${maxFiles} uploaded.`}
        </p>
      </div>

      {/* Image Grid with Sortable */}
      <div className='mb-3'>
        {/* Combined Images Sortable */}
        <Sortable
          value={allImages.map((item) => item.id)}
          onValueChange={(newItemIds) => {
            const newAllImages = newItemIds
              .map((itemId) => {
                const existingImage = allImages.find(
                  (img) => img.id === itemId
                );
                if (existingImage) return existingImage;
                const uploadedImage = images.find((img) => img.id === itemId);
                if (uploadedImage) {
                  return createSortableImage(uploadedImage);
                }
                return null;
              })
              .filter((item) => item !== null);
            setAllImages(newAllImages);
            toast.success('Images reordered successfully!', {
              duration: 3e3
            });
          }}
          getItemValue={(item) => item}
          strategy='grid'
          className='grid auto-rows-fr grid-cols-3 gap-2 sm:grid-cols-5'
        >
          {allImages.map((item) => (
            <SortableItem key={item.id} value={item.id}>
              <div className='bg-ui-accent/50 group/item border-ui-border hover:bg-ui-accent/70 relative flex shrink-0 items-center justify-center rounded-md border shadow-none transition-all duration-200 hover:z-10 data-[dragging=true]:z-50'>
                <img
                  src={item.src}
                  className='pointer-events-none h-24 w-full rounded-md object-cover'
                  alt={item.alt}
                />

                {/* Drag Handle */}
                <SortableItemHandle
                  asChild
                  className='absolute start-2 top-2 cursor-grab opacity-0 group-hover/item:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100 active:cursor-grabbing'
                >
                  <Button
                    aria-label='Reorder'
                    variant='outline'
                    size='icon'
                    className='size-6 rounded-control'
                  >
                    <RegistryIcon
                      lucide='GripVerticalIcon'
                      className='size-3.5'
                    />
                  </Button>
                </SortableItemHandle>

                {/* Preview and remove buttons */}
                <div className='absolute end-2 top-2 flex gap-1 opacity-0 group-hover/item:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100'>
                  <Button
                    aria-label={`Preview ${item.alt}`}
                    onClick={() => setPreview(item)}
                    variant='outline'
                    size='icon'
                    className='size-6 rounded-control shadow-sm'
                  >
                    <RegistryIcon lucide='ZoomInIcon' className='size-3.5' />
                  </Button>
                  <Button
                    aria-label={`Remove ${item.alt}`}
                    onClick={() => removeImage(item.id)}
                    variant='outline'
                    size='icon'
                    className='size-6 rounded-control shadow-sm'
                  >
                    <RegistryIcon lucide='XIcon' className='size-3.5' />
                  </Button>
                </div>
              </div>
            </SortableItem>
          ))}
        </Sortable>
      </div>

      {/* Upload Area */}
      <Card
        className={cn(
          'rounded-md border-dashed shadow-none transition-colors',
          isDragging
            ? 'border-ui-primary bg-ui-primary/5'
            : 'border-ui-muted-foreground/25 hover:border-ui-muted-foreground/50'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className='text-center'>
          <input {...getInputProps({ 'aria-label': 'Choose gallery images' })} className='sr-only' />
          <div className='border-ui-border mx-auto mb-3 flex size-[32px] items-center justify-center rounded-full border'>
            <RegistryIcon lucide='CloudUploadIcon' className='size-4' />
          </div>
          <h3 className='text-ui-foreground mb-0.5 text-sm font-medium'>
            Choose a file or drag & drop here.
          </h3>
          <span className='text-ui-muted-foreground mb-3 block text-xs font-normal'>
            Accepted: {accept}. Up to {formatBytes(maxSize)}.
          </span>
          <Button size='sm' onClick={openFileDialog}>
            Browse File
          </Button>
        </CardContent>
      </Card>

      {/* Upload Progress Cards */}
      {images.length > 0 && (
        <div className='mt-3 flex flex-col gap-2'>
          {images.map((imageFile) => (
            <Card key={imageFile.id} className='rounded-md shadow-none'>
              <CardContent className='flex items-center gap-2 p-2.5'>
                <div className='border-ui-border flex size-[32px] shrink-0 items-center justify-center rounded-md border'>
                  <RegistryIcon
                    lucide='ImageIcon'
                    className='text-ui-muted-foreground size-4'
                  />
                </div>
                <div className='flex min-w-0 w-full flex-col gap-1.5'>
                  <div className='flex w-full items-center justify-between gap-2'>
                    <div className='flex min-w-0 flex-wrap items-center gap-2.5'>
                      <span className='text-ui-foreground break-all text-xs leading-snug font-medium'>
                        {imageFile.file.name}
                      </span>
                      <span className='text-ui-muted-foreground text-xs leading-none font-normal'>
                        {formatBytes(imageFile.file.size)}
                      </span>
                      {imageFile.status === 'uploading' && (
                        <p className='text-ui-muted-foreground text-xs'>
                          Uploading... {Math.round(imageFile.progress)}%
                        </p>
                      )}
                    </div>
                    <Button
                      aria-label={`Cancel ${imageFile.file.name}`}
                      onClick={() => removeImage(imageFile.id)}
                      variant='ghost'
                      size='icon'
                      className='size-6'
                    >
                      <RegistryIcon lucide='CircleXIcon' className='size-3.5' />
                    </Button>
                  </div>

                  <Progress
                    value={imageFile.progress}
                    className='h-1 transition-all duration-300'
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant='destructive' className='mt-3'>
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
      {/* Image preview */}
      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>{preview?.alt}</DialogTitle>
          </DialogHeader>
          {preview && (
            <img src={preview.src} alt={preview.alt} className='max-h-96 w-full rounded-lg object-contain' />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
