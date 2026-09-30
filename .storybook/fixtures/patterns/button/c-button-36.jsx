import {
  RiFacebookFill,
  RiGithubFill,
  RiGoogleFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiTwitterXFill
} from '@remixicon/react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Button aria-label='Continue with Google' variant='outline' size='icon'>
        <RiGoogleFill aria-hidden='true' />
      </Button>
      <Button aria-label='Continue with Facebook' variant='outline' size='icon'>
        <RiFacebookFill aria-hidden='true' />
      </Button>
      <Button aria-label='Continue with X' variant='outline' size='icon'>
        <RiTwitterXFill aria-hidden='true' />
      </Button>
      <Button aria-label='Continue with GitHub' variant='outline' size='icon'>
        <RiGithubFill aria-hidden='true' />
      </Button>
      <Button aria-label='Continue with LinkedIn' variant='outline' size='icon'>
        <RiLinkedinFill aria-hidden='true' />
      </Button>
      <Button
        aria-label='Continue with Instagram'
        variant='outline'
        size='icon'
      >
        <RiInstagramFill aria-hidden='true' />
      </Button>
    </div>
  );
}
