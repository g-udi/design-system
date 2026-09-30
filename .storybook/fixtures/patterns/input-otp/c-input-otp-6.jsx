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
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '../../../../src/components/core/InputOtp/parts/input-otp.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle>Verify your login</CardTitle>
          <CardDescription>
            Enter the verification code we sent to your email address:{' '}
            <span className='text-ui-foreground font-medium'>
              m@example.com
            </span>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Field>
              <div className='flex items-center justify-between'>
                <FieldLabel htmlFor='otp-verification'>
                  Verification code
                </FieldLabel>
                <Button variant='outline' size='xs'>
                  <RegistryIcon
                    lucide='RefreshCwIcon'
                    data-icon='inline-start'
                  />
                  Resend Code
                </Button>
              </div>
              <InputOTP maxLength={6} id='otp-verification' required>
                <InputOTPGroup className='*:data-[slot=input-otp-slot]:h-9 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className='*:data-[slot=input-otp-slot]:h-9 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Field>
          </form>
        </CardContent>
        <CardFooter className='flex-col gap-2'>
          <Button type='submit' className='w-full'>
            Verify
          </Button>
          <div className='text-ui-muted-foreground'>
            Having trouble signing in?{' '}
            <a
              href='#'
              className='text-ui-primary underline-offset-4 transition-colors underline'
            >
              Contact support
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
