'use client';
import { useState } from 'react';
import Link from '@gaudi/design-system/core/Link';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  FieldRoot as Field,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel,
  FieldSeparator
} from '@gaudi/design-system/core/Field';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { EmailInput } from '@gaudi/design-system/core/Input';
export function Pattern() {
  const [isVisible, setIsVisible] = useState(false);
  const [notice, setNotice] = useState('');
  return (
    <Card className='mx-auto w-full max-w-xs'>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(event) => { event.preventDefault(); setNotice('Sign-in details validated in this demo. No authentication request was sent.'); }} className='grid gap-4'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='email-12'>Email address</FieldLabel>
              <EmailInput
                id='email-12'

                placeholder='name@example.com'
                required
              />
            </Field>
            <Field>
              <div className='flex items-center justify-between'>
                <FieldLabel htmlFor='password-12'>Password</FieldLabel>
                <Link
                  href='/forgot-password'
                  className='text-ui-muted-foreground text-xs underline-offset-4 hover:underline'
                >
                  Forgot password?
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  id='password-12'
                  placeholder='Password'
                  type={isVisible ? 'text' : 'password'}
                  required
                />
                <InputGroupAddon align='inline-end'>
                  <InputGroupButton
                    size='icon-sm'
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <RegistryIcon lucide='EyeOffIcon' aria-hidden='true' />
                    ) : (
                      <RegistryIcon lucide='EyeIcon' aria-hidden='true' />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
          <div className='flex flex-col gap-4'>
            <Button type='submit' className='w-full'>
              Sign in
            </Button>
            <FieldSeparator className='text-xs'>
              Or continue with
            </FieldSeparator>
            <Button variant='outline' className='w-full' onClick={() => setNotice('GitHub sign-in selected in this demo. No authentication request was sent.')}>
              <RegistryIcon lucide='GithubIcon' aria-hidden='true' />
              Github
            </Button>
          </div>
          <p role='status' className='text-xs text-text-muted'>{notice}</p>
        </form>
      </CardContent>
      <CardFooter>
        <p className='text-ui-muted-foreground w-full text-center text-xs'>
          By clicking continue, you agree to our{' '}
          <Link
            href='/terms'
            className='hover:text-ui-primary underline underline-offset-4'
          >
            Terms of Service
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
