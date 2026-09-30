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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const steps = [
  { title: 'User Details' },
  { title: 'Payment Info' },
  { title: 'Auth OTP' },
  { title: 'Preview Form' }
];
export function Pattern() {
  return (
    <Stepper
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
      className='w-full max-w-lg space-y-6'
    >
      <StepperNav className='gap-3'>
        {steps.map((step, index) => (
          <StepperItem
            key={index}
            step={index + 1}
            className='relative flex-1 items-start'
          >
            <StepperTrigger className='flex grow flex-col items-start justify-center gap-3'>
              <StepperIndicator>{index + 1}</StepperIndicator>
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
