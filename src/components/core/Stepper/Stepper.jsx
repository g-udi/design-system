import { cn } from '../../../utilities/cn';
import Icon from '../Icon';
import {
  Stepper as StepperRoot,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperTitle,
  StepperTrigger
} from './StepperPrimitives.jsx';

const indicators = { completed: <Icon name='Check' decorative size='xs' /> };

/**
 * Read-only progress built from the Stepper parts. `activeStep` is zero-based; set it to
 * `steps.length` when every step is done. Sequential guards and navigation belong to Wizard or the host.
 * `orientation='vertical'` stacks the steps for a sidebar. With `onStepSelect`, completed steps become
 * buttons so people can go back and review them; steps ahead stay locked.
 */
export default function Stepper({
  steps = [],
  activeStep = 0,
  label = 'Progress',
  orientation = 'horizontal',
  onStepSelect,
  className
}) {
  const vertical = orientation === 'vertical';
  return (
    <StepperRoot value={activeStep + 1} indicators={indicators} orientation={orientation} aria-label={label} className={className}>
      <StepperNav asChild className={cn(vertical ? 'flex-col items-stretch gap-4' : 'flex-wrap gap-x-6 gap-y-3')}>
        <ol className='m-0 list-none p-0'>
          {steps.map((step, index) => (
            <StepperItem
              asChild
              key={step.id}
              step={index + 1}
              aria-current={index === activeStep ? 'step' : undefined}
              className={cn('items-start justify-start gap-2', vertical ? 'flex-row!' : 'min-w-32 flex-1')}
            >
              <li>
                <StepperIndicator className='data-[state=active]:ring-3 data-[state=active]:ring-accent-subtle'>{index + 1}</StepperIndicator>
                <div className='grid min-w-0 gap-1 pt-1'>
                  <StepperTitle asChild className='group-data-[state=inactive]/step:text-text-muted'>
                    {onStepSelect && index < activeStep ? (
                      // Completed steps stay in the tab order; the current step is not a trigger.
                      <StepperTrigger
                        tabIndex={0}
                        aria-label={step.label}
                        onClick={() => onStepSelect(index)}
                        className='text-start underline-offset-4 hover:underline focus-visible:underline'
                      >
                        {step.label}
                      </StepperTrigger>
                    ) : (
                      <span>{step.label}</span>
                    )}
                  </StepperTitle>
                  {step.description ? <StepperDescription className='text-xs'>{step.description}</StepperDescription> : null}
                  {index < activeStep ? <span className='sr-only'>Completed</span> : null}
                </div>
              </li>
            </StepperItem>
          ))}
        </ol>
      </StepperNav>
    </StepperRoot>
  );
}
