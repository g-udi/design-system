import assert from 'node:assert/strict';
import test from 'node:test';
import { forwardRef, memo } from 'react';
import resolveNextImage from '../../../src/utilities/resolveNextImage/resolveNextImage.js';

test('Next Image resolution preserves function, forwarded-ref and memo component types', () => {
  const Image = () => null;
  const ForwardedImage = forwardRef(Image);
  const MemoImage = memo(ForwardedImage);
  for (const component of [Image, ForwardedImage, MemoImage]) {
    assert.equal(resolveNextImage(component), component);
    assert.equal(resolveNextImage({ default: { default: component } }), component);
  }
  assert.equal(resolveNextImage({ default: {} }), null);
  assert.equal(resolveNextImage(null), null);
});
