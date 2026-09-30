import { useId, useState } from 'react';
import {
  AccordionRoot,
  AccordionContent,
  AccordionGroup,
  AccordionItem,
  AccordionTrigger
} from '../../../src/components/core/Accordion';
import Card from '../../../src/components/core/Card';
import Button from '../../../src/components/core/Button';
import Avatar from '../../../src/components/core/Avatar';
import Pill from '../../../src/components/core/Pill';
import Icon from '../../../src/components/core/Icon';
import Input from '../../../src/components/core/Input';
import Progress from '../../../src/components/core/Progress';
import setupQr from './setup-guide.svg';
import './examples.css';

export const faqItems = [
  {
    value: 'plans',
    title: 'Which plan is right for my team?',
    content:
      'Start with a personal workspace for individual projects. A team workspace adds shared collections, review workflows, and member permissions.'
  },
  {
    value: 'billing',
    title: 'Can I change my billing schedule?',
    content:
      'Review your next renewal in billing settings before changing schedules. Your current access continues until that date.'
  },
  {
    value: 'export',
    title: 'How do I export my content?',
    content:
      'Open workspace settings and choose Export. Your download includes articles, collections, and uploaded assets.'
  }
];
const settingsItems = [
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
export function BasicExample() {
  return <AccordionGroup variant='flush' items={faqItems} />;
}
export function PlusMinusExample() {
  return (
    <AccordionGroup variant='flush' indicator='plus-minus' items={faqItems} />
  );
}
export function BorderedExample() {
  return <AccordionGroup variant='separated' items={faqItems} />;
}
export function CardExample() {
  const [showPlans, setShowPlans] = useState(false);
  return (
    <Card
      variant='outline'
      className='h-auto'
      title='Subscription & billing'
      titleLevel={3}
      subtitle='Plans, payments, and workspace access.'
    >
      <AccordionGroup
        variant='flush'
        headingLevel={4}
        className='mt-4'
        items={[
          {
            ...faqItems[0],
            content: (
              <div className='grid gap-4 [&>button]:justify-self-start'>
                <p>{faqItems[0].content}</p>
                <Button
                  size='sm'
                  variant='outline'
                  aria-expanded={showPlans}
                  onClick={() => setShowPlans(!showPlans)}
                >
                  {showPlans ? 'Hide plan details' : 'Compare plans'}
                </Button>
                {showPlans && (
                  <dl>
                    <dt className='mt-3 font-semibold text-text'>Personal</dt>
                    <dd>One owner, personal collections.</dd>
                    <dt className='mt-3 font-semibold text-text'>Team</dt>
                    <dd>Shared collections and member roles.</dd>
                  </dl>
                )}
              </div>
            )
          },
          ...faqItems.slice(1)
        ]}
      />
    </Card>
  );
}
export function DisabledExample() {
  return (
    <AccordionGroup
      highlight
      items={[
        {
          value: 'history',
          title: 'Account history',
          content:
            'Your account history includes plan changes and workspace activity.'
        },
        {
          value: 'audit',
          title: 'Advanced audit logs',
          disabled: true,
          badge: (
            <Pill size='xs' tone='gray' variant='soft'>
              Requires admin
            </Pill>
          ),
          content: 'Detailed audit logs.'
        },
        {
          value: 'email',
          title: 'Email preferences',
          content:
            'Choose which project updates and weekly summaries you receive.'
        }
      ]}
    />
  );
}
export function IconsExample() {
  return <AccordionGroup variant='separated' items={settingsItems} />;
}
export function FramedExample() {
  return <AccordionGroup variant='framed' items={settingsItems} />;
}
export function NestedExample() {
  return (
    <AccordionGroup
      variant='separated'
      defaultValue='details'
      items={[
        {
          value: 'overview',
          title: 'Product overview',
          content:
            'A shared reading and publishing workspace for editorial teams.'
        },
        {
          value: 'details',
          title: 'Additional details',
          content: (
            <AccordionGroup
              variant='flush'
              headingLevel={4}
              items={[
                {
                  value: 'specifications',
                  title: 'Technical specifications',
                  content:
                    'Access your workspace from a current browser on desktop, tablet, or phone.'
                },
                {
                  value: 'compatibility',
                  title: 'Compatibility',
                  content:
                    'Import Markdown content and export articles as portable files.'
                }
              ]}
            />
          )
        },
        {
          value: 'support',
          title: 'Support options',
          content: 'Your workspace owner can help with invitations and access.'
        }
      ]}
    />
  );
}
export function MembersExample() {
  return (
    <AccordionGroup
      variant='framed'
      items={[
        {
          value: 'amira',
          title: 'Amira Hassan',
          description: 'Editorial lead · London',
          leading: <Avatar name='Amira Hassan' src='https://randomuser.me/api/portraits/women/65.jpg' alt='' size='sm' shape='circle' />,
          badge: (
            <Pill tone='blue' size='xs' variant='soft'>
              Admin
            </Pill>
          ),
          content:
            'Amira manages members, publishing permissions, and workspace settings.'
        },
        {
          value: 'leo',
          title: 'Leo Martins',
          description: 'Product designer · Lisbon',
          leading: <Avatar name='Leo Martins' src='https://randomuser.me/api/portraits/men/54.jpg' alt='' size='sm' shape='circle' tone='teal' />,
          badge: (
            <Pill tone='gray' size='xs' variant='soft'>
              Editor
            </Pill>
          ),
          content: 'Leo can create and review content in shared collections.'
        },
        {
          value: 'sara',
          title: 'Sara Kim',
          description: 'Researcher · Seoul',
          leading: <Avatar name='Sara Kim' src='https://randomuser.me/api/portraits/women/90.jpg' alt='' size='sm' shape='circle' tone='indigo' />,
          badge: (
            <Pill tone='gray' size='xs' variant='soft'>
              Viewer
            </Pill>
          ),
          content: 'Sara can read published content and leave comments.'
        }
      ]}
    />
  );
}
export function ArrowExample() {
  return (
    <AccordionGroup
      variant='flush'
      indicator='arrow'
      indicatorPosition='start'
      items={faqItems}
    />
  );
}
export function OnboardingExample() {
  const [value, setValue] = useState('guide');
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const nameId = useId();
  return (
    <div className='grid gap-4 [&>button]:justify-self-start'>
      <Progress
        label='Workspace setup'
        value={complete ? 2 : 1}
        max={3}
        valueText={`${complete ? 2 : 1} of 3 complete`}
      />
      <AccordionGroup
        value={value}
        onValueChange={setValue}
        variant='outline'
        items={[
          {
            value: 'workspace',
            title: 'Create your workspace',
            leading: <Icon name='Check' decorative />,
            badge: (
              <Pill size='xs' tone='green' variant='soft'>
                Ready
              </Pill>
            ),
            content: 'Your workspace is ready. Continue with the setup guide.'
          },
          {
            value: 'guide',
            title: 'Read the setup guide',
            leading: <Icon name='BookOpen' decorative />,
            badge: complete && (
              <Pill size='xs' tone='green' variant='soft'>
                Done
              </Pill>
            ),
            content: (
              <div className='grid gap-4 [&>button]:justify-self-start'>
                <div className='flex flex-wrap items-start gap-4'>
                  <p className='min-w-0 flex-[1_1_180px]'>
                    Scan to read the package guide on another device, or{' '}
                    <a
                      className='text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'
                      href='https://github.com/ahmadassaf/design-system'
                      target='_blank'
                      rel='noreferrer'
                    >
                      open the setup guide
                    </a>
                    .
                  </p>
                  <img
                    className='shrink-0 rounded-sm bg-white'
                    width='104'
                    height='104'
                    src={setupQr.src ?? setupQr}
                    alt='QR code for the Gaudi setup guide'
                  />
                </div>
                <Button
                  size='sm'
                  onClick={() => {
                    setComplete(true);
                    setValue('profile');
                  }}
                >
                  Mark guide as read
                </Button>
              </div>
            )
          },
          {
            value: 'profile',
            title: 'Set your display name',
            leading: <Icon name='Users' decorative />,
            disabled: !complete,
            description: !complete
              ? 'Read the guide to unlock this step.'
              : undefined,
            content: (
              <form
                className='grid gap-4 [&>button]:justify-self-start'
                onSubmit={(event) => {
                  event.preventDefault();
                  setSaved(true);
                }}
              >
                <label htmlFor={nameId}>Display name</label>
                <Input
                  id={nameId}
                  required
                  name='displayName'
                  autoComplete='name'
                  autoFocus
                  placeholder='Your name'
                  onChange={() => setSaved(false)}
                />
                <Button type='submit' size='sm'>
                  Save display name
                </Button>
                {saved && (
                  <p role='status'>Display name saved in this example.</p>
                )}
              </form>
            )
          }
        ]}
      />
    </div>
  );
}
export function RetainedFormExample() {
  const inputId = useId();
  return (
    <AccordionRoot defaultValue='profile' variant='separated'>
      <AccordionItem value='profile'>
        <AccordionTrigger description='Drafts remain when this panel closes.'>
          Profile draft
        </AccordionTrigger>
        <AccordionContent forceMount>
          <label htmlFor={inputId}>Display name</label>
          <Input id={inputId} defaultValue='Amira' />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='notifications'>
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>
          Choose your notification preferences in account settings.
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
export const patterns = [
  ['Basic disclosure', 'Single expansion with quiet dividers.', BasicExample],
  [
    'Plus / minus',
    'An alternate indicator for help sections.',
    PlusMinusExample
  ],
  [
    'Bordered items',
    'Separate each question with a clear boundary.',
    BorderedExample
  ],
  [
    'Inside a card',
    'Supporting links and actions stay in the panel.',
    CardExample
  ],
  [
    'Disabled & highlighted',
    'Explain access requirements before expansion.',
    DisabledExample
  ],
  ['Icons & badges', 'Add status and recognizable categories.', IconsExample],
  ['Framed panels', 'Group related settings in a muted frame.', FramedExample],
  [
    'Nested sections',
    'Independent disclosure and keyboard navigation.',
    NestedExample
  ],
  [
    'Member directory',
    'Avatars, roles, and secondary information.',
    MembersExample
  ],
  [
    'Leading arrow',
    'Keep the expansion affordance beside the title.',
    ArrowExample
  ],
  [
    'Guided setup',
    'Working progress, QR link, and dependent steps.',
    OnboardingExample
  ]
];
export function PatternGallery() {
  return (
    <main className='accordion-demo-gallery'>
      <header>
        <h1>Accordion patterns</h1>
        <p>
          Eleven application patterns using Gaudi’s components and tokens.
        </p>
      </header>
      <div className='accordion-demo-grid'>
        {patterns.map(([title, description, Example]) => (
          <section
            key={title}
            className='accordion-demo-section'
            aria-label={title}
          >
            <h2>{title}</h2>
            <p>{description}</p>
            <Example />
          </section>
        ))}
      </div>
    </main>
  );
}
