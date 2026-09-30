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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const steps = [1, 2, 3];
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Stepper
        className='flex flex-col items-center justify-center gap-6'
        defaultValue={2}
        orientation='vertical'
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
        <StepperNav>
          {steps.map((step) => (
            <StepperItem key={step} step={step} loading={step === 2}>
              <StepperTrigger>
                <StepperIndicator className='data-[state=completed]:bg-success data-[state=completed]:text-white'>
                  {step}
                </StepperIndicator>
              </StepperTrigger>
              {steps.length > step && (
                <StepperSeparator className='group-data-[state=completed]/step:bg-success' />
              )}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel className='w-56 text-center text-sm'>
          {steps.map((step) => (
            <StepperContent key={step} value={step}>
              Step {step} content
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}
