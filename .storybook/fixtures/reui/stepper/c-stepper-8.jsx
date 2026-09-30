// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from '../../../../src/components/core/Stepper/parts/stepper-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const steps = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Set up your profile' },
  { title: 'Complete', description: 'Review and finish' }
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
      className='w-full max-w-md space-y-6'
    >
      <StepperNav>
        {steps.map((step, index) => (
          <StepperItem
            key={index}
            step={index + 1}
            className='relative flex-1 items-start'
          >
            <StepperTrigger className='flex flex-col gap-2.5'>
              <StepperIndicator>{index + 1}</StepperIndicator>
              <StepperTitle>{step.title}</StepperTitle>
              <StepperDescription>{step.description}</StepperDescription>
            </StepperTrigger>

            {steps.length > index + 1 && (
              <StepperSeparator className='group-data-[state=completed]/step:bg-ui-primary absolute inset-x-0 top-2.5 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none' />
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
    </Stepper>
  );
}
