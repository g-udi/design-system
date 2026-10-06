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
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const steps = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Set up your profile' },
  { title: 'Review', description: 'Confirm your details' }
];
export function Pattern() {
  const [descriptions, setDescriptions] = useState(true);
  return (
    <div className='flex flex-col items-center gap-4'>
      <Label className='gap-2 text-sm font-normal'>
        <Switch size='sm' checked={descriptions} onCheckedChange={setDescriptions} />
        Descriptions
      </Label>
      <Stepper
        className='flex flex-col items-center justify-center gap-6'
        defaultValue={2}
        orientation='vertical'
        indicators={{
          completed: <RegistryIcon lucide='CheckIcon' className='size-3.5' />,
          loading: (
            <Loader size='xs' className='size-3.5' aria-hidden='true' />
          )
        }}
      >
        <StepperNav>
          {steps.map((step, index) => (
            <StepperItem
              key={index}
              step={index + 1}
              className='relative items-start not-last:flex-1'
            >
              <StepperTrigger className='items-start gap-2.5 pb-8 last:pb-0'>
                <StepperIndicator className='data-[state=completed]:bg-success data-[state=completed]:text-success-foreground'>
                  {index + 1}
                </StepperIndicator>
                <div className='mt-0.5 text-left'>
                  <StepperTitle>{step.title}</StepperTitle>
                  {descriptions && <StepperDescription>{step.description}</StepperDescription>}
                </div>
              </StepperTrigger>
              {index < steps.length - 1 && (
                <StepperSeparator className='group-data-[state=completed]/step:bg-success absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)]' />
              )}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel className='w-56 text-center text-sm'>
          {steps.map((step, index) => (
            <StepperContent key={index} value={index + 1}>
              {step.title} content
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}
