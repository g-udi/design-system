import Loader from '@gaudi/design-system/core/Loader';
'use client';
import {
  StepperRoot as Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger
} from '@gaudi/design-system/core/Stepper';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const steps = [1, 2, 3];
export function Pattern() {
  return (
    <Stepper
      className='w-full max-w-md'
      defaultValue={2}
      indicators={{
        completed: <RegistryIcon lucide='CheckIcon' className='size-3.5' />,
        loading: (
          <Loader size='xs' className='size-3.5' aria-hidden='true' />
        )
      }}
    >
      <StepperNav className='mb-5'>
        {steps.map((step) => (
          <StepperItem key={step} step={step} loading={step === 2}>
            <StepperTrigger>
              <StepperIndicator className='data-[state=active]:text-ui-primary-foreground data-[state=active]:bg-ui-primary data-[state=active]:border-ui-primary data-[state=inactive]:border-ui-muted size-5 border-2 data-[state=completed]:border-success data-[state=completed]:bg-success data-[state=completed]:text-success-foreground'>
                <span className='bg-ui-primary-foreground hidden size-1.5 rounded-full group-data-[state=active]/step:block' />
              </StepperIndicator>
            </StepperTrigger>
            {steps.length > step && (
              <StepperSeparator className='group-data-[state=completed]/step:bg-success' />
            )}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className='text-sm'>
        {steps.map((step) => (
          <StepperContent
            className='flex w-full items-center justify-center'
            key={step}
            value={step}
          >
            Step {step} content
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  );
}
