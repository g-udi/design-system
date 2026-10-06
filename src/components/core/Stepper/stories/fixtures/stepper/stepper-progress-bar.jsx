'use client';
import { useState } from 'react';
import {
  StepperRoot as Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTitle,
  StepperTrigger
} from '@gaudi/design-system/core/Stepper';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const steps = ['User details', 'Payment info', 'Verify code', 'Preview form'];

export function Pattern() {
  const [currentStep, setCurrentStep] = useState(2);
  // Without titles the bar is one segmented track and each segment is the trigger itself;
  // with titles each step becomes its own bar with a label underneath.
  const [titles, setTitles] = useState(false);
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-4'>
      <Label className='gap-2 text-sm font-normal'>
        <Switch size='sm' checked={titles} onCheckedChange={setTitles} />
        Titles
      </Label>
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        <StepperNav className={cn(titles && 'gap-3')}>
          {steps.map((title, index) => (
            <StepperItem
              key={title}
              step={index + 1}
              className={cn(
                'flex-1 transition-all duration-300',
                titles ? 'items-start' : 'overflow-hidden first:rounded-s-full last:rounded-e-full'
              )}
            >
              {titles ? (
                <StepperTrigger className='flex grow flex-col items-start gap-2'>
                  <StepperIndicator className='bg-ui-border data-[state=active]:bg-ui-primary data-[state=completed]:bg-ui-primary h-1 w-full rounded-control'>
                    <span className='sr-only'>{index + 1}</span>
                  </StepperIndicator>
                  <StepperTitle className='group-data-[state=inactive]/step:text-ui-muted-foreground text-start'>
                    {title}
                  </StepperTitle>
                </StepperTrigger>
              ) : (
                <StepperTrigger className='w-full' asChild>
                  <StepperIndicator className='bg-ui-border h-2 w-full rounded-none!'>
                    <span className='sr-only'>{title}</span>
                  </StepperIndicator>
                </StepperTrigger>
              )}
            </StepperItem>
          ))}
        </StepperNav>
        <div className='mt-2 flex items-center justify-between gap-2'>
          <Button
            variant='link'
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
            className='px-0'
          >
            <RegistryIcon lucide='ArrowLeftIcon' className='size-4' />
            Back
          </Button>
          <div className='text-sm font-medium'>
            <span className='text-ui-foreground'>{currentStep}</span>{' '}
            <span className='text-ui-muted-foreground'>/ {steps.length}</span>
          </div>
        </div>
        <StepperPanel className='py-6 text-sm'>
          {steps.map((title, index) => (
            <StepperContent key={title} value={index + 1} className='flex w-full items-center justify-center'>
              {title} content
            </StepperContent>
          ))}
        </StepperPanel>
        <div className='flex items-center justify-end gap-2'>
          <Button
            variant='outline'
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep === steps.length}
          >
            Next
          </Button>
        </div>
      </Stepper>
    </div>
  );
}
