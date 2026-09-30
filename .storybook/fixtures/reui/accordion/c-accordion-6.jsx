// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../../../../src/components/core/Accordion/Accordion.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const items = [
  {
    value: 'account',
    icon: (
      <RegistryIcon
        lucide='SettingsIcon'
        className='text-ui-muted-foreground size-4'
      />
    ),
    trigger: 'Account Settings',
    badge: 'New',
    content:
      'Manage your account preferences, security settings, and personal information. You can also configure two-factor authentication here.'
  },
  {
    value: 'privacy',
    icon: (
      <RegistryIcon
        lucide='LockIcon'
        className='text-ui-muted-foreground size-4'
      />
    ),
    trigger: 'Privacy & Security',
    content:
      'Control who can see your profile and what data we collect. View our latest security audits and transparency reports.'
  },
  {
    value: 'support',
    icon: (
      <RegistryIcon
        lucide='HelpCircleIcon'
        className='text-ui-muted-foreground size-4'
      />
    ),
    trigger: 'Help & Support',
    content:
      "Access our help center, community forums, and contact support. We're here to help you 24/7."
  }
];
export function Pattern() {
  return (
    <div className='mx-auto mb-auto w-full max-w-lg'>
      <Accordion
        type='single'
        collapsible
        defaultValue='account'
        className='space-y-3 border-0'
      >
        {items.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className='border-ui-border bg-ui-card rounded-lg border px-2 **:data-[slot=accordion-content]:p-0!'
          >
            <AccordionTrigger className='items-center px-1 py-3 font-semibold hover:no-underline'>
              <div className='flex items-center gap-3'>
                <div className='bg-ui-muted rounded-lg flex size-8 items-center justify-center'>
                  {item.icon}
                </div>
                <span>{item.trigger}</span>
                {item.badge && (
                  <Badge variant='success-light'>{item.badge}</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className='text-ui-muted-foreground px-2 pt-0 pb-4 leading-relaxed'>
              <div className='pl-11'>{item.content}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
