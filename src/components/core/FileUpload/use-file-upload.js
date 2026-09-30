'use client';
import { useCallback, useRef, useState } from 'react';
import { acceptsFile } from './fileSelection.js';

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / k ** i).toFixed(Math.max(0, decimals))) + sizes[i];
};

const isImagePreview = (entry) => entry.preview && entry.file instanceof File && entry.file.type.startsWith('image/');
const revokePreview = (entry) => {
  if (isImagePreview(entry)) URL.revokeObjectURL(entry.preview);
};
const toEntry = (file) =>
  file instanceof File
    ? { file, id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, preview: URL.createObjectURL(file) }
    : { file, id: file.id, preview: file.url };

/**
 * Headless state for custom upload surfaces: validated entries with preview URLs, drag state and error text.
 * `FileUpload` uses the same accept rules through `acceptsFile`.
 */
export const useFileUpload = (options = {}) => {
  const {
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = Number.POSITIVE_INFINITY,
    accept = '*',
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
    onError
  } = options;
  const [state, setState] = useState(() => ({
    files: initialFiles.map((file) => ({ file, id: file.id, preview: file.url })),
    isDragging: false,
    errors: []
  }));
  const inputRef = useRef(null);
  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const validateFile = useCallback(
    (file) => {
      if (file.size > maxSize) return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`;
      if (!acceptsFile(file, accept)) return `File "${file.name}" is not an accepted file type.`;
      return null;
    },
    [accept, maxSize]
  );

  const commitFiles = useCallback(
    (update, errors = []) => {
      setState((prev) => {
        const files = update(prev.files);
        onFilesChange?.(files);
        return { ...prev, files, errors };
      });
    },
    [onFilesChange]
  );

  const clearFiles = useCallback(() => {
    setState((prev) => {
      prev.files.forEach(revokePreview);
      onFilesChange?.([]);
      return { ...prev, files: [], errors: [] };
    });
    resetInput();
  }, [onFilesChange]);

  const addFiles = useCallback(
    (newFiles) => {
      if (!newFiles?.length) return;
      const incoming = Array.from(newFiles);
      const fail = (errors) => {
        onError?.(errors);
        setState((prev) => ({ ...prev, errors }));
      };
      if (multiple && state.files.length + incoming.length > maxFiles) {
        fail([`You can only upload a maximum of ${maxFiles} files.`]);
        return;
      }
      const isDuplicate = (file) =>
        multiple && state.files.some(({ file: existing }) => existing.name === file.name && existing.size === file.size);
      const errors = [];
      const valid = [];
      for (const file of incoming) {
        if (isDuplicate(file)) continue;
        const error = validateFile(file);
        if (error) errors.push(error);
        else valid.push(toEntry(file));
      }
      if (valid.length) {
        onFilesAdded?.(valid);
        commitFiles((files) => {
          if (multiple) return [...files, ...valid];
          files.forEach(revokePreview);
          return valid;
        }, errors);
      } else if (errors.length) {
        fail(errors);
      }
      resetInput();
    },
    [state.files, maxFiles, multiple, validateFile, commitFiles, onError, onFilesAdded]
  );

  const removeFile = useCallback(
    (id) => {
      commitFiles((files) => {
        const removed = files.find((entry) => entry.id === id);
        if (removed) revokePreview(removed);
        return files.filter((entry) => entry.id !== id);
      });
    },
    [commitFiles]
  );

  const clearErrors = useCallback(() => setState((prev) => ({ ...prev, errors: [] })), []);
  const setDragging = (isDragging) => setState((prev) => ({ ...prev, isDragging }));
  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = useCallback((event) => {
    stop(event);
    setDragging(true);
  }, []);
  const handleDragLeave = useCallback((event) => {
    stop(event);
    if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
  }, []);
  const handleDragOver = useCallback((event) => stop(event), []);
  const handleDrop = useCallback(
    (event) => {
      stop(event);
      setDragging(false);
      if (inputRef.current?.disabled || !event.dataTransfer.files?.length) return;
      addFiles(multiple ? event.dataTransfer.files : [event.dataTransfer.files[0]]);
    },
    [addFiles, multiple]
  );
  const handleFileChange = useCallback((event) => addFiles(event.target.files), [addFiles]);
  const openFileDialog = useCallback(() => inputRef.current?.click(), []);
  const getInputProps = useCallback(
    (props = {}) => ({
      'aria-label': 'Choose files',
      ...props,
      type: 'file',
      onChange: handleFileChange,
      accept: props.accept || accept,
      multiple: props.multiple !== undefined ? props.multiple : multiple,
      ref: inputRef
    }),
    [accept, multiple, handleFileChange]
  );

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps
    }
  ];
};
