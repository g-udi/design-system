import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { default as Button } from '../Button/index.js';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../Field/parts/field.jsx';
import { FieldInput as Input } from '../Field/index.js';
import { Switch } from '../Switch/parts/switch.jsx';
import { cn } from '../../../utilities/cn/index.js';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, sheetOverlays } from './index.js';

const docs = getComponentDocs('Core/Sheet');
const trigger = 'Workspace settings';
const drafts = ['Notes on local-first software', 'Small tools, long lifetimes', 'Designing for real data', 'A guide to knowledge graphs'];

/**
 * The preview keeps the sheet open, non-modally, inside a stage that stands in for the page so the docs stay usable
 * while the controls change it; the stage draws the same backdrop the modal sheet would.
 */
function SettingsSheet({ onOpenChange, onSave, overlay, ...args }) {
  const [stage, setStage] = useState(null);
  const [open, setOpen] = useState(true);
  const change = (next) => {
    setOpen(next);
    onOpenChange(next);
  };
  return (
    <div ref={setStage} className='relative mx-auto h-[32rem] w-full max-w-3xl overflow-hidden rounded-lg border bg-surface-muted [transform:translateZ(0)]'>
      <div className='grid gap-2 p-3'>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-sm font-semibold'>Drafts</p>
          <Sheet modal={false} open={open} onOpenChange={change}>
            <SheetTrigger asChild>
              <Button size='sm' variant='outline'>{trigger}</Button>
            </SheetTrigger>
            {stage ? (
              <SheetContent {...args} container={stage} onInteractOutside={(event) => event.preventDefault()} className='absolute'>
                <SheetHeader>
                  <SheetTitle>{args.title}</SheetTitle>
                  <SheetDescription>{args.description}</SheetDescription>
                </SheetHeader>
                <FieldGroup className='min-h-0 flex-1 overflow-y-auto px-3'>
                  <Field>
                    <FieldLabel htmlFor='sheet-workspace'>Workspace name</FieldLabel>
                    <Input id='sheet-workspace' defaultValue='Gaudi Journal' />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='sheet-url'>Public URL</FieldLabel>
                    <Input id='sheet-url' defaultValue='journal.gaudi.dev' />
                    <FieldDescription>Readers see this address in links and previews.</FieldDescription>
                  </Field>
                  <Field orientation='horizontal'>
                    <Switch id='sheet-digest' defaultChecked />
                    <FieldLabel htmlFor='sheet-digest'>Weekly digest to subscribers</FieldLabel>
                  </Field>
                </FieldGroup>
                <SheetFooter className='flex-row justify-end border-t'>
                  <SheetClose asChild>
                    <Button variant='outline'>Cancel</Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button onClick={onSave}>Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            ) : null}
          </Sheet>
        </div>
        {drafts.map((title) => (
          <div key={title} className='rounded-md border bg-surface p-3 text-sm'>{title}</div>
        ))}
      </div>
      {open ? <div aria-hidden='true' className={cn('absolute inset-0', sheetOverlays[overlay])} /> : null}
    </div>
  );
}

export default {
  title: 'Core/Overlays & Menus/Sheet',
  id: 'core-sheet',
  component: SheetContent,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    side: ['right', 'left', 'top', 'bottom'],
    size: ['sm', 'md', 'lg', 'xl'],
    inset: 'boolean',
    overlay: ['dim', 'blur'],
    showCloseButton: 'boolean',
    title: 'text',
    description: 'text'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: {
    side: 'right',
    size: 'sm',
    inset: false,
    overlay: 'dim',
    showCloseButton: true,
    title: 'Workspace settings',
    description: 'Name, address and the weekly digest.',
    onOpenChange: fn(),
    onSave: fn()
  },
  parameters: {
    docs: {
      description: { story: 'Workspace settings in a sheet over the drafts list, which stays dimmed behind it. `side` picks the edge, `size` the width of side sheets, `inset` floats the panel off the edge with rounded corners and `overlay` dims or blurs the page. In an app the sheet is modal: focus is trapped, Escape and the backdrop close it, and focus returns to the trigger.' },
      source: playgroundSource('SheetContent', {
        imports: "import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@gaudi/design-system';",
        before: `<Sheet>\n  <SheetTrigger asChild>\n    <Button variant='outline'>${trigger}</Button>\n  </SheetTrigger>\n  `,
        after: '\n</Sheet>'
      })
    }
  },
  render: (args) => <SettingsSheet {...args} />,
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const sheet = await body.findByRole('dialog', { name: args.title });
    await expect(sheet).toHaveAttribute('data-side', args.side);
    await userEvent.click(within(sheet).getByRole('button', { name: 'Save changes' }));
    await expect(args.onSave).toHaveBeenCalledOnce();
    await waitFor(() => expect(sheet).not.toBeInTheDocument());
    await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
    const reopened = await body.findByRole('dialog', { name: args.title });
    await waitFor(() => expect(reopened).toBeVisible());
  }
};
