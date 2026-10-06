import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor } from 'storybook/test';
import { auditOverlayState } from './auditOverlayState.js';

const pattern = patternStories(
  'hover-card', import.meta.url,
  import.meta.glob('./fixtures/hover-card/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/hover-card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default {
  title: 'Core/Overlays & Menus/Popover', id: 'core-popover', tags: ['autodocs'], ...catalogueMeta('hover-card'),
  play: async (context) => {
    const { canvasElement } = context;
    const triggers = [...canvasElement.querySelectorAll('[data-slot="hover-card-trigger"]')];
    for (const [index, trigger] of triggers.entries()) {
      trigger.focus();
      await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="hover-card-content"]')).toBeVisible());
      await auditOverlayState(context, `open-${index + 1}`);
      await userEvent.keyboard('{Escape}');
      trigger.blur();
      await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="hover-card-content"]')).not.toBeInTheDocument());
    }
  }
};

export const HoverCardRich = { name: 'Rich hover cards', ...pattern('rich', 'A profile preview on a link, a feature note with an icon, and an image preview.') };
export const HoverCardRelativeTime = { name: 'Relative timestamp', ...pattern('relative-time', 'Hover a relative time to see the exact time in UTC and the local time zone.') };
export const HoverCardSides = { name: 'Sides', ...pattern('sides') };
