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
  StepperTrigger
} from '../../../../src/components/core/Stepper/parts/stepper-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const steps = [1, 2, 3, 4];
export function Pattern() {
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <div className='w-full max-w-md'>
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        <StepperNav>
          {steps.map((step) => (
            <StepperItem
              key={step}
              step={step}
              className='first:rounded-s-full last:rounded-e-full flex-1 overflow-hidden transition-all duration-300'
            >
              <StepperTrigger
                className='w-full flex-col items-start gap-2'
                asChild
              >
                <StepperIndicator className='bg-ui-border h-2 w-full rounded-none!'>
                  <span className='sr-only'>{step}</span>
                </StepperIndicator>
              </StepperTrigger>
            </StepperItem>
          ))}
        </StepperNav>

        <div className='flex items-center justify-between gap-2.5 py-1'>
          <Button
            variant='link'
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className={cn(
              'px-0',
              currentStep === 1 && 'pointer-events-none opacity-0'
            )}
          >
            <RegistryIcon lucide='ArrowLeftIcon' className='size-4' />
            Back
          </Button>

          <div className='text-sm font-medium'>
            <span className='text-ui-foreground'>{currentStep}</span>{' '}
            <span className='text-ui-muted-foreground'>/ {steps.length}</span>
          </div>
        </div>

        <StepperPanel className='py-6 text-sm'>
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

        <div className='flex items-center justify-end gap-2.5'>
          <Button
            variant='outline'
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep === steps.length}
          >
            Next
          </Button>
        </div>
      </Stepper>
    </div>
  );
}
