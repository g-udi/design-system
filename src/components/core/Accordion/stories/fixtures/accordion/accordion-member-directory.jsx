import { AccordionGroup } from '@gaudi/design-system/core/Accordion';
import { Avatar } from '@gaudi/design-system/core/Avatar';
import { default as Pill } from '@gaudi/design-system/core/Pill';

const members = [
  { value: 'amira', name: 'Amira Hassan', meta: 'Editorial lead · London', role: 'Admin', tone: 'blue', photo: 'person-23', avatarTone: undefined, content: 'Amira manages members, publishing permissions, and workspace settings.' },
  { value: 'leo', name: 'Leo Martins', meta: 'Product designer · Lisbon', role: 'Editor', tone: 'gray', photo: 'person-47', avatarTone: 'teal', content: 'Leo can create and review content in shared collections.' },
  { value: 'sara', name: 'Sara Kim', meta: 'Researcher · Seoul', role: 'Viewer', tone: 'gray', photo: 'person-25', avatarTone: 'indigo', content: 'Sara can read published content and leave comments.' }
];

export function Pattern() {
  return (
    <AccordionGroup
      className='mx-auto w-full max-w-lg'
      variant='framed'
      items={members.map((member) => ({
        value: member.value,
        title: member.name,
        description: member.meta,
        leading: (
          <Avatar
            name={member.name}
            src={`/avatars/${member.photo}.svg`}
            alt=''
            size='sm'
            shape='circle'
            tone={member.avatarTone}
          />
        ),
        badge: (
          <Pill tone={member.tone} size='xs' variant='soft'>
            {member.role}
          </Pill>
        ),
        content: member.content
      }))}
    />
  );
}
