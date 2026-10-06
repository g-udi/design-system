import { PlaygroundForm } from './fixtures/PlaygroundForm.jsx';
import PlaygroundFormSource from './fixtures/PlaygroundForm.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Button from '../../../core/Button';

import { EditableField, FormErrorSummary } from '../Forms';

const docs = getComponentDocs('Blocks/Forms');

export default {
  title: 'Blocks/Forms',
  id: 'blocks-forms',
  component: FormErrorSummary,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    validateOn: ['blur', 'submit'],
    layout: ['stacked', 'rows'],
    showSummary: 'boolean',
    maxLength: ['140', '280', '600'],
    summaryTitle: 'text',
    editable: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { validateOn: 'blur', layout: 'stacked', showSummary: true, maxLength: '280', summaryTitle: '', editable: true },
  parameters: {
    docs: {
      description: {
        story: 'A contact form wired with useFormValidation. `validateOn` chooses whether errors appear on blur or only on submit, `layout` switches stacked fields for label-control rows, `showSummary` adds the FormErrorSummary that takes focus after a failed submit, `maxLength` drives the message limit and its CharacterCount, and `editable` adds an EditableField row.'
      },
      source: playgroundSource('PlaygroundForm', { imports: publicSource(PlaygroundFormSource, new URL('./fixtures/PlaygroundForm.jsx', import.meta.url)) })
    }
  },
  render: (args) => <PlaygroundForm {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    // A failed submit lists every problem and moves focus to the summary.
    const summary = await canvas.findByRole('alert', { name: /Fix 3 problems/ });
    await waitFor(() => expect(summary).toHaveFocus());
    await userEvent.click(within(summary).getByRole('link', { name: /Email/ }));
    const email = canvas.getByLabelText('Email');
    await expect(email).toHaveFocus();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(email, 'maya@example.com');
    await waitFor(() => expect(email).not.toHaveAttribute('aria-invalid'));
    // EditableField: Escape cancels and returns focus to Edit.
    await userEvent.click(canvas.getByRole('button', { name: 'Edit Display name' }));
    const control = canvas.getByLabelText('Display name');
    await userEvent.clear(control);
    await userEvent.type(control, 'Maya C.{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit Display name' })).toHaveFocus());
    await expect(canvas.getByText('Maya C.')).toBeVisible();
  }
};

export const AsyncFieldSave = {
  name: 'Continue working during a field save',
  args: { onSave: fn() },
  parameters: { docs: { description: { story: 'A numeric inline editor keeps the EditableField string callback contract while a deferred host save demonstrates pending controls and focus restoration. Finishing the simulated request from outside the field keeps focus on that control; cancelling within the field returns it to Edit.' } } },
  render: function AsyncFieldSaveExample({ onSave }) {
    const [seats, setSeats] = useState('3');
    const [pending, setPending] = useState(false);
    const request = useRef(null);
    return <div className='grid w-full max-w-xl gap-4'>
      <EditableField label='Seats' type='number' value={seats} onSave={(next) => new Promise((resolve) => {
        onSave(next);
        setPending(true);
        request.current = () => { setSeats(next); resolve(); };
      })} />
      <Button variant='outline' aria-disabled={!pending} onClick={() => { if (!pending) return; request.current?.(); request.current = null; setPending(false); }}>Finish simulated save</Button>
    </div>;
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Edit Seats' }));
    await userEvent.clear(canvas.getByLabelText('Seats'));
    await userEvent.type(canvas.getByLabelText('Seats'), '5');
    await userEvent.click(canvas.getByRole('button', { name: 'Save', exact: true }));
    await expect(canvas.getByLabelText('Seats')).toBeDisabled();
    await expect(args.onSave).toHaveBeenLastCalledWith('5');
    const finish = canvas.getByRole('button', { name: 'Finish simulated save' });
    await userEvent.click(finish);
    await waitFor(() => expect(canvas.getByText('5')).toBeVisible());
    await expect(finish).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Edit Seats' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit Seats' })).toHaveFocus());
  }
};
