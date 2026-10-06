'use client';
import Button from '../Button/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import {
  useSignaturePad,
  useSignaturePadConfig,
} from './signaturePadContext.js';

function SignaturePadClear({
  children,
  onClick,
  disabled,
  variant = 'outline',
  size = 'icon-sm',
  ...props
}) {
  const api = useSignaturePad();
  const { labels } = useSignaturePadConfig('SignaturePadControl');
  return (
    <Button
      type="button"
      data-slot="signature-pad-clear"
      aria-label={children === undefined ? labels.clear : undefined}
      variant={variant}
      size={size}
      {...props}
      disabled={
        disabled || api.isEmpty || api.disabled || api.readOnly || api.isDrawing
      }
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        api.clear();
        api.focus();
      }}
    >
      {children ?? (
        <RegistryIcon lucide="Trash2Icon" aria-hidden="true" />
      )}
    </Button>
  );
}

function SignaturePadUndo({
  children,
  onClick,
  disabled,
  variant = 'outline',
  size = 'icon-sm',
  ...props
}) {
  const api = useSignaturePad();
  const { labels } = useSignaturePadConfig('SignaturePadControl');
  const { undoDepth } = useSignaturePadConfig('SignaturePadUndo');
  return (
    <Button
      type="button"
      data-slot="signature-pad-undo"
      aria-label={children === undefined ? labels.undo : undefined}
      variant={variant}
      size={size}
      {...props}
      disabled={
        disabled ||
        !api.canUndo ||
        api.disabled ||
        api.readOnly ||
        api.isDrawing
      }
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        api.undo();
        if (undoDepth === 1) api.focus();
      }}
    >
      {children ?? <RegistryIcon lucide="UndoIcon" aria-hidden="true" />}
    </Button>
  );
}

function SignaturePadRedo({
  children,
  onClick,
  disabled,
  variant = 'outline',
  size = 'icon-sm',
  ...props
}) {
  const api = useSignaturePad();
  const { labels } = useSignaturePadConfig('SignaturePadControl');
  const { redoDepth } = useSignaturePadConfig('SignaturePadRedo');
  return (
    <Button
      type="button"
      data-slot="signature-pad-redo"
      aria-label={children === undefined ? labels.redo : undefined}
      variant={variant}
      size={size}
      {...props}
      disabled={
        disabled ||
        !api.canRedo ||
        api.disabled ||
        api.readOnly ||
        api.isDrawing
      }
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        api.redo();
        if (redoDepth === 1) api.focus();
      }}
    >
      {children ?? <RegistryIcon lucide="RedoIcon" aria-hidden="true" />}
    </Button>
  );
}

function SignaturePadSave({
  format = 'png',
  options,
  onSave,
  children,
  onClick,
  disabled,
  variant = 'outline',
  size = 'icon-sm',
  ...props
}) {
  const api = useSignaturePad();
  const { labels } = useSignaturePadConfig('SignaturePadControl');
  return (
    <Button
      type="button"
      data-slot="signature-pad-save"
      aria-label={children === undefined ? labels.save : undefined}
      variant={variant}
      size={size}
      {...props}
      disabled={disabled || api.isEmpty || api.disabled || api.isDrawing}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onSave?.(api.serialize(format, options), api.strokes);
      }}
    >
      {children ?? <RegistryIcon lucide="SaveIcon" aria-hidden="true" />}
    </Button>
  );
}

export {
  SignaturePadClear,
  SignaturePadUndo,
  SignaturePadRedo,
  SignaturePadSave,
};
