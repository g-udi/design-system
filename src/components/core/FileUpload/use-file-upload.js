'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatBytes, selectFiles } from './fileSelection.js';
import { mergeRefs } from '../../../hooks/state/merged-refs-model.js';

const isLocalFile = (file) => typeof File !== 'undefined' && file instanceof File;
const revokePreview = (entry) => {
  if (entry.preview && isLocalFile(entry.file)) URL.revokeObjectURL(entry.preview);
};
const toEntry = (file) =>
  isLocalFile(file)
    ? { file, id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, preview: URL.createObjectURL(file) }
    : { file, id: file.id, preview: file.url };

/**
 * Headless state for custom upload surfaces: validated entries with preview URLs, drag state and error text.
 * `FileUpload` uses the same accept rules through `selectFiles`.
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
  const filesRef = useRef(state.files);
  const inputRef = useRef(null);
  useEffect(() => () => filesRef.current.forEach(revokePreview), []);
  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const commitFiles = useCallback(
    (files, errors = []) => {
      const previous = filesRef.current;
      filesRef.current = files;
      previous.filter((entry) => !files.includes(entry)).forEach(revokePreview);
      setState((prev) => ({ ...prev, files, errors }));
      // Callbacks and URL cleanup run once per action, outside React's replayable state updater.
      onFilesChange?.(files);
    },
    [onFilesChange]
  );

  const clearFiles = useCallback(() => {
    commitFiles([]);
    resetInput();
  }, [commitFiles]);

  const addFiles = useCallback(
    (newFiles) => {
      if (!newFiles?.length) return;
      const current = filesRef.current;
      const selected = selectFiles(
        current.map((entry) => entry.file),
        Array.from(newFiles),
        { accept, maxFiles, maxSize, multiple }
      );
      const errors = selected.rejected.map(({ file, reason }) => {
        if (reason === 'size') return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`;
        if (reason === 'type') return `File "${file.name}" is not an accepted file type.`;
        return `You can only upload a maximum of ${multiple ? maxFiles : 1} files.`;
      });
      const added = [];
      const files = selected.files.map((file) => {
        const existing = current.find((entry) => entry.file === file);
        if (existing) return existing;
        const entry = toEntry(file);
        added.push(entry);
        return entry;
      });
      if (errors.length) onError?.(errors);
      if (added.length) {
        commitFiles(files, errors);
        onFilesAdded?.(added);
      } else {
        setState((prev) => ({ ...prev, errors }));
      }
      resetInput();
    },
    [accept, maxFiles, maxSize, multiple, commitFiles, onError, onFilesAdded]
  );

  const removeFile = useCallback(
    (id) => commitFiles(filesRef.current.filter((entry) => entry.id !== id)),
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
      onChange: (event) => {
        props.onChange?.(event);
        if (!event.defaultPrevented) handleFileChange(event);
      },
      accept: props.accept || accept,
      multiple: props.multiple !== undefined ? props.multiple : multiple,
      ref: mergeRefs(inputRef, props.ref)
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
