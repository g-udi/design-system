import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  FieldRoot as Field,
  FieldContent,
  FieldDescriptionPrimitive as FieldDescription,
  FieldLabelPrimitive as FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from '@gaudi/design-system/core/Field';
import {
  RadioGroupRoot as RadioGroup,
  RadioGroupItem
} from '@gaudi/design-system/core/RadioGroup';

const plans = [
  { value: 'free', title: 'Free', price: '$0', description: 'For a personal blog or a first newsletter.' },
  { value: 'pro', title: 'Pro', price: '$19', description: 'For writers who publish every week with a few editors.' },
  { value: 'enterprise', title: 'Enterprise', price: '$49', description: 'For newsrooms with several desks and review steps.' }
];
const reviewers = [
  { value: 'emma', name: 'Ilse Valtonen', handle: '@emmawilson', avatar: '/avatars/person-20.svg', initials: 'IV' },
  { value: 'john', name: 'John Doe', handle: '@johndoe', avatar: '/avatars/person-41.svg', initials: 'JD' }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xs gap-4'>
      <FieldSet className='gap-2'>
        <FieldLegend variant='label'>Plan</FieldLegend>
        <RadioGroup defaultValue='pro' aria-label='Plan' className='gap-2'>
          {plans.map((plan) => (
            <FieldLabel key={plan.value} htmlFor={`plan-${plan.value}`}>
              <Field orientation='horizontal'>
                <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} />
                <FieldContent>
                  <FieldTitle className='flex w-full items-center justify-between'>
                    <span>{plan.title}</span>
                    <span className='text-sm font-semibold tabular-nums'>{plan.price}/mo</span>
                  </FieldTitle>
                  <FieldDescription>{plan.description}</FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>
      <FieldSet className='gap-2'>
        <FieldLegend variant='label'>Reviewer</FieldLegend>
        <RadioGroup defaultValue='emma' aria-label='Reviewer' className='gap-2'>
          {reviewers.map((person) => (
            <FieldLabel key={person.value} htmlFor={`reviewer-${person.value}`}>
              <Field orientation='horizontal'>
                <FieldTitle className='flex flex-1 items-center gap-2'>
                  <Avatar size='sm'>
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.initials}</AvatarFallback>
                  </Avatar>
                  <span className='flex flex-col items-start'>
                    <span className='text-sm font-semibold'>{person.name}</span>
                    <span className='text-xs font-normal text-text-muted'>{person.handle}</span>
                  </span>
                </FieldTitle>
                <RadioGroupItem value={person.value} id={`reviewer-${person.value}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>
    </div>
  );
}
