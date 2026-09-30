'use client';
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger
} from '../../../../src/components/core/Stepper/parts/stepper-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const steps = [1, 2, 3];
export function Pattern() {
  return (
    <Stepper
      className='w-full max-w-md'
      defaultValue={2}
      indicators={{
        completed: <RegistryIcon lucide='CheckIcon' className='size-3.5' />,
        loading: (
          <RegistryIcon
            lucide='LoaderCircleIcon'
            className='size-3.5 animate-spin'
          />
        )
      }}
    >
      <StepperNav className='mb-5'>
        {steps.map((step) => (
          <StepperItem key={step} step={step} loading={step === 2}>
            <StepperTrigger>
              <StepperIndicator className='data-[state=active]:text-ui-primary-foreground data-[state=active]:bg-ui-primary data-[state=active]:border-ui-primary data-[state=inactive]:border-ui-muted size-5 border-2 data-[state=completed]:border-green-500 data-[state=completed]:bg-green-500 data-[state=completed]:text-white'>
                <span className='bg-ui-primary-foreground hidden size-1.5 rounded-full group-data-[state=active]/step:block' />
              </StepperIndicator>
            </StepperTrigger>
            {steps.length > step && (
              <StepperSeparator className='group-data-[state=completed]/step:bg-green-500' />
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
