// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTitle,
  StepperTrigger
} from '../../../../src/components/core/Stepper/parts/stepper-extended.jsx';
const steps = [
  { title: 'User Details' },
  { title: 'Payment Info' },
  { title: 'Auth OTP' },
  { title: 'Preview Form' }
];
export function Pattern() {
  return (
    <Stepper defaultValue={2} className='w-full max-w-lg space-y-8'>
      <StepperNav className='mb-10 gap-5'>
        {steps.map((step, index) => (
          <StepperItem
            key={index}
            step={index + 1}
            className='relative flex-1 items-start'
          >
            <StepperTrigger className='flex grow flex-col items-start justify-center gap-3.5'>
              <StepperIndicator className='bg-ui-border data-[state=active]:bg-ui-primary data-[state=completed]:bg-ui-primary h-1 w-full rounded-full'>
                <span className='sr-only'>{index + 1}</span>
              </StepperIndicator>
              <StepperTitle className='group-data-[state=inactive]/step:text-ui-muted-foreground text-start font-semibold'>
                {step.title}
              </StepperTitle>
            </StepperTrigger>
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
    </Stepper>
  );
}
