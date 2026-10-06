'use client';
import { useState } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { createVariants } from '../../../utilities/variants/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { Slot } from 'radix-ui';
import { default as Button } from '../Button/index.js';
const attachmentVariants = createVariants({
  base: 'ds-part-attachment group/attachment relative flex max-w-full min-w-0 shrink-0 flex-wrap border bg-ui-card text-ui-card-foreground transition-colors has-[>a,>button]:hover:bg-ui-muted/50 data-[state=error]:border-ui-destructive/30 data-[state=idle]:border-dashed',
  variants: {
    size: {
      default: 'ds-part-attachment-size-default',
      sm: 'ds-part-attachment-size-sm',
      xs: 'ds-part-attachment-size-xs'
    },
    orientation: {
      horizontal: 'ds-part-attachment-orientation-horizontal items-center',
      vertical: 'ds-part-attachment-orientation-vertical flex-col'
    }
  }
});
function Attachment({
  className,
  state = 'done',
  size = 'default',
  orientation = 'horizontal',
  ...props
}) {
  return (
    <div
      data-slot='attachment'
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={attachmentVariants({ size, orientation, className })}
      {...props}
    />
  );
}
const attachmentMediaVariants = createVariants({
  base: 'ds-part-attachment-media relative flex aspect-square shrink-0 items-center justify-center overflow-hidden group-data-[state=error]/attachment:bg-ui-destructive/10 group-data-[state=error]/attachment:text-ui-destructive [&_svg]:pointer-events-none',
  variants: {
    variant: {
      icon: 'ds-part-attachment-media-variant-icon',
      image:
        'ds-part-attachment-media-variant-image *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover'
    }
  },
  defaultVariants: {
    variant: 'icon'
  }
});
// A supplied MIME type takes precedence; extensions cover files without useful type metadata.
function attachmentIcon({ name = '', type, mediaType, fileType, kind }) {
  const mime = String(mediaType || fileType || type || '').split(';')[0].trim().toLowerCase();
  if (kind === 'link') return 'Globe';
  if (mime.startsWith('image/')) return 'Image';
  if (mime.startsWith('audio/')) return 'Music';
  if (mime.startsWith('video/')) return 'Video';
  if (mime === 'application/pdf') return 'FileText';
  if (/spreadsheet|excel|csv|tab-separated/.test(mime)) return 'FileSpreadsheet';
  if (/zip|gzip|compressed|tar/.test(mime)) return 'FileArchive';
  if (/^(application|text)\/(json|(?:x-)?javascript|typescript|xml|css|html|markdown|x-python|x-shellscript|sql)$/.test(mime) || /\+(json|xml)$/.test(mime)) return 'FileCode';
  if (mime.includes('/') && !['application/octet-stream', 'binary/octet-stream'].includes(mime)) return 'FileText';
  const extension = String(name).split('.').at(-1).toLowerCase();
  if (/^(png|jpe?g|gif|webp|svg|avif|heic|bmp|tiff?)$/.test(extension)) return 'Image';
  if (/^(mp3|wav|ogg|m4a|aac|flac|opus|aiff?)$/.test(extension)) return 'Music';
  if (/^(mp4|webm|mov|m4v|mkv|avi|ogv)$/.test(extension)) return 'Video';
  if (/^(csv|tsv|xlsx?|ods)$/.test(extension)) return 'FileSpreadsheet';
  if (/^(js|jsx|ts|tsx|json|md|mdx|css|html|py|sh|sql|ya?ml)$/.test(extension)) return 'FileCode';
  if (/^(zip|gz|tar|rar|7z)$/.test(extension)) return 'FileArchive';
  return 'FileText';
}

/** Optional file metadata supplies a type icon or a host-provided thumbnail; explicit children win. */
function AttachmentMedia({ className, variant, file, children, ...props }) {
  const [failedPreview, setFailedPreview] = useState(null);
  const previewUrl = children == null && variant !== 'icon' ? file?.previewUrl : null;
  const showPreview = Boolean(previewUrl && previewUrl !== failedPreview);
  const mediaVariant = children != null || !file ? (variant || 'icon') : showPreview ? 'image' : 'icon';
  return (
    <div
      data-slot='attachment-media'
      data-variant={mediaVariant}
      className={attachmentMediaVariants({ variant: mediaVariant, className })}
      {...props}
    >
      {children ?? (file ? showPreview
        ? <img src={previewUrl} alt='' onError={() => setFailedPreview(previewUrl)} />
        : <RegistryIcon lucide={attachmentIcon(file)} aria-hidden='true' />
        : null)}
    </div>
  );
}
function AttachmentContent({ className, ...props }) {
  return (
    <div
      data-slot='attachment-content'
      className={cn(
        'ds-part-attachment-content max-w-full min-w-0 flex-1',
        className
      )}
      {...props}
    />
  );
}
function AttachmentTitle({ className, ...props }) {
  return (
    <span
      data-slot='attachment-title'
      className={cn(
        'ds-part-attachment-title block max-w-full min-w-0 truncate group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer',
        className
      )}
      {...props}
    />
  );
}
function AttachmentDescription({ className, ...props }) {
  return (
    <span
      data-slot='attachment-description'
      className={cn(
        'ds-part-attachment-description block min-w-0 truncate text-ui-muted-foreground group-data-[state=error]/attachment:text-ui-destructive',
        'max-w-full',
        className
      )}
      {...props}
    />
  );
}
function AttachmentActions({ className, ...props }) {
  return (
    <div
      data-slot='attachment-actions'
      className={cn(
        'ds-part-attachment-actions flex shrink-0 items-center',
        className
      )}
      {...props}
    />
  );
}
function AttachmentAction({ className, variant, size = 'icon-xs', ...props }) {
  return (
    <Button
      data-slot='attachment-action'
      variant={variant ?? 'ghost'}
      size={size}
      className={cn('ds-part-attachment-action', className)}
      {...props}
    />
  );
}
function AttachmentTrigger({ className, asChild = false, type, ...props }) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot='attachment-trigger'
      type={asChild ? void 0 : (type ?? 'button')}
      className={cn(
        'ds-part-attachment-trigger absolute inset-0 z-10 outline-none',
        className
      )}
      {...props}
    />
  );
}
function AttachmentGroup({ className, ...props }) {
  return (
    <div
      data-slot='attachment-group'
      className={cn(
        'ds-part-attachment-group flex min-w-0 scroll-fade-x snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start',
        className
      )}
      {...props}
    />
  );
}
export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger
};
