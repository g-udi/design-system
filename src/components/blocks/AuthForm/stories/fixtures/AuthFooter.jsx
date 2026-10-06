import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
import Link from '@gaudi/design-system/core/Link';
import { Separator } from '@gaudi/design-system/core/Separator';

export function AuthFooter({ mode }) {
  const [method, setMethod] = useState('');
  return (
    <div className='grid gap-4'>
      {mode === 'password' ? (
        <Link href='#reset' variant='muted' className='justify-self-end text-sm'>Forgot password?</Link>
      ) : null}
      <div className='text-text-muted flex items-center gap-3 text-xs'>
        <Separator className='flex-1' />
        or continue with
        <Separator className='flex-1' />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <Button type='button' variant='outline' tone='neutral' onClick={() => setMethod('GitHub')}>
          <Icon name='Github' decorative size='sm' />
          GitHub
        </Button>
        <Button type='button' variant='outline' tone='neutral' onClick={() => setMethod('Passkey')}>
          <Icon name='KeyRound' decorative size='sm' />
          Passkey
        </Button>
      </div>
      {method ? <p role='status' aria-label='Alternative sign-in' className='ds-description'>{method} sign-in is not connected in this example.</p> : null}
      <p className='ds-description text-center'>
        New here? <Link href='#sign-up' tone='blue'>Create an account</Link>
      </p>
    </div>
  );
}
