import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/core/Item/parts/item.jsx';
const activities = [
  {
    name: 'Sarah Chen',
    avatar: '/avatars/women/44.jpg',
    action: 'deployed',
    target: 'v2.4.1 to production',
    badge: 'success-light',
    time: '5 min ago'
  },
  {
    name: 'Marcus Johnson',
    avatar: '/avatars/men/46.jpg',
    action: 'merged',
    target: 'feat/dark-mode into main',
    badge: 'info-light',
    time: '32 min ago'
  },
  {
    name: 'Emily Park',
    avatar: '/avatars/women/12.jpg',
    action: 'opened',
    target: 'issue #284: Fix mobile nav',
    badge: 'warning-light',
    time: '1 hour ago'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ItemGroup>
        {activities.map((activity, index) => (
          <div key={index}>
            <Item variant='outline' size='xs'>
              <ItemMedia>
                <Avatar size='sm'>
                  <AvatarImage src={activity.avatar} alt={activity.name} />
                  <AvatarFallback>
                    {activity.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{activity.name}</ItemTitle>
                <ItemDescription>
                  <Badge
                    variant={activity.badge}
                    size='xs'
                    className='mr-1 align-text-top'
                  >
                    {activity.action}
                  </Badge>
                  {activity.target}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className='text-ui-muted-foreground text-xs whitespace-nowrap'>
                  {activity.time}
                </span>
              </ItemActions>
            </Item>
          </div>
        ))}
      </ItemGroup>
    </div>
  );
}
