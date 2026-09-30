'use client';

/**
 * Image Modal Component
 *
 * @description Full-screen modal component for displaying enlarged images.
 * Built on the bare Dialog: Escape and backdrop clicks close it, and focus stays inside while open.
 * Optimized for both desktop and mobile viewing with proper accessibility support.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useId, useRef } from 'react';

import Button from '../../core/Button';
import Dialog from '../../core/Dialog';
import Icon from '../../core/Icon';

/**
 * Renders a full-screen modal overlay for displaying enlarged images
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal should be closed
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} [props.caption] - Optional image caption
 * @returns {JSX.Element|null} Portal-rendered modal or null if closed
 *
 * @example
 * <ImageModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   src="/static/images/posts/example.svg"
 *   alt="Example diagram"
 *   caption="Figure 1: System Architecture"
 * />
 */
const ImageModal = ({ isOpen, onClose, src, alt, caption }) => {
  const captionId = useId();
  const closeButtonRef = useRef(null);

  if (!isOpen || !src || typeof document === 'undefined')
    return null;

  return (
    <Dialog
      variant='bare'
      open
      onOpenChange={ (open) => !open && onClose() }
      initialFocusRef={ closeButtonRef }
      label={ alt || 'Image preview' }
      contentProps={ caption ? { 'aria-labelledby': captionId } : undefined }
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8'
    >
      <div className='relative flex max-h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-surface shadow-2xl sm:max-h-[calc(100dvh-4rem)]'>
        <Button
          ref={ closeButtonRef }
          variant='ghost'
          tone='neutral'
          size='sm'
          onClick={ onClose }
          className='absolute right-4 top-4 z-10 size-11 rounded-control bg-surface/90 p-0 text-text-muted hover:bg-surface-muted hover:text-text'
          aria-label='Close modal'
        >
          <Icon name='X' decorative size='md' />
        </Button>

        <div className='flex min-h-0 flex-1 flex-col items-center overflow-auto p-4 pt-16 sm:p-6 sm:pt-16'>
          <img
            src={ src }
            alt={ alt || '' }
            className='max-h-[calc(100dvh-11rem)] w-full rounded-md object-contain sm:max-h-[calc(100dvh-13rem)]'
            loading='lazy'
          />

          {caption && (
            <p
              id={ captionId }
              className='mt-4 max-w-2xl text-center text-sm text-text-muted'
            >
              {caption}
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ImageModal;
