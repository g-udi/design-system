import { expect, userEvent, within } from 'storybook/test';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Tabs, { TabsList, TabsTrigger, TabsContent } from './Tabs';

export default {
  tags: ['autodocs'],
  title: 'Core/Tabs',
  component: Tabs,
  ...applicationDocs(
    'Composable tabs for views within the same page. Supports controlled value, defaultValue, horizontal/vertical orientation and manual activation.',
    "import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gaudi/design-system/core/Tabs';\n\n<Tabs defaultValue='overview'><TabsList aria-label='Article'><TabsTrigger value='overview'>Overview</TabsTrigger><TabsTrigger value='history'>History</TabsTrigger></TabsList><TabsContent value='overview'>Article details</TabsContent><TabsContent value='history'>Revision history</TabsContent></Tabs>",
    'Radix connects tabs to their panels and implements arrow, Home and End navigation. For route navigation, use links rather than tab roles.'
  )
};
function ArticleTabs({
  orientation = 'horizontal',
  activationMode = 'automatic'
}) {
  return (
    <ExampleFrame>
      <Tabs
        defaultValue='overview'
        orientation={orientation}
        activationMode={activationMode}
      >
        <TabsList aria-label='Article details'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='references'>References</TabsTrigger>
          <TabsTrigger value='history'>History</TabsTrigger>
          <TabsTrigger value='analytics' disabled>
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>
          A practical guide to knowledge graphs.
        </TabsContent>
        <TabsContent value='references'>
          Three references support this article.
        </TabsContent>
        <TabsContent value='history'>
          The latest revision was saved yesterday.
        </TabsContent>
      </Tabs>
    </ExampleFrame>
  );
}
export const ArticleDetails = {
  render: () => <ArticleTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Overview' }));
    await userEvent.keyboard('{ArrowRight}');
    await expect(
      canvas.getByRole('tab', { name: 'References' })
    ).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
      'Three references'
    );
  }
};
export const Vertical = {
  render: () => <ArticleTabs orientation='vertical' />
};
export const ManualActivation = {
  render: () => <ArticleTabs activationMode='manual' />
};
