import Loader from '@gaudi/design-system/core/Loader';
'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  StepperRoot as Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from '@gaudi/design-system/core/Stepper';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const steps = [
  {
    title: 'User Details',
    icon: <RegistryIcon lucide='BookUserIcon' className='size-4' />
  },
  {
    title: 'Payment Info',
    icon: <RegistryIcon lucide='CreditCardIcon' className='size-4' />
  },
  {
    title: 'Auth OTP',
    icon: <RegistryIcon lucide='LockIcon' className='size-4' />
  }
];
export function Pattern() {
  const [currentStep, setCurrentStep] = useState(2);
  return (
    <Stepper
      value={currentStep}
      onValueChange={setCurrentStep}
      indicators={{
        completed: <RegistryIcon lucide='CheckIcon' className='size-3.5' />,
        loading: (
          <Loader size='xs' className='size-3.5' aria-hidden='true' />
        )
      }}
      className='w-full max-w-xl space-y-6'
    >
      <StepperNav className='gap-3'>
        {steps.map((step, index) => (
          <StepperItem
            key={index}
            step={index + 1}
            className='relative flex-1 items-start'
          >
            <StepperTrigger className='flex grow flex-col items-start justify-center gap-2.5'>
              <StepperIndicator className='data-[state=inactive]:border-ui-border data-[state=inactive]:text-ui-muted-foreground data-[state=completed]:bg-success size-8 border-2 data-[state=completed]:text-success-foreground data-[state=inactive]:bg-transparent'>
                {step.icon}
              </StepperIndicator>
              <div className='flex flex-col items-start gap-1'>
                <div className='text-ui-muted-foreground text-xs font-medium'>
                  Step {index + 1}
                </div>
                <StepperTitle className='group-data-[state=inactive]/step:text-ui-muted-foreground text-start'>
                  {step.title}
                </StepperTitle>
                <div>
                  <Badge
                    size='sm'
                    variant='primary-light'
                    className='hidden group-data-[state=active]/step:inline-flex'
                  >
                    In Progress
                  </Badge>
                  <Badge
                    variant='success-light'
                    size='sm'
                    className='hidden group-data-[state=completed]/step:inline-flex'
                  >
                    Completed
                  </Badge>
                  <Badge
                    variant='secondary'
                    size='sm'
                    className='text-ui-muted-foreground hidden group-data-[state=inactive]/step:inline-flex'
                  >
                    Pending
                  </Badge>
                </div>
              </div>
            </StepperTrigger>

            {steps.length > index + 1 && (
              <StepperSeparator className='group-data-[state=completed]/step:bg-success absolute inset-x-0 start-9 top-4 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none' />
            )}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className='text-sm'>
        {steps.map((step, index) => (
          <StepperContent
            key={index}
            value={index + 1}
            className='flex items-center justify-center'
          >
            {step.title} content
          </StepperContent>
        ))}
      </StepperPanel>

      <div className='flex items-center justify-between gap-2.5'>
        <Button
          variant='outline'
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep === steps.length}
        >
          Next
        </Button>
      </div>
    </Stepper>
  );
}
