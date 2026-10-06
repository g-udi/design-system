import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@gaudi/design-system/core/EmptyState';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-md'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription>
            Manage your team and their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <RegistryIcon lucide='UsersIcon' />
              </EmptyMedia>
              <EmptyTitle>No team members</EmptyTitle>
              <EmptyDescription>
                Invite people to collaborate on this project.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size='sm' href='/settings/team/invite'>
                <RegistryIcon lucide='UserPlusIcon' data-icon='inline-start' />
                Invite people
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  );
}
