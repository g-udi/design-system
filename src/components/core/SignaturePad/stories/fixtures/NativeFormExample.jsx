import { useId, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Label } from '@gaudi/design-system/core/Field';
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadClear,
  SignaturePadUndo,
  SignaturePadRedo,
} from '@gaudi/design-system/core/SignaturePad';

export function NativeFormExample() {
  const [result, setResult] = useState('');
  const [invalid, setInvalid] = useState(false);
  const id = useId();
  return (
    <form
      className="grid w-full max-w-lg gap-3"
      onReset={() => {
        setInvalid(false);
        setResult('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(
          new FormData(event.currentTarget).get('signature')
            ? 'Signature attached to this form.'
            : 'No signature attached.',
        );
      }}
    >
      <Label id={`${id}-label`}>
        Recipient signature <span className="text-text-muted">(required)</span>
      </Label>
      <SignaturePad
        name="signature"
        format="svg"
        required
        invalid={invalid}
        onValueChange={() => {
          setInvalid(false);
          setResult('');
        }}
        onInvalid={() => setInvalid(true)}
      >
        <SignaturePadArea
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-help`}
        >
          <SignaturePadGuide />
          <SignaturePadPlaceholder />
        </SignaturePadArea>
        <div className="flex flex-wrap gap-2">
          <SignaturePadUndo />
          <SignaturePadRedo />
          <SignaturePadClear size="sm">Clear</SignaturePadClear>
        </div>
      </SignaturePad>
      <p
        id={`${id}-help`}
        className={`text-sm ${invalid ? 'text-danger' : 'text-text-muted'}`}
      >
        {invalid
          ? 'Add your signature before continuing.'
          : 'This example keeps the form data in your browser.'}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Attach signature</Button>
        <Button type="reset" variant="outline">
          Reset form
        </Button>
      </div>
      <p role="status" className="min-h-5 text-sm">
        {result}
      </p>
    </form>
  );
}
