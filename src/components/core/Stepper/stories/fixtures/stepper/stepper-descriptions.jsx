import Loader from '@gaudi/design-system/core/Loader';
'use client';
import { useState } from 'react';
import {
  StepperRoot as Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from '@gaudi/design-system/core/Stepper';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';
import { cn } from '@gaudi/design-system/utilities/cn';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const steps = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Set up your profile' },
  { title: 'Complete', description: 'Review and finish' }
];

const layouts = [
  { value: 'centered', label: 'Centered' },
  { value: 'start', label: 'Start' },
  { value: 'inline', label: 'Inline' }
];

const indicators = {
  completed: <RegistryIcon lucide='CheckIcon' className='size-3.5' />,
  loading: <Loader size='xs' className='size-3.5' aria-hidden='true' />
};

// Centered labels sit under the indicator with the rail running between indicators;
// start-aligned labels drop the rail; inline labels sit beside the indicator.
const trigger = {
  centered: 'flex flex-col gap-2',
  start: 'flex grow flex-col items-start gap-2',
  inline: 'flex justify-start gap-1.5 text-start'
};

export function Pattern() {
  const [layout, setLayout] = useState('centered');
  const [descriptions, setDescriptions] = useState(true);
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-4'>
      <div role='group' aria-label='Label options' className='flex flex-wrap items-center gap-x-4 gap-y-2'>
        <ToggleGroup
          aria-label='Label layout'
          type='single'
          variant='outline'
          size='sm'
          spacing={0}
          value={layout}
          onValueChange={(value) => value && setLayout(value)}
        >
          {layouts.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Label className='gap-2 text-sm font-normal'>
          <Switch size='sm' checked={descriptions} onCheckedChange={setDescriptions} />
          Descriptions
        </Label>
      </div>
      <Stepper defaultValue={2} indicators={indicators} className='space-y-6'>
        <StepperNav className={cn(layout === 'start' && 'gap-3')}>
          {steps.map((step, index) => (
            <StepperItem
              key={step.title}
              step={index + 1}
              className={cn('relative', layout !== 'inline' && 'flex-1 items-start')}
            >
              <StepperTrigger className={trigger[layout]}>
                <StepperIndicator>{index + 1}</StepperIndicator>
                <div className={cn('flex flex-col gap-0.5', layout === 'inline' ? 'items-start' : layout === 'start' ? 'items-start text-start' : 'items-center')}>
                  <StepperTitle className={cn(layout === 'start' && 'group-data-[state=inactive]/step:text-ui-muted-foreground')}>
                    {step.title}
                  </StepperTitle>
                  {descriptions && <StepperDescription>{step.description}</StepperDescription>}
                </div>
              </StepperTrigger>
              {index < steps.length - 1 && layout === 'centered' && (
                <StepperSeparator className='group-data-[state=completed]/step:bg-ui-primary absolute inset-x-0 top-3 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none' />
              )}
              {index < steps.length - 1 && layout === 'inline' && (
                <StepperSeparator className='group-data-[state=completed]/step:bg-ui-primary md:mx-2.5' />
              )}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel className='text-sm'>
          {steps.map((step, index) => (
            <StepperContent key={step.title} value={index + 1} className='flex items-center justify-center'>
              {step.title} content
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}
