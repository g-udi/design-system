import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor } from 'storybook/test';
import { auditOverlayState } from '../../Popover/stories/auditOverlayState.js';

const pattern = patternStories(
  'tooltip', import.meta.url,
  import.meta.glob('./fixtures/tooltip/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/tooltip/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default {
  title: 'Core/Tooltip', id: 'core-tooltip', tags: ['autodocs'], ...catalogueMeta('tooltip'),
  play: async (context) => {
    const { canvasElement } = context;
    const triggers = [...canvasElement.querySelectorAll('[data-slot="tooltip-trigger"]')];
    for (const [index, trigger] of triggers.entries()) {
      trigger.focus();
      await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="tooltip-content"]')).toBeVisible());
      await auditOverlayState(context, `open-${index + 1}`);
      await userEvent.keyboard('{Escape}');
      trigger.blur();
      await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="tooltip-content"]')).not.toBeInTheDocument());
    }
  }
};

export const Sides = { name: 'Sides', ...pattern('sides') };
export const StatusMetadata = { name: 'Status and metadata', ...pattern('status-metadata', 'File details, labels, an inline verified mark, service status and a warning, each on its own trigger.') };
export const People = { name: 'People', ...pattern('people', 'An avatar stack where each tooltip shows the role badge and online status.') };
export const DisabledButton = { name: 'Disabled button', ...pattern('disabled-button', 'Wrap a disabled button in a span so it can still show why it is disabled.') };
