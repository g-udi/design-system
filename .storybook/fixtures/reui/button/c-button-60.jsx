// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  RiFacebookFill,
  RiGithubFill,
  RiGoogleFill,
  RiTwitterXFill
} from '@remixicon/react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <div className='flex flex-wrap gap-2'>
      <Button
        aria-label='Login with Google'
        className='flex-1'
        size='icon'
        variant='outline'
      >
        <RiGoogleFill
          aria-hidden='true'
          className='dark:text-ui-primary text-[#DB4437]'
          size={16}
        />
      </Button>
      <Button
        aria-label='Login with Facebook'
        className='flex-1'
        size='icon'
        variant='outline'
      >
        <RiFacebookFill
          aria-hidden='true'
          className='dark:text-ui-primary text-[#1877f2]'
          size={16}
        />
      </Button>
      <Button
        aria-label='Login with X'
        className='flex-1'
        size='icon'
        variant='outline'
      >
        <RiTwitterXFill
          aria-hidden='true'
          className='dark:text-ui-primary text-[#14171a]'
          size={16}
        />
      </Button>
      <Button
        aria-label='Login with GitHub'
        className='flex-1'
        size='icon'
        variant='outline'
      >
        <RiGithubFill
          aria-hidden='true'
          className='dark:text-ui-primary text-black'
          size={16}
        />
      </Button>
    </div>
  );
}
