// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
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
              <Button size='sm'>
                <RegistryIcon lucide='UserPlusIcon' data-icon='inline-start' />
                Invite People
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  );
}
