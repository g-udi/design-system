import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const menuItems = [
  {
    icon: <RegistryIcon lucide='InboxIcon' />,
    label: 'Inbox',
    count: 12
  },
  {
    icon: <RegistryIcon lucide='SendIcon' />,
    label: 'Sent',
    count: 0
  },
  {
    icon: <RegistryIcon lucide='FileIcon' />,
    label: 'Drafts',
    count: 3
  },
  {
    icon: <RegistryIcon lucide='ArchiveIcon' />,
    label: 'Archive',
    count: 0
  },
  {
    icon: <RegistryIcon lucide='Trash2Icon' />,
    label: 'Trash',
    count: 0
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-64 flex-col gap-0.5'>
      {menuItems.map((item) => (
        <Item key={item.label} size='xs' asChild>
          <a href='#'>
            <ItemMedia variant='icon'>{item.icon}</ItemMedia>
            <ItemContent>
              <ItemTitle>{item.label}</ItemTitle>
            </ItemContent>
            {item.count > 1 && (
              <ItemActions>
                <Badge
                  variant='success-light'
                  className='rounded-control'
                  size='xs'
                >
                  {item.count}
                </Badge>
              </ItemActions>
            )}
          </a>
        </Item>
      ))}
    </div>
  );
}
