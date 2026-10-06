'use client';
import { useId } from 'react';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput
} from '@gaudi/design-system/core/NumberField';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import { z } from 'zod';
import {
  AlertRoot as Alert,
  AlertDescriptionPrimitive as AlertDescription
} from '@gaudi/design-system/core/Banner';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  FieldRoot as Field,
  FieldDescriptionPrimitive as FieldDescription,
  FieldErrorPrimitive as FieldError,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel,
  FieldSet
} from '@gaudi/design-system/core/Field';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const FormSchema = z.object({
  amount: z
    .number({
      message: 'Enter the donation as a number.'
    })
    .min(10, {
      message: 'The smallest donation is 10.'
    })
    .max(100, {
      message: 'The largest donation is 100.'
    })
});
export function Pattern() {
  const toastId = useId();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 5
    },
    mode: 'onChange'
  });
  function onSubmit(data) {
    toast.success('Form submitted', {
      toasterId: toastId,
      description: (
        <Alert variant='default'>
          <RegistryIcon lucide='CircleAlertIcon' />
          <AlertDescription>
            Your form has successfully submitted with amount: {data.amount}
          </AlertDescription>
        </Alert>
      )
    });
    form.reset();
  }
  return (
    <>
      <ToastProvider id={toastId} />
    <div className='w-full max-w-68'>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Controller
                name='amount'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${toastId}-number-field-amount`}>
                      Amount
                    </FieldLabel>
                    <NumberField
                      id={`${toastId}-number-field-amount`}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      min={0}
                      max={100}
                    >
                      <NumberFieldGroup
                        aria-invalid={!!form.formState.errors.amount}
                      >
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                      </NumberFieldGroup>
                    </NumberField>
                    <FieldDescription>
                      Enter an amount between 10 and 100.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <Field orientation='horizontal'>
            <Button
              variant='outline'
              type='button'
              onClick={() => form.reset()}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button type='submit' className='flex-1'>
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
    </>
  );
}
