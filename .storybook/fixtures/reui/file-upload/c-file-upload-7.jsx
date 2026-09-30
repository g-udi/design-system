// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern({
  maxFiles = 10,
  maxSize = 2 * 1024 * 1024,
  // 2MB
  accept = 'image/*',
  className,
  onImagesChange,
  onUploadComplete
}) {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);
  const [visibleDefaultImages, setVisibleDefaultImages] = useState([
    {
      id: 'default-1',
      src: 'static/images/art/3.svg',
      alt: 'Product view 1'
    },
    {
      id: 'default-2',
      src: 'static/images/art/2.svg',
      alt: 'Product view 2'
    },
    {
      id: 'default-3',
      src: 'static/images/art/2.svg',
      alt: 'Product view 3'
    },
    {
      id: 'default-4',
      src: 'static/images/art/6.svg',
      alt: 'Product view 4'
    }
  ]);
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
        newImages.forEach((imageFile) => {
          simulateUpload(imageFile);
        });
      }
    },
    [images, maxFiles, simulateUpload, validateFile]
  );
  const removeImage = useCallback((id) => {
    clearInterval(uploadTimers.current.get(id));
    uploadTimers.current.delete(id);
    if (id.startsWith('default-')) {
      setVisibleDefaultImages((prev) => prev.filter((img) => img.id !== id));
      return;
    }
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
        uploadURLs.current.delete(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);
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
    <div className={cn('w-full max-w-4xl', className)}>
      {/* Image Grid - Moved to top */}
      <div className='mb-6'>
        <div className='grid grid-cols-4 gap-2.5'>
          {/* Always show all visible default images first */}
          {visibleDefaultImages.map((defaultImg) => (
            <Card
              key={defaultImg.id}
              className='bg-ui-accent/50 group/item relative flex shrink-0 items-center justify-center rounded-md p-0 shadow-none'
            >
              <img
                src={defaultImg.src}
                className='h-[120px] w-full rounded-md object-cover'
                alt={defaultImg.alt}
              />

              {/* Remove Button Overlay for default images too */}
              <Button
                aria-label='Close'
                onClick={() => removeImage(defaultImg.id)}
                variant='outline'
                size='icon'
                className='absolute end-1 top-1 size-6 rounded-control opacity-0 shadow-sm group-hover/item:opacity-100 dark:bg-zinc-800 hover:dark:bg-zinc-700'
              >
                <RegistryIcon lucide='XIcon' className='size-3.5' />
              </Button>
            </Card>
          ))}
        </div>

        {/* Show uploaded images in a separate grid below */}
        {images.length > 0 && (
          <div className='mt-4 grid grid-cols-4 gap-2.5'>
            {images.map((imageFile, index) => (
              <Card
                key={imageFile.id}
                className='bg-ui-accent/50 group/item relative flex shrink-0 items-center justify-center rounded-md p-0 shadow-none'
              >
                <img
                  src={imageFile.preview}
                  className='h-[120px] w-full rounded-md object-cover'
                  alt={`Product view ${index + 1}`}
                />

                {/* Remove Button Overlay */}
                <Button
                  aria-label='Close'
                  onClick={() => removeImage(imageFile.id)}
                  variant='outline'
                  size='icon'
                  className='absolute end-2 top-2 size-6 rounded-control opacity-0 shadow-sm group-hover/item:opacity-100 dark:bg-zinc-800 hover:dark:bg-zinc-700'
                >
                  <RegistryIcon lucide='XIcon' className='size-3.5' />
                </Button>
              </Card>
            ))}
          </div>
        )}
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
          <h3 className='text-ui-foreground mb-0.5 text-sm font-semibold'>
            Choose a file or drag & drop here.
          </h3>
          <span className='text-ui-secondary-foreground mb-3 block text-xs font-normal'>
            JPEG, PNG, up to {formatBytes(maxSize)}.
          </span>
          <Button size='sm' onClick={openFileDialog}>
            Browse File
          </Button>
        </CardContent>
      </Card>

      {/* Upload Progress Cards */}
      {images.length > 0 && (
        <div className='mt-6 space-y-3'>
          {images.map((imageFile) => (
            <Card key={imageFile.id} className='rounded-md p-0 shadow-none'>
              <CardContent className='flex items-center gap-2 p-3'>
                <div className='border-ui-border flex size-[32px] shrink-0 items-center justify-center rounded-md border'>
                  <RegistryIcon
                    lucide='ImageIcon'
                    className='text-ui-muted-foreground size-4'
                  />
                </div>
                <div className='flex w-full flex-col gap-1.5'>
                  <div className='-mt-2 flex w-full items-center justify-between gap-2.5'>
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
                    className={cn(
                      'h-1 transition-all duration-300',
                      '[&>div]:bg-zinc-950 dark:[&>div]:bg-zinc-50'
                    )}
                  />
                </div>
              </CardContent>
            </Card>
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
    </div>
  );
}
