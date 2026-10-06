import { useId, useRef, useState } from 'react';
import { InputConfigProvider } from '@gaudi/design-system/context';
import { Field, FieldLabel, FieldDescription, FieldError } from '@gaudi/design-system/core/Field';
import Switch from '@gaudi/design-system/core/Switch';
import Button from '@gaudi/design-system/core/Button';
import Textarea from '@gaudi/design-system/core/Textarea';
import Input, { EmailInput } from '@gaudi/design-system/core/Input';
import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldDecrement, NumberFieldIncrement } from '@gaudi/design-system/core/NumberField';

export function SmoothCaretExample() {
  const [smooth, setSmooth] = useState(true);
  const [title, setTitle] = useState('A quieter way to type');
  const [quantity, setQuantity] = useState(3);
  const input = useRef(null);
  const switchId = useId();
  return (
    <InputConfigProvider caretMode={smooth ? 'smooth' : 'native'}>
      <div className='grid w-full max-w-xl gap-5'>
        <div className='flex items-center justify-between gap-4'>
          <label htmlFor={switchId} className='text-sm font-medium'>Smooth caret</label>
          <Switch id={switchId} checked={smooth} onCheckedChange={setSmooth} />
        </div>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input ref={input} name='title' value={title} onChange={event => setTitle(event.target.value)} />
          <FieldDescription>Type, click, or use the arrow keys to move the cursor.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Notes</FieldLabel>
          <Textarea name='notes' rows={3} placeholder='The caret also follows wrapped lines.' />
        </Field>
        <div className='grid items-start gap-4 sm:grid-cols-2'>
          <Field>
            <FieldLabel>Email address</FieldLabel>
            <EmailInput name='email' defaultValue='amira@example.com' />
            <FieldDescription>Email validation with a smooth caret.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Quantity</FieldLabel>
            <NumberField name='quantity' value={quantity} onValueChange={setQuantity} min={1} max={10} step={1}>
              <NumberFieldGroup>
                <NumberFieldDecrement aria-label='Decrease quantity' />
                <NumberFieldInput />
                <NumberFieldIncrement aria-label='Increase quantity' />
              </NumberFieldGroup>
            </NumberField>
            <FieldDescription>1 to 10, in steps of 1.</FieldDescription>
            <FieldError>{quantity === null ? 'Enter a quantity.' : null}</FieldError>
          </Field>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Field>
            <FieldLabel>Search</FieldLabel>
            <Input type='search' prefix='Find' defaultValue='Gaudi' />
          </Field>
          <Field>
            <FieldLabel>Native override</FieldLabel>
            <Input caretMode='native' defaultValue='Always native' />
          </Field>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Button variant='outline' onClick={() => input.current?.focus()}>Focus title</Button>
          <span className='text-xs text-text-muted'>Typing and selection stay native. Motion follows your system preference.</span>
        </div>
      </div>
    </InputConfigProvider>
  );
}
