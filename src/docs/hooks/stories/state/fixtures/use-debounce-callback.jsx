import { useState } from 'react';
import Textarea from '@gaudi/design-system/core/Textarea';
import { Field, FieldDescription, FieldLabel } from '@gaudi/design-system/core/Field';
import { useDebounceCallback } from '@gaudi/design-system/hooks/state/use-debounce-callback';

function Autosave() {
  const [ status, setStatus ] = useState('No changes');
  const [ saves, setSaves ] = useState(0);
  const save = useDebounceCallback((text) => {
    setSaves((count) => count + 1);
    setStatus(`Saved ${text.length} characters`);
  }, 800);
  return (
    <Field>
      <FieldLabel>Draft</FieldLabel>
      <Textarea rows={3} onChange={(event) => {
        setStatus('Saving…');
        save(event.target.value);
      }} onBlur={save.flush} />
      <FieldDescription><span role='status'>{status}</span> · {saves} {saves === 1 ? 'save' : 'saves'}</FieldDescription>
    </Field>
  );
}

export { Autosave };
