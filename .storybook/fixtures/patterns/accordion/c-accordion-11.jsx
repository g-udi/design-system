import { useId, useState } from 'react';
import { AccordionGroup } from '../../../../src/components/core/Accordion/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { default as Icon } from '../../../../src/components/core/Icon/index.js';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { default as Pill } from '../../../../src/components/core/Pill/index.js';
import { default as Progress } from '../../../../src/components/core/Progress/index.js';

// Supply a QR image that encodes your public setup-guide URL.
const setupQr = 'static/images/setup-guide.svg';

export function Pattern() {
  const [value, setValue] = useState('guide');
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const nameId = useId();
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3'>
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
              <div className='grid gap-3 [&>button]:justify-self-start'>
                <div className='flex flex-wrap items-start gap-3'>
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
                    width='96'
                    height='96'
                    src={setupQr}
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
            description: complete ? undefined : 'Read the guide to unlock this step.',
            content: (
              <form
                className='grid gap-3 [&>button]:justify-self-start'
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
                {saved && <p role='status'>Display name saved in this example.</p>}
              </form>
            )
          }
        ]}
      />
    </div>
  );
}
