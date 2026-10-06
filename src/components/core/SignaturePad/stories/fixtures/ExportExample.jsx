import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadClear,
  SignaturePadSave,
  SignaturePadPreview,
} from '@gaudi/design-system/core/SignaturePad';
import { sampleSignature } from './signatureExamples.js';

export function ExportExample() {
  const [result, setResult] = useState(null);
  const formats = ['png', 'jpeg', 'svg', 'json'];
  return (
    <div className="grid w-full max-w-lg gap-3">
      <p className="text-sm font-medium">Export a signature</p>
      <SignaturePad
        defaultValue={sampleSignature}
        onValueChange={() => setResult(null)}
      >
        <SignaturePadArea aria-label="Signature to export">
          <SignaturePadGuide />
          <SignaturePadPlaceholder />
        </SignaturePadArea>
        <div className="flex flex-wrap gap-2">
          {formats.map((format) => (
            <SignaturePadSave
              key={format}
              format={format}
              size="sm"
              options={{ background: '#ffffff' }}
              onSave={(value, strokes) => setResult({ format, value, strokes })}
            >
              {format.toUpperCase()}
            </SignaturePadSave>
          ))}
          <SignaturePadClear size="sm">Clear</SignaturePadClear>
        </div>
      </SignaturePad>
      <p className="text-xs text-text-muted">
        Illustrative ink. Exports use a white background and dark ink.
      </p>
      <div
        role="status"
        className="flex min-h-8 flex-wrap items-center gap-3 text-sm"
      >
        {result && (
          <>
            <span>{result.format.toUpperCase()} ready</span>
            <SignaturePadPreview
              strokes={result.strokes}
              className="h-8 w-auto"
            />
            <Button variant="outline" size="sm" asChild>
              <a
                href={
                  result.format === 'json'
                    ? `data:application/json;charset=utf-8,${encodeURIComponent(result.value)}`
                    : result.value
                }
                download={`signature.${result.format === 'jpeg' ? 'jpg' : result.format}`}
              >
                Download {result.format.toUpperCase()}
              </a>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
