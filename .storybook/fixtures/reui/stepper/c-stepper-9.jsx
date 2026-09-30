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
  StepperTitle,
  StepperTrigger
} from '../../../../src/components/core/Stepper/parts/stepper-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const steps = [{ title: 'Account' }, { title: 'Profile' }, { title: 'Review' }];
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
      className='w-full max-w-md space-y-8'
    >
      <StepperNav>
        {steps.map((step, index) => (
          <StepperItem key={index} step={index + 1} className='relative'>
            <StepperTrigger className='flex justify-start gap-1.5'>
              <StepperIndicator>{index + 1}</StepperIndicator>
              <StepperTitle>{step.title}</StepperTitle>
            </StepperTrigger>

            {steps.length > index + 1 && (
              <StepperSeparator className='group-data-[state=completed]/step:bg-ui-primary md:mx-2.5' />
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
