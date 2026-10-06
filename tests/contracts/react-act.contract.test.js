import assert from 'node:assert/strict';
import test from 'node:test';
import { act } from '../support/reactAct.js';

test('direct React checks retain their act environment through asynchronous work and restore its prior value', async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'IS_REACT_ACT_ENVIRONMENT');
  try {
    for (const previous of [undefined, false, true]) {
      if (previous === undefined) delete globalThis.IS_REACT_ACT_ENVIRONMENT;
      else globalThis.IS_REACT_ACT_ENVIRONMENT = previous;
      await act(async () => {
        assert.equal(globalThis.IS_REACT_ACT_ENVIRONMENT, true);
        await Promise.resolve();
        await act(async () => assert.equal(globalThis.IS_REACT_ACT_ENVIRONMENT, true));
        assert.equal(globalThis.IS_REACT_ACT_ENVIRONMENT, true);
      });
      assert.equal(globalThis.IS_REACT_ACT_ENVIRONMENT, previous);
      assert.equal(Object.hasOwn(globalThis, 'IS_REACT_ACT_ENVIRONMENT'), previous !== undefined);
    }
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
    await assert.rejects(act(async () => {
      await Promise.resolve();
      throw new Error('failed check');
    }), /failed check/);
    assert.equal(globalThis.IS_REACT_ACT_ENVIRONMENT, false);
  } finally {
    if (original) Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', original);
    else delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
});
