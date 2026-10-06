import Button from '../../../../../components/core/Button';
import Input from '../../../../../components/core/Input';
import Textarea from '../../../../../components/core/Textarea';
import { Field, FieldDescription, FieldLabel } from '../../../../../components/core/Field/index.js';
import { useSessionStorage } from '../../../../../hooks/data/use-session-storage.js';

const empty = { name: '', message: '' };

function ContactDraft() {
  const [ draft, setDraft, clearDraft ] = useSessionStorage('gaudi-docs:contact-draft', empty);
  const update = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  const restored = Boolean(draft.name || draft.message);
  return (
    <form className='grid gap-3' onSubmit={(event) => {
      event.preventDefault();
      clearDraft();
    }}>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input value={draft.name} onChange={update('name')} autoComplete='name' />
      </Field>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea value={draft.message} onChange={update('message')} rows={3} />
        <FieldDescription>{restored ? 'Your draft is kept for this tab if you reload.' : 'Start typing; a reload keeps the draft for this tab.'}</FieldDescription>
      </Field>
      <div className='flex gap-2'>
        <Button type='submit'>Send</Button>
        <Button type='button' variant='ghost' tone='neutral' onClick={clearDraft} disabled={!restored}>Clear draft</Button>
      </div>
    </form>
  );
}

export { empty, ContactDraft };
