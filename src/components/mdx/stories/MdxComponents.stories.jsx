import { expect, userEvent, within } from 'storybook/test';
import { articleUrl, MdxOverview } from './fixtures/MdxOverview.jsx';

export default {
  title: 'MDX/Overview',
  id: 'mdx-overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' }
};

export const Default = {
  name: 'Overview',
  render: () => <MdxOverview />,
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await expect(canvas.getByRole('heading', { name: 'MDX overview', level: 1 })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Creating Rich & Interactive Blog Posts' })).toHaveAttribute('href', articleUrl);
    const source = canvas.getByRole('tab', { name: 'Source', exact: true });
    await expect(source).toHaveAttribute('aria-selected', 'true');
    source.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Remark', exact: true })).toHaveFocus();
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('mdast');
    for (const stage of ['Rehype', 'React']) {
      await userEvent.click(canvas.getByRole('tab', { name: stage, exact: true }));
      await expect(canvas.getByRole('tabpanel')).toHaveTextContent(stage === 'Rehype' ? 'hast' : 'Equivalent JSX');
      if (import.meta.env.MODE === 'test' && import.meta.env.VITE_GAUDI_AUDIT === '1') {
        const { auditStoryLayout } = await import('../../../../.storybook/storyAudit.js');
        await auditStoryLayout({ ...context, id: `${context.id}--${stage.toLowerCase()}` });
      }
    }
    await expect(canvas.getByRole('region', { name: 'Rendered article example' })).toBeVisible();
    await expect(canvas.getByRole('note')).toHaveTextContent('This is a React component.');
    await userEvent.click(source);
    await expect(source).toHaveAttribute('aria-selected', 'true');
  }
};
