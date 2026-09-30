import Icon from '../Icon';
import { cn } from '../../../utilities/cn';

/** Progress only. Sequential guards and navigation belong to Wizard or the host. */
export default function Stepper({
  steps = [],
  activeStep = 0,
  label = 'Progress',
  className
}) {
  return (
    <ol aria-label={label} className={cn('ds-stepper', className)}>
      {steps.map((step, index) => (
        <li
          key={step.id}
          aria-current={index === activeStep ? 'step' : undefined}
          data-complete={index < activeStep || undefined}
        >
          <span className='ds-step-number' aria-hidden='true'>
            {index < activeStep ? (
              <Icon name='Check' decorative size='xs' />
            ) : (
              index + 1
            )}
          </span>
          <span>
            <span className='ds-label'>{step.label}</span>
            {step.description && (
              <span className='ds-description'>{step.description}</span>
            )}
            {index < activeStep && <span className='sr-only'> Completed</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
