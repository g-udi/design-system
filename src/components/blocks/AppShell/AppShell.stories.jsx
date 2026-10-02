import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import AppShell from './AppShell';
import { desktopSidebar, expectFramed, openNavigation } from './AppShell.story-steps.js';

const docs = getComponentDocs('Blocks/App Shell');
const pattern = patternStories(
  'app-shell',
  import.meta.glob('../../../../.storybook/fixtures/patterns/app-shell/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/app-shell/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default {
  title: 'Blocks/App Shell', id: 'blocks-application-appshell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => AppShellPattern1 })
    }
  }
};

// The main example: the other reui shells follow in AppShellPatterns.stories.jsx.
export const AppShellPattern1 = {
  name: 'Icon rail · workspace switcher, nested nav and user menu',
  ...pattern(1, 'A collapsible icon-rail sidebar in an app window: a workspace switcher, Platform pages with nested Pipelines and Infrastructure sections and a count badge, a collapsible Resources group with status dots, tags and row menus, footer links, and an account menu. The rail handle on the sidebar edge folds it to icons with tooltips (nested sections open beside the rail); in a narrow frame the sidebar opens as a sheet inside the window. Skeleton cards stand in for the page.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    // Pipelines remembers its last view while Overview is the current page.
    await expect(nav.getByRole('link', { name: 'Deployments' })).toHaveAttribute('data-active', 'true');
    await expect(nav.getByRole('link', { name: 'Deployments' })).not.toHaveAttribute('aria-current');
    await userEvent.click(nav.getByRole('button', { name: 'Infrastructure' }));
    await userEvent.click(await nav.findByRole('link', { name: 'Clusters' }));
    await waitFor(() => expect(main.getByText('Clusters')).toBeVisible());
    nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Clusters' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('button', { name: 'Actions for CDN' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Remove' }));
    await waitFor(() => expect(nav.queryByRole('link', { name: /^CDN/ })).not.toBeInTheDocument());
    await userEvent.click(nav.getByRole('button', { name: 'Workspace: Gaudi' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Atlas Labs/ }));
    await waitFor(() => expect(nav.getByRole('button', { name: 'Workspace: Atlas Labs' })).toBeVisible());
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      await userEvent.click(canvas.getByRole('button', { name: 'Collapse sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(canvas.getByRole('button', { name: 'Pipelines' }));
      await userEvent.click(await body.findByRole('menuitem', { name: 'Release Gates' }));
      await waitFor(() => expect(main.getByText('Release Gates')).toBeVisible());
      await userEvent.click(canvas.getByRole('button', { name: 'Expand sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};
