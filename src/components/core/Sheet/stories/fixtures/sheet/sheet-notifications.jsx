'use client';
import { useState } from 'react';
import { AppShellNotifications } from '@gaudi/design-system/blocks/AppShell';

const initial = [
  { id: 1, title: 'Maya Patel mentioned you in Launch checklist', avatar: '/avatars/person-23.svg', initials: 'MP', time: '2m', unread: true, body: 'Can you confirm the welcome email copy before Friday?' },
  { id: 2, title: 'Leo Martins invited you to Q4 roadmap review', avatar: '/avatars/person-41.svg', initials: 'LM', time: '18m', unread: true, actions: [{ id: 'accept', label: 'Accept', done: 'Accepted', primary: true }, { id: 'decline', label: 'Decline', done: 'Declined' }] },
  { id: 3, title: 'Ana Costa shared a file in Brand assets', avatar: '/avatars/person-20.svg', initials: 'AC', time: '1h', unread: true, attachment: { name: 'cover-v3.png', size: '2.1 MB' } },
  { id: 4, title: 'Sam Lee closed Fix onboarding email typo', avatar: '/avatars/person-50.svg', initials: 'SL', time: 'Yesterday' }
];

export function Pattern() {
  const [items, setItems] = useState(initial);
  const unread = items.filter(item => item.unread).length;
  return (
    <AppShellNotifications
      inset
      showTriggerLabel
      showDescription
      items={items}
      onItemsChange={setItems}
      description={unread ? `${unread} unread` : 'You are all caught up'}
    />
  );
}
