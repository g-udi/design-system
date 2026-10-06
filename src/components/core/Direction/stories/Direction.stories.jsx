import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { DirectionExample } from './fixtures/DirectionExample.jsx';
import exampleSource from './fixtures/DirectionExample.jsx?raw';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';

const docs = getComponentDocs('Core/Direction');

export default {
  title: 'Core/Layout & Containers/Direction',
  id: 'core-direction',
  tags: ['autodocs'],
  args: { dir: 'rtl' },
  argTypes: { dir: { control: 'inline-radio', options: ['ltr', 'rtl'] } },
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs) } }
};

export const Playground = {
  parameters: { docs: { source: { code: publicSource(exampleSource, new URL('./fixtures/DirectionExample.jsx', import.meta.url)), language: 'jsx' } } },
  render: (args) => <DirectionExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('tab', { name: 'Overview' });
    await userEvent.click(first);
    await userEvent.keyboard(args.dir === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Recent activity');
  }
};
