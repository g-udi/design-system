// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
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
import { default as Button } from '../../../../src/components/core/Button/index.js';
const steps = [1, 2, 3, 4];
export function Pattern() {
  const [currentStep, setCurrentStep] = useState(2);
  return (
    <Stepper
      value={currentStep}
      onValueChange={setCurrentStep}
      className='w-full max-w-md space-y-8'
    >
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger asChild>
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

      {/* Buttons */}
      <div className='flex items-center justify-between gap-2.5'>
        <Button
          variant='outline'
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep === steps.length}
        >
          Next
        </Button>
      </div>
    </Stepper>
  );
}
