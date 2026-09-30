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
const steps = [1, 2, 3, 4];
export function Pattern() {
  return (
    <Stepper defaultValue={2} className='w-full max-w-md space-y-6'>
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator className='data-[state=active]:bg-ui-primary data-[state=active]:text-ui-primary-foreground data-[state=completed]:bg-(--ds-color-success) data-[state=completed]:text-(--ds-color-success-foreground) data-[state=inactive]:text-ui-muted-foreground'>
                {step}
              </StepperIndicator>
            </StepperTrigger>
            {steps.length > step && (
              <StepperSeparator className='group-data-[state=completed]/step:bg-(--ds-color-success)' />
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
