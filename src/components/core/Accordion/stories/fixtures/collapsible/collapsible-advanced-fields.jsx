'use client';
import { useId, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@gaudi/design-system/core/Accordion';
import {
  FieldRoot as Field,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { InputGroupAddon, InputGroupText } from '@gaudi/design-system/core/Input';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';
export function Pattern() {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='mx-auto h-54 w-full max-w-xs'>
      <Card size='sm'>
        <CardHeader>
          <CardTitle>Unit Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className='flex flex-col gap-3'
          >
            <div className='flex items-end gap-2'>
              <Field className='flex-1'>
                <FieldLabel htmlFor={`${id}-base`} className='sr-only'>Base Price</FieldLabel>
                <NumberField id={`${id}-base`} defaultValue={19}>
                  <NumberFieldGroup>
                    <NumberFieldInput placeholder='0.00' />
                    <InputGroupAddon align='inline-end'>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                  </NumberFieldGroup>
                </NumberField>
              </Field>
              <CollapsibleTrigger asChild>
                <Button
                  aria-label='Settings'
                  variant='outline'
                  size='icon'
                  className='shrink-0'
                >
                  <RegistryIcon
                    lucide='Settings2Icon'
                    aria-hidden='true'
                    className='size-3.5'
                  />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
              <FieldGroup className='gap-2'>
                <Field>
                  <FieldLabel htmlFor={`${id}-tax`}>Tax Rate (%)</FieldLabel>
                  <NumberField id={`${id}-tax`} defaultValue={15}>
                    <NumberFieldGroup>
                      <NumberFieldInput placeholder='0' />
                      <InputGroupAddon align='inline-end'>
                        <InputGroupText>%</InputGroupText>
                      </InputGroupAddon>
                    </NumberFieldGroup>
                  </NumberField>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${id}-discount`}>Discount (%)</FieldLabel>
                  <NumberField id={`${id}-discount`} defaultValue={0}>
                    <NumberFieldGroup>
                      <NumberFieldInput placeholder='0' />
                      <InputGroupAddon align='inline-end'>
                        <InputGroupText>%</InputGroupText>
                      </InputGroupAddon>
                    </NumberFieldGroup>
                  </NumberField>
                </Field>
              </FieldGroup>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
