import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import Textarea from '../../components/core/Textarea';
import { Field, FieldDescription, FieldLabel } from '../../components/core/Field/index.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useSessionStorage } from './use-session-storage.js';

export default {
  title: 'Hooks/Data/useSessionStorage',
  id: 'hooks-data-usesessionstorage',
  tags: ['autodocs'],
  ...hookMeta('useSessionStorage')
};

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

export const FormDraft = {
  name: 'Keep a form draft',
  parameters: example('A contact form keeps what was typed through a reload of this tab, and Send or Clear removes it. Session storage ends with the tab.', `
import { Button, Field, FieldLabel, Input, Textarea } from '@gaudi/design-system';
import { useSessionStorage } from '@gaudi/design-system/hooks';

export function ContactForm({ send }) {
  const [draft, setDraft, clearDraft] = useSessionStorage('contact:draft', { name: '', message: '' });
  const update = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  return (
    <form onSubmit={async (event) => { event.preventDefault(); await send(draft); clearDraft(); }}>
      <Field><FieldLabel>Name</FieldLabel><Input value={draft.name} onChange={update('name')} /></Field>
      <Field><FieldLabel>Message</FieldLabel><Textarea value={draft.message} onChange={update('message')} /></Field>
      <Button type='submit'>Send</Button>
    </form>
  );
}`),
  render: () => <ContactDraft />,
  play: async ({ canvasElement }) => {
    window.sessionStorage.removeItem('gaudi-docs:contact-draft');
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Amira');
    await waitFor(() => expect(JSON.parse(window.sessionStorage.getItem('gaudi-docs:contact-draft'))).toEqual({ name: 'Amira', message: '' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Clear draft' }));
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveValue(''));
    await expect(window.sessionStorage.getItem('gaudi-docs:contact-draft')).toBeNull();
  }
};
