// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../../../../src/components/core/Accordion/Accordion.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
const users = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@apple.com',
    role: 'Admin',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'AJ',
    content:
      'Alex has full administrative access to the platform, including billing management, user provisioning, and security configurations.'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@openai.com',
    role: 'Viewer',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC',
    content:
      'Sarah has read-only access to projects and reports. She cannot modify settings or invite new members.'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael@meta.com',
    role: 'Editor',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    initials: 'MR',
    content:
      'Michael is part of the design team and has permissions to edit projects, manage assets, and update design system components.'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto mb-auto w-full max-w-lg'>
      <Frame stacked spacing='sm'>
        {users.map((user) => (
          <FramePanel key={user.id}>
            <Accordion
              type='single'
              collapsible
              defaultValue='1'
              className='border-none'
            >
              <AccordionItem
                value={user.id}
                className='border-none bg-transparent p-0 **:data-[slot=accordion-content]:p-0!'
              >
                <AccordionTrigger className='items-center px-1 py-1 hover:no-underline'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-8 border'>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className='text-xs'>
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='inline-flex items-center gap-2'>
                      <span className='text-ui-foreground font-semibold tracking-tight'>
                        {user.name}
                      </span>
                      <Badge
                        variant={
                          user.role === 'Admin' ? 'success-light' : 'secondary'
                        }
                        size='sm'
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-ui-muted-foreground py-0 pl-11'>
                  {user.content}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FramePanel>
        ))}
      </Frame>
    </div>
  );
}
