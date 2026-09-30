// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
const activities = [
  {
    name: 'Sarah Chen',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80',
    action: 'deployed',
    target: 'v2.4.1 to production',
    badge: 'success-light',
    time: '5 min ago'
  },
  {
    name: 'Marcus Johnson',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    action: 'merged',
    target: 'feat/dark-mode into main',
    badge: 'info-light',
    time: '32 min ago'
  },
  {
    name: 'Emily Park',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80',
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
