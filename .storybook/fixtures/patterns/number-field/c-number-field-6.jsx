'use client';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput
} from '../../../../src/components/core/NumberField/parts/number-field-extended.jsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Alert,
  AlertDescription
} from '../../../../src/components/core/Banner/parts/alert.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet
} from '../../../../src/components/core/Field/parts/field.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const FormSchema = z.object({
  amount: z
    .number({
      message: 'Amount must be a number.'
    })
    .min(10, {
      message: 'Amount must be at least 10.'
    })
    .max(100, {
      message: 'Amount must be at most 100.'
    })
});
export function Pattern() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 5
    },
    mode: 'onChange'
  });
  function onSubmit(data) {
    toast.success('Form submitted', {
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
                    <FieldLabel htmlFor='number-field-amount'>
                      Amount
                    </FieldLabel>
                    <NumberField
                      id='number-field-amount'
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
  );
}
