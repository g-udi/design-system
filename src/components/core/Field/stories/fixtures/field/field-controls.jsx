'use client';
import { useState } from 'react';
import {
  FieldRoot as Field,
  FieldDescriptionPrimitive as FieldDescription,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '@gaudi/design-system/core/Input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@gaudi/design-system/core/InputOtp';
import {
  NativeSelect,
  NativeSelectOption
} from '@gaudi/design-system/core/Select';
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
import { Slider } from '@gaudi/design-system/core/Slider';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';

export function Pattern() {
  const [cpu, setCpu] = useState([75]);
  const [message, setMessage] = useState('');
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-flow-dense sm:grid-cols-2'>
      <Field>
        <FieldLabel htmlFor='field-username'>Username</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id='field-username' defaultValue='ada' />
        </InputGroup>
        <FieldDescription className='text-success'>Username is available.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor='field-email'>Work email</FieldLabel>
        <InputGroup>
          <InputGroupInput id='field-email' defaultValue='ada' aria-invalid />
          <InputGroupAddon align='inline-end'>
            <InputGroupText>@gaudi.dev</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Use your company address.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor='field-plan'>Subscription plan</FieldLabel>
        <Select defaultValue='pro'>
          <SelectTrigger id='field-plan'>
            <SelectValue placeholder='Select a plan' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='free'>Free</SelectItem>
            <SelectItem value='pro'>Pro</SelectItem>
            <SelectItem value='enterprise'>Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>Change plans at any time.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor='field-method'>Verification method</FieldLabel>
        <NativeSelect id='field-method' defaultValue='email'>
          <NativeSelectOption value='email'>Email address</NativeSelectOption>
          <NativeSelectOption value='sms'>SMS text message</NativeSelectOption>
          <NativeSelectOption value='app'>Authenticator app</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>A native select for simple lists.</FieldDescription>
      </Field>
      <Field>
        <div className='flex items-center justify-between'>
          <FieldLabel htmlFor='field-cpu'>CPU allocation</FieldLabel>
          <span className='text-xs font-medium tabular-nums text-text-muted'>{cpu[0]}%</span>
        </div>
        <Slider id='field-cpu' aria-label='CPU allocation' value={cpu} onValueChange={setCpu} max={100} step={5} />
        <FieldDescription>Caps the resources the app can use.</FieldDescription>
      </Field>
      <Field className='sm:col-span-2'>
        <FieldLabel htmlFor='field-code'>Security code</FieldLabel>
        <InputOTP id='field-code' maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>The 6-digit code we sent you.</FieldDescription>
      </Field>
      <Field className='sm:col-span-2'>
        <div className='flex items-center justify-between'>
          <FieldLabel htmlFor='field-message'>Message</FieldLabel>
          <span className='text-xs text-text-muted'>{message.length}/500</span>
        </div>
        <Textarea id='field-message' value={message} onChange={(event) => setMessage(event.target.value)} rows={3} maxLength={500} placeholder='Describe what happened and what you expected…' />
        <FieldDescription>Include any details that help us resolve it.</FieldDescription>
      </Field>
    </div>
  );
}
