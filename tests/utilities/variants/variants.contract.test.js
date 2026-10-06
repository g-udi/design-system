import assert from 'node:assert/strict';
import test from 'node:test';

import { createVariants } from '../../../src/utilities/variants/variants.js';

const componentVariants = createVariants({
  'base': 'base',
  'compoundVariants': [
    {
      'className': 'solid-blue',
      'tone': 'blue',
      'variant': 'solid'
    }
  ],
  'defaultVariants': {
    'size': 'md',
    'tone': 'blue',
    'variant': 'solid'
  },
  'variants': {
    'size': {
      'md': 'size-md',
      'sm': 'size-sm'
    },
    'tone': {
      'blue': 'tone-blue',
      'gray': 'tone-gray'
    },
    'variant': {
      'outline': 'variant-outline',
      'solid': 'variant-solid'
    }
  }
});

test('createVariants keeps defaults when Storybook controls pass undefined values', () => {
  assert.equal(
    componentVariants({
      'size': undefined,
      'tone': undefined,
      'variant': undefined
    }), componentVariants()
  );
});

test('createVariants still allows explicit variant overrides', () => {
  assert.match(componentVariants({ 'size': 'sm', 'tone': 'gray', 'variant': 'outline' }), /size-sm/);
  assert.match(componentVariants({ 'size': 'sm', 'tone': 'gray', 'variant': 'outline' }), /tone-gray/);
  assert.match(componentVariants({ 'size': 'sm', 'tone': 'gray', 'variant': 'outline' }), /variant-outline/);
});

test('createVariants keeps compound defaults when inputs are undefined', () => {
  assert.match(componentVariants({ 'tone': undefined, 'variant': undefined }), /solid-blue/);
});
