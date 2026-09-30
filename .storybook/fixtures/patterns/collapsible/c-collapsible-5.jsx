'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='h-54 w-full max-w-xs'>
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
                <FieldLabel className='sr-only'>Base Price</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    aria-label='0.00'
                    type='number'
                    placeholder='0.00'
                    defaultValue='19.00'
                  />
                  <InputGroupAddon align='inline-end'>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
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
                  <FieldLabel>Tax Rate (%)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      aria-label='0'
                      type='number'
                      placeholder='0'
                      defaultValue='15'
                    />
                    <InputGroupAddon align='inline-end'>
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel>Discount (%)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      aria-label='0'
                      type='number'
                      placeholder='0'
                      defaultValue='0'
                    />
                    <InputGroupAddon align='inline-end'>
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
