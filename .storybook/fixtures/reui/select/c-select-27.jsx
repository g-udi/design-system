// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const plans = [
  {
    value: 'startup',
    label: 'Startup',
    description: 'For small teams up to 10'
  },
  {
    value: 'business',
    label: 'Business',
    description: 'For growing companies'
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: 'Unlimited everything'
  }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={plans[0].value}>
        <SelectTrigger
          aria-label='Select plan'
          className='w-[240px] [&_span.text-ui-muted-foreground]:hidden'
        >
          <SelectValue placeholder='Select plan' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {plans.map((plan) => (
              <SelectItem
                key={plan.value}
                value={plan.value}
                className='[&_svg]:text-ui-primary'
              >
                <div className='flex flex-col items-start gap-px'>
                  <span className='font-medium'>{plan.label}</span>
                  <span className='text-ui-muted-foreground text-xs'>
                    {plan.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
