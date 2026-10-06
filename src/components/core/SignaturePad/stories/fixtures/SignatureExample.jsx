import { useId, useState } from 'react';
import { Label } from '@gaudi/design-system/core/Field';
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadControls,
  SignaturePadClear,
  SignaturePadUndo,
  SignaturePadRedo,
  SignaturePadSave,
  SignaturePadPreview,
} from '@gaudi/design-system/core/SignaturePad';

export function SignatureExample({ variant = 'muted', ...args }) {
  const [saved, setSaved] = useState([]);
  const label = useId();
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Label id={label}>Your signature</Label>
      <SignaturePad {...args}>
        <SignaturePadArea variant={variant} aria-labelledby={label}>
          <SignaturePadGuide />
          <SignaturePadPlaceholder />
          <SignaturePadControls>
            <SignaturePadClear />
            <SignaturePadSave
              format="json"
              onSave={(_data, strokes) => setSaved(strokes)}
            />
          </SignaturePadControls>
        </SignaturePadArea>
        <div className="flex flex-wrap items-center gap-2">
          <SignaturePadUndo />
          <SignaturePadRedo />
          <p className="text-xs text-text-muted">
            Draw with a mouse, touch, or pen.
          </p>
        </div>
      </SignaturePad>
      <div
        role="status"
        className="flex min-h-8 flex-wrap items-center gap-3 text-sm"
      >
        {saved.length > 0 && (
          <>
            <span>Saved preview</span>
            <SignaturePadPreview
              strokes={saved}
              aria-label="Saved signature"
              className="h-8 w-auto"
            />
          </>
        )}
      </div>
    </div>
  );
}
