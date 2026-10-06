import { DirectionProvider } from '@gaudi/design-system/core/Direction';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gaudi/design-system/core/Tabs';

export function DirectionExample({ dir = 'rtl' }) {
  return (
    <DirectionProvider dir={dir}>
      <div dir={dir} className='w-full max-w-md'>
        <Tabs defaultValue='overview'>
          <TabsList aria-label='Project'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='activity'>Activity</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>Project summary</TabsContent>
          <TabsContent value='activity'>Recent activity</TabsContent>
        </Tabs>
      </div>
    </DirectionProvider>
  );
}
