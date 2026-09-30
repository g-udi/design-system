'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import {
  Sortable,
  SortableItem,
  SortableItemHandle
} from '../../../../src/components/core/Sortable/parts/sortable-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  accept = 'image/*',
  className,
  onImagesChange,
  onUploadComplete
}) {
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);
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
  const createSortableImage = useCallback(
    (imageFile) => ({
      id: imageFile.id,
      src: imageFile.preview,
      alt: imageFile.file.name,
      type: 'uploaded'
    }),
    []
  );
  useEffect(() => {
    setAllImages((prev) => prev.filter((item) => item && item.id));
    setImages((prev) => prev.filter((item) => item && item.id));
  }, []);
  const uploadTimers = useRef(new Map());
  const uploadURLs = useRef(new Set());
  const completedBatch = useRef('');
  useEffect(() => {
    const timers = uploadTimers.current;
    const urls = uploadURLs.current;
    return () => {
      timers.forEach(clearInterval);
      urls.forEach((url) => URL.revokeObjectURL(url));
      timers.clear();
      urls.clear();
    };
  }, []);
  useEffect(() => {
    onImagesChange?.(images);
    const batch = images.map((image) => image.id).join(',');
    if (
      images.length &&
      images.every((image) => image.status === 'completed') &&
      batch !== completedBatch.current
    ) {
      completedBatch.current = batch;
      onUploadComplete?.(images);
    }
  }, [images, onImagesChange, onUploadComplete]);
  const simulateUpload = useCallback((imageFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(100, progress + 20);
      setImages((previous) =>
        previous.map((image) =>
          image.id === imageFile.id
            ? {
                ...image,
                progress,
                status: progress === 100 ? 'completed' : 'uploading'
              }
            : image
        )
      );
      if (progress === 100) {
        clearInterval(interval);
        uploadTimers.current.delete(imageFile.id);
      }
    }, 100);
    uploadTimers.current.set(imageFile.id, interval);
  }, []);
  const validateFile = useCallback(
    (file) => {
      if (!file.type.startsWith('image/')) {
        return 'File must be an image';
      }
      if (file.size > maxSize) {
        return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
      }
      if (images.length >= maxFiles) {
        return `Maximum ${maxFiles} files allowed`;
      }
      return null;
    },
    [images.length, maxFiles, maxSize]
  );
  const addImages = useCallback(
    (files) => {
      const newImages = [];
      const newErrors = [];
      Array.from(files).forEach((file) => {
        const error =
          images.length + newImages.length >= maxFiles
            ? `Maximum ${maxFiles} files allowed`
            : validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
          return;
        }
        const imageFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: 'uploading'
        };
        uploadURLs.current.add(imageFile.preview);
        newImages.push(imageFile);
      });
      if (newErrors.length > 0) {
        setErrors((prev) => [...prev, ...newErrors]);
      }
      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        const newSortableImages = newImages.map(createSortableImage);
        setAllImages((prev) => [...prev, ...newSortableImages]);
        newImages.forEach((imageFile) => {
          simulateUpload(imageFile);
        });
      }
    },
    [images, maxFiles, simulateUpload, validateFile, createSortableImage]
  );
  const removeImage = useCallback(
    (id) => {
      clearInterval(uploadTimers.current.get(id));
      uploadTimers.current.delete(id);
      setAllImages((prev) => prev.filter((img) => img.id !== id));
      const uploadedImage = images.find((img) => img.id === id);
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage.preview);
        uploadURLs.current.delete(uploadedImage.preview);
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    },
    [images]
  );
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        addImages(files);
      }
    },
    [addImages]
  );
  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = accept;
    input.onchange = (e) => {
      const target = e.target;
      if (target.files) {
        addImages(target.files);
      }
    };
    input.click();
  }, [accept, addImages]);
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  return (
    <div className={cn('mx-auto w-full max-w-2xl', className)}>
      {/* Instructions */}
      <div className='mb-3 text-center'>
        <p className='text-ui-muted-foreground text-sm'>
          Upload up to {maxFiles} images (JPG, PNG, GIF, WebP, max{' '}
          {formatBytes(maxSize)} each). <br />
          Drag and drop images to reorder.
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
                  className='absolute start-2 top-2 cursor-grab opacity-0 group-hover/item:opacity-100 active:cursor-grabbing'
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
                <div className='absolute end-2 top-2 flex gap-1 opacity-0 group-hover/item:opacity-100 focus-within:opacity-100'>
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
          <div className='border-ui-border mx-auto mb-3 flex size-[32px] items-center justify-center rounded-full border'>
            <RegistryIcon lucide='CloudUploadIcon' className='size-4' />
          </div>
          <h3 className='text-ui-foreground mb-0.5 text-sm font-medium'>
            Choose a file or drag & drop here.
          </h3>
          <span className='text-ui-muted-foreground mb-3 block text-xs font-normal'>
            JPEG, PNG, up to {formatBytes(maxSize)}.
          </span>
          <Button size='sm' onClick={openFileDialog}>
            Browse File
          </Button>
        </CardContent>
      </Card>

      {/* Upload Progress Cards */}
      {images.length > 0 && (
        <div className='mt-3 space-y-2'>
          {images.map((imageFile) => (
            <Card key={imageFile.id} className='rounded-md shadow-none'>
              <CardContent className='flex items-center gap-2 p-2.5'>
                <div className='border-ui-border flex size-[32px] shrink-0 items-center justify-center rounded-md border'>
                  <RegistryIcon
                    lucide='ImageIcon'
                    className='text-ui-muted-foreground size-4'
                  />
                </div>
                <div className='flex w-full flex-col gap-1.5'>
                  <div className='flex w-full items-center justify-between gap-2'>
                    <div className='flex items-center gap-2.5'>
                      <span className='text-ui-foreground text-xs leading-none font-medium'>
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
