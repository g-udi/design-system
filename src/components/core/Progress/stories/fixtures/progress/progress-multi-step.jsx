import Progress from '@gaudi/design-system/core/Progress';
import Stepper from '@gaudi/design-system/core/Stepper';
const steps = [
  { id: 'account', label: 'Account', completed: true },
  { id: 'profile', label: 'Profile', completed: true },
  { id: 'preferences', label: 'Preferences', completed: false },
  { id: 'review', label: 'Review', completed: false }
];
export function Pattern() {
  const completedSteps = steps.filter((step) => step.completed).length;
  return (
    <div className='mx-auto w-full max-w-xs space-y-4'>
      <Progress label='Setup Progress' value={completedSteps} max={steps.length} valueText={`${completedSteps} of ${steps.length} steps`} />
      <Stepper orientation='vertical' steps={steps} activeStep={completedSteps} label='Setup steps' />
    </div>
  );
}
