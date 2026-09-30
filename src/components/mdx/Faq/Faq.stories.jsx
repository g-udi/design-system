import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/FAQ');

export default {
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'mdx-faq',
  title: 'MDX/FAQ'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { name: 'FAQ' });
    const trigger = canvas.getByRole('button', { name: 'Why use FAQ blocks?' });

    await expect(heading).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('They keep repeated article explanations structured and accessible.')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('They keep repeated article explanations structured and accessible.')).toBeVisible();
  },
  'render': () => renderComponentExample('MDX/Faq', componentModule)
};
