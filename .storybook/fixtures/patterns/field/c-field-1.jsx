'use client';
import { useState } from 'react';
import {
  Field,
  FieldDescription,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '../../../../src/components/core/InputOtp/parts/input-otp.jsx';
import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';

export function Pattern() {
  const [cpu, setCpu] = useState([75]);
  return (
    <div className='mx-auto grid w-full max-w-lg gap-4 sm:grid-cols-2'>
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
      <Field>
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
          <span className='text-xs text-text-muted'>0/500</span>
        </div>
        <Textarea id='field-message' rows={3} maxLength={500} placeholder='Tell us more about your problem…' />
        <FieldDescription>Include any details that help us resolve it.</FieldDescription>
      </Field>
    </div>
  );
}
