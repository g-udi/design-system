// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
    <Stepper defaultValue={2} className='w-full max-w-md space-y-8'>
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator className='data-[state=active]:bg-ui-primary data-[state=active]:text-ui-primary-foreground data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=inactive]:text-gray-500'>
                {step}
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
