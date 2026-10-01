'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { DialogContent, DialogDescription, DialogRoot, DialogTitle, DialogTrigger } from '../../../../src/components/core/Dialog/index.js';
import { default as EmptyState } from '../../../../src/components/core/EmptyState/index.js';
import { Kbd, KbdGroup } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { default as RadioGroup } from '../../../../src/components/core/RadioGroup/index.js';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { default as Wizard } from '../../../../src/components/blocks/Wizard/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const steps = [
  { id: 'focus', label: 'Focus' },
  { id: 'shortcuts', label: 'Shortcuts' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'ready', label: 'Ready' }
];
const focuses = [
  { value: 'write', label: 'Write and publish', description: 'Open the editor first.' },
  { value: 'review', label: 'Review drafts', description: 'Start in the review queue.' },
  { value: 'analyse', label: 'Track readership', description: 'Start on the analytics overview.' }
];
const shortcuts = [
  [['⌘', 'K'], 'Search and run commands'],
  [['C'], 'Create a draft'],
  [['G', 'R'], 'Go to the review queue'],
  [['?'], 'Show every shortcut']
];

export function Pattern() {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState('write');
  const [alerts, setAlerts] = useState(true);
  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <RegistryIcon lucide='SparklesIcon' />
          Take the tour
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg'>
        <DialogTitle className='sr-only'>Welcome tour</DialogTitle>
        <DialogDescription className='sr-only'>Four short steps to set up your workspace.</DialogDescription>
        <Wizard
          title='Welcome to Gaudi'
          description='Four short steps. Use the dots to go back.'
          steps={steps}
          indicator='dots'
          navigable
          onComplete={() => new Promise((resolve) => setTimeout(resolve, 300))}
          completeLabel='Finish tour'
          completion={
            <EmptyState
              icon={<RegistryIcon lucide='RocketIcon' />}
              title='You are all set'
              description='Open the tour again from Help whenever you like.'
              actions={<Button onClick={() => setOpen(false)}>Start working</Button>}
            />
          }
          labels={{ continue: 'Next' }}
        >
          {(step) =>
            step === 0 ? (
              <RadioGroup label='What do you want to do first?' variant='cards' value={focus} onValueChange={setFocus} options={focuses} />
            ) : step === 1 ? (
              <ul className='grid gap-2 text-sm'>
                {shortcuts.map(([keys, label]) => (
                  <li key={label} className='flex items-center justify-between gap-3 rounded-md border px-3 py-2'>
                    <span>{label}</span>
                    <KbdGroup>
                      {keys.map((key) => <Kbd key={key}>{key}</Kbd>)}
                    </KbdGroup>
                  </li>
                ))}
              </ul>
            ) : step === 2 ? (
              <div className='flex items-center justify-between gap-3 rounded-lg border p-3'>
                <Label htmlFor='tour-alerts' className='grid gap-0.5 font-normal'>
                  <span className='font-medium'>Desktop alerts</span>
                  <span className='text-text-muted text-xs'>Mentions and review requests only.</span>
                </Label>
                <Switch id='tour-alerts' checked={alerts} onCheckedChange={setAlerts} />
              </div>
            ) : (
              <p className='text-sm'>
                You start in <span className='font-medium'>{focuses.find((item) => item.value === focus).label.toLowerCase()}</span> with desktop alerts{' '}
                {alerts ? 'on' : 'off'}. Press <Kbd>?</Kbd> any time to see the shortcuts again.
              </p>
            )
          }
        </Wizard>
      </DialogContent>
    </DialogRoot>
  );
}
