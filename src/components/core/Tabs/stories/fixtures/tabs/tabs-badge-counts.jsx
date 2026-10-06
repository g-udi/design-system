import { Badge } from '@gaudi/design-system/core/Pill';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@gaudi/design-system/core/Tabs';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-6'>
      <Tabs defaultValue='inbox'>
        <TabsList className='mb-3.5 w-full'>
          <TabsTrigger value='inbox' className='gap-2'>
            Inbox
            <Badge variant='primary-light' size='sm'>
              12
            </Badge>
          </TabsTrigger>
          <TabsTrigger value='drafts' className='gap-2'>
            Drafts
            <Badge variant='info-light' size='sm'>
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value='sent' className='gap-2'>
            Sent
          </TabsTrigger>
          <TabsTrigger value='spam' className='gap-2'>
            Spam
            <Badge variant='destructive-light' size='sm'>
              24
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='inbox'>
          <Card>
            <CardContent>12 reader replies waiting for you.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='drafts'>
          <Card>
            <CardContent>3 drafts saved but not scheduled.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='sent'>
          <Card>
            <CardContent>Issues you have already sent are listed here.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='spam'>
          <Card>
            <CardContent>24 comments held for moderation.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
