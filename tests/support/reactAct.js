import { act as reactAct } from 'react';

// Direct temporary-root checks run outside Storybook's renderer act wrapper.
export async function act(callback) {
  const hadEnvironment = Object.hasOwn(globalThis, 'IS_REACT_ACT_ENVIRONMENT');
  const previousEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  try {
    // Always take React's async branch: its synchronous branch closes the scope
    // before already-queued promise callbacks can finish their state updates.
    return await reactAct(async () => callback());
  } finally {
    if (hadEnvironment) globalThis.IS_REACT_ACT_ENVIRONMENT = previousEnvironment;
    else delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
}
