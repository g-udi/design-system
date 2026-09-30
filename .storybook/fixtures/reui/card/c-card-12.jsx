// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Card className='mx-auto w-full max-w-xs'>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className='grid gap-6'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='email-12'>Email address</FieldLabel>
              <Input
                id='email-12'
                type='email'
                placeholder='name@example.com'
                required
              />
            </Field>
            <Field>
              <div className='flex items-center justify-between'>
                <FieldLabel htmlFor='password-12'>Password</FieldLabel>
                <a
                  href='#'
                  className='text-ui-muted-foreground text-xs underline-offset-4 hover:underline'
                >
                  Forgot password?
                </a>
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
          <div className='flex flex-col gap-6'>
            <Button type='submit' className='w-full'>
              Sign in
            </Button>
            <FieldSeparator className='text-xs'>
              Or continue with
            </FieldSeparator>
            <Button variant='outline' className='w-full'>
              <RegistryIcon lucide='GithubIcon' aria-hidden='true' />
              Github
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className='text-ui-muted-foreground w-full text-center text-xs'>
          By clicking continue, you agree to our{' '}
          <a
            href='#'
            className='hover:text-ui-primary underline underline-offset-4'
          >
            Terms of Service
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
