import { AccordionGroup } from '../../../../src/components/core/Accordion/index.js';
import { Avatar } from '../../../../src/components/core/Avatar/index.js';
import { default as Pill } from '../../../../src/components/core/Pill/index.js';

const members = [
  { value: 'amira', name: 'Amira Hassan', meta: 'Editorial lead · London', role: 'Admin', tone: 'blue', photo: 'women/65', avatarTone: undefined, content: 'Amira manages members, publishing permissions, and workspace settings.' },
  { value: 'leo', name: 'Leo Martins', meta: 'Product designer · Lisbon', role: 'Editor', tone: 'gray', photo: 'men/54', avatarTone: 'teal', content: 'Leo can create and review content in shared collections.' },
  { value: 'sara', name: 'Sara Kim', meta: 'Researcher · Seoul', role: 'Viewer', tone: 'gray', photo: 'women/90', avatarTone: 'indigo', content: 'Sara can read published content and leave comments.' }
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
            src={`/avatars/${member.photo}.jpg`}
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
