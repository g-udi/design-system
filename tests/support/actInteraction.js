import { configure, getConfig } from 'storybook/test';
import { act } from './reactAct.js';

// Scope React's async act to a user-event action that mounts or removes editors.
// Restore Storybook's wrapper before queries: waitFor must flush updates itself.
export async function actInteraction(interaction) {
  const { asyncWrapper } = getConfig();
  configure({ asyncWrapper: act });
  try {
    return await interaction();
  } finally {
    configure({ asyncWrapper });
  }
}
