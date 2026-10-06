'use client';
import { useId, useState } from 'react';
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@gaudi/design-system/core/Select';
import {
  DialogRoot as Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@gaudi/design-system/core/Dialog';
import {
  FieldRoot as Field,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
export function Pattern() {
  const toastId = useId();
  const [framework, setFramework] = useState(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <ToastProvider id={toastId} />
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button className='w-full max-w-xs'>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Select Framework</DialogTitle>
          <DialogDescription>
            Choose your preferred framework from the list below.
          </DialogDescription>
        </DialogHeader>
        <Field className='pt-4'>
          <FieldLabel htmlFor={`${toastId}-framework-dialog`} className='sr-only'>
            Framework
          </FieldLabel>
          <Combobox items={frameworks} value={framework} onValueChange={setFramework}>
            <ComboboxInput
              id={`${toastId}-framework-dialog`}
              placeholder='Select a framework'
            />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
        <DialogFooter className='pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type='button'
            disabled={!framework}
            onClick={() => {
              toast(`${framework} selected.`, { toasterId: toastId });
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
