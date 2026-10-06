import { expect, userEvent, within } from 'storybook/test';
import { auditOpenMenus } from './auditOpenStates.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const patternStory = patternStories(
  'menubar', import.meta.url,
  import.meta.glob('./fixtures/menubar/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/menubar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const pattern = (...args) => ({ ...patternStory(...args), play: auditOpenMenus });

export default { title: 'Core/Overlays & Menus/DropdownMenu', id: 'core-dropdownmenu', tags: ['autodocs'], ...catalogueMeta('menubar') };

export const MenubarApplication = {
  name: 'Application menubar',
  ...pattern('application', 'File, Edit, Format, View and Account menus with icons, shortcuts, disabled items, submenus, checkbox and radio items.'),
  play: async (context) => {
    await auditOpenMenus(context);
    const body = within(context.canvasElement.ownerDocument.body);
    await userEvent.click(within(context.canvasElement).getByRole('menuitem', { name: 'Format', exact: true }));
    const disabled = body.getByRole('menuitemcheckbox', { name: 'Highlight (unavailable)' });
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await expect(getComputedStyle(disabled).opacity).toBe('0.5');
    await userEvent.keyboard('{Escape}');
  }
};
