import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Textarea from '../../components/core/Textarea';
import { Field, FieldDescription, FieldLabel } from '../../components/core/Field/index.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useDebounceCallback } from './use-debounce-callback.js';

export default {
  title: 'Hooks/State/useDebounceCallback',
  id: 'hooks-state-usedebouncecallback',
  tags: ['autodocs'],
  ...hookMeta('useDebounceCallback')
};

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

export const AutosaveDraft = {
  name: 'Autosave a draft',
  parameters: example('Typing schedules one save 800ms after the last keystroke; leaving the field flushes it at once so nothing is lost. The status is a polite live region.', `
import { Field, FieldDescription, FieldLabel, Textarea } from '@gaudi/design-system';
import { useDebounceCallback } from '@gaudi/design-system/hooks';

const save = useDebounceCallback((text) => saveDraft(text).then(() => setStatus('Saved')), 800);

<Field>
  <FieldLabel>Draft</FieldLabel>
  <Textarea onChange={(event) => { setStatus('Saving…'); save(event.target.value); }} onBlur={save.flush} />
  <FieldDescription><span role='status'>{status}</span></FieldDescription>
</Field>`),
  render: () => <Autosave />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Draft' }), 'Hello');
    await expect(canvas.getByText('Saving…')).toBeVisible();
    await waitFor(() => expect(canvas.getByText('Saved 5 characters')).toBeVisible(), { timeout: 2000 });
    await expect(canvas.getByText(/1 save$/)).toBeVisible();
  }
};
