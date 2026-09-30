'use client';

import { useId, useRef, useState } from 'react';
import Button from '../Button';
import Icon from '../Icon';
import Progress from '../Progress';
import { cn } from '../../../utilities/cn';
import { selectFiles } from './fileSelection';

/** Selects local files. Transport, persisted attachments and preview URLs are host-owned. */
export default function FileUpload({
  label = 'Attachments',
  description = 'Choose files or drop them here.',
  files = [],
  onFilesChange,
  onReject,
  accept,
  multiple = false,
  maxFiles,
  maxSize,
  disabled,
  getFileState,
  onRetry,
  onCancel,
  className,
  labels = {}
}) {
  const id = useId();
  const input = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [rejections, setRejections] = useState([]);
  const add = (incoming) => {
    if (disabled) return;
    const result = selectFiles(files, Array.from(incoming), {
      accept,
      multiple,
      maxFiles,
      maxSize
    });
    setRejections(result.rejected);
    if (result.rejected.length) onReject?.(result.rejected);
    if (
      result.files.length !== files.length ||
      result.files.some((file, i) => file !== files[i])
    )
      onFilesChange?.(result.files);
  };
  return (
    <div className={cn('ds-upload', className)}>
      <span className='ds-label' id={`${id}-label`}>
        {label}
      </span>
      <div
        className='ds-dropzone'
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
      >
        <Icon name='Upload' decorative size='md' />
        <p id={`${id}-description`} className='ds-description'>
          {description}
        </p>
        <input
          ref={input}
          type='file'
          id={id}
          className='sr-only'
          tabIndex={-1}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-description`}
          onChange={(e) => {
            add(e.target.files);
            e.target.value = '';
          }}
        />
        <Button
          variant='outline'
          tone='neutral'
          size='sm'
          disabled={disabled}
          onClick={() => input.current?.click()}
        >
          {labels.choose || 'Choose files'}
        </Button>
      </div>
      {rejections.length > 0 && (
        <ul role='alert' className='ds-error'>
          {rejections.map(({ file, reason }, i) => (
            <li key={i}>
              {file.name}:{' '}
              {labels[reason] ||
                {
                  type: 'file type is not supported.',
                  size: 'file exceeds the size limit.',
                  count: 'file count limit reached.'
                }[reason]}
            </li>
          ))}
        </ul>
      )}
      {files.length > 0 && (
        <ul className='ds-upload-list' aria-label={label}>
          {files.map((file, i) => {
            const state = getFileState?.(file) || {};
            const uploading = state.status === 'uploading';
            return (
              <li key={i}>
                <Icon name='FileText' decorative size='sm' />
                <div className='ds-upload-file'>
                  <span className='ds-label'>{file.name}</span>
                  <span className='ds-description'>
                    {new Intl.NumberFormat(undefined, {
                      style: 'unit',
                      unit: 'kilobyte',
                      maximumFractionDigits: 1
                    }).format(file.size / 1024)}
                  </span>
                  {uploading && (
                    <Progress
                      label={labels.uploading || 'Uploading'}
                      value={state.progress}
                    />
                  )}
                  {state.status === 'error' && (
                    <p role='alert' className='ds-error'>
                      {state.error ||
                        labels.error ||
                        'Upload failed. Try again.'}
                    </p>
                  )}
                  {state.status === 'success' && (
                    <span className='ds-description'>
                      {labels.success || 'Uploaded'}
                    </span>
                  )}
                </div>
                <div className='ds-actions'>
                  {state.status === 'error' && onRetry && (
                    <Button
                      size='xs'
                      variant='ghost'
                      disabled={disabled}
                      onClick={() => onRetry(file)}
                    >
                      {labels.retry || 'Retry'}
                    </Button>
                  )}
                  {uploading ? (
                    onCancel && (
                      <Button
                        size='xs'
                        variant='ghost'
                        disabled={disabled}
                        onClick={() => onCancel(file)}
                      >
                        {labels.cancel || 'Cancel'}
                      </Button>
                    )
                  ) : (
                    <Button
                      size='xs'
                      variant='ghost'
                      tone='neutral'
                      disabled={disabled}
                      aria-label={`${labels.remove || 'Remove'} ${file.name}`}
                      onClick={() =>
                        onFilesChange?.(files.filter((_, index) => i !== index))
                      }
                    >
                      <Icon name='X' decorative size='xs' />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
