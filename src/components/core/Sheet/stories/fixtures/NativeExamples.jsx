import { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, sheetOverlays } from '@gaudi/design-system/core/Sheet';
import { default as Button } from '@gaudi/design-system/core/Button';
import { FieldGroup, FieldRoot as Field, FieldLabelPrimitive as FieldLabel, FieldDescriptionPrimitive as FieldDescription } from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { cn } from '@gaudi/design-system/utilities/cn';

const trigger = 'Workspace settings';

const drafts = ['Notes on local-first software', 'Small tools, long lifetimes', 'Designing for real data', 'A guide to knowledge graphs'];

function SettingsSheet({ onOpenChange, onSave, overlay, ...args }) {
  const [stage, setStage] = useState(null);
  const [open, setOpen] = useState(true);
  const change = (next) => {
    setOpen(next);
    onOpenChange?.(next);
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

export const exampleDefaults = { side: 'right', size: 'sm', inset: false, overlay: 'dim', showCloseButton: true, title: 'Workspace settings', description: 'Name, address and the weekly digest.' };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <SettingsSheet {...args} />;
}

export { trigger };
