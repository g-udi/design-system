import { AccordionGroup } from '../../../../src/components/core/Accordion/index.js';
import { default as Icon } from '../../../../src/components/core/Icon/index.js';
import { default as Pill } from '../../../../src/components/core/Pill/index.js';
const items = [
  {
    value: 'account',
    title: 'Account settings',
    leading: <Icon name='Settings' decorative />,
    badge: (
      <Pill size='xs' variant='soft' tone='green'>
        New
      </Pill>
    ),
    content: 'Manage your display name, language, and notification preferences.'
  },
  {
    value: 'security',
    title: 'Privacy & security',
    leading: <Icon name='Fingerprint' decorative />,
    content:
      'Review active sessions and configure two-factor authentication in your account.'
  },
  {
    value: 'support',
    title: 'Help & support',
    leading: <Icon name='Info' decorative />,
    content:
      'Find setup guides, accessibility information, and ways to contact your workspace administrator.'
  }
];

export function Pattern() {
  return <AccordionGroup className='mx-auto w-full max-w-lg' variant='separated' items={items} />;
}
