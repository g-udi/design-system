import { useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadClear,
  SignaturePadUndo,
  SignaturePadRedo,
} from '@gaudi/design-system/core/SignaturePad';
import { sampleSignature } from './signatureExamples.js';

export function ControlledExample({ onChange, onStrokeStart }) {
  const [strokes, setStrokes] = useState([]);
  const [accept, setAccept] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [penOnly, setPenOnly] = useState(false);
  const api = useRef(null);
  return (
    <div className="grid w-full max-w-lg gap-3">
      <p className="text-sm font-medium">Controlled signature</p>
      <SignaturePad
        apiRef={api}
        value={strokes}
        readOnly={readOnly}
        disabled={disabled}
        pointerTypes={penOnly ? ['pen'] : undefined}
        onStrokeStart={onStrokeStart}
        onValueChange={(next) => {
          onChange?.(next);
          if (accept) setStrokes(structuredClone(next));
        }}
      >
        <SignaturePadArea aria-label="Controlled signature">
          <SignaturePadGuide />
          <SignaturePadPlaceholder />
        </SignaturePadArea>
        <div className="flex flex-wrap gap-2">
          <SignaturePadUndo />
          <SignaturePadRedo />
          <SignaturePadClear size="sm">Clear</SignaturePadClear>
        </div>
      </SignaturePad>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          aria-pressed={disabled}
          onClick={() => setDisabled(!disabled)}
        >
          Disabled
        </Button>
        <Button
          variant="outline"
          aria-pressed={!accept}
          onClick={() => setAccept(!accept)}
        >
          Refuse changes
        </Button>
        <Button
          variant="outline"
          aria-pressed={readOnly}
          onClick={() => setReadOnly(!readOnly)}
        >
          Read only
        </Button>
        <Button
          variant="outline"
          aria-pressed={penOnly}
          onClick={() => setPenOnly(!penOnly)}
        >
          Pen only
        </Button>
        <Button
          variant="outline"
          onClick={() => setStrokes(structuredClone(sampleSignature))}
        >
          Load saved ink
        </Button>
        <Button variant="outline" onClick={() => api.current?.clear()}>
          Clear through API
        </Button>
      </div>
      <p role="status" className="text-sm">
        {strokes.length} strokes
      </p>
    </div>
  );
}
