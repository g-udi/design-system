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
    <Stepper defaultValue={2} className='w-full max-w-md space-y-6'>
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator>{step}</StepperIndicator>
            </StepperTrigger>
            {steps.length > step && (
              <StepperSeparator className='group-data-[state=completed]/step:bg-ui-primary' />
            )}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className='text-sm'>
        {steps.map((step) => (
          <StepperContent
            key={step}
            value={step}
            className='flex items-center justify-center'
          >
            Step {step} content
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  );
}
