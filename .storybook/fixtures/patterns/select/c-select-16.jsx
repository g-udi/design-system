import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';

const accessLevels = [
  { value: 'full', label: 'Full access', description: 'Can manage members and billing' },
  { value: 'edit', label: 'Read and write', description: 'Can edit and publish lists' },
  { value: 'view', label: 'Read only', description: 'Can only view lists' },
  { value: 'none', label: 'No access', description: 'Cannot view or edit lists' }
];
const plans = [
  { value: 'starter', label: 'Starter', description: 'For individuals getting started' },
  { value: 'team', label: 'Team', description: 'For growing teams up to 25' },
  { value: 'enterprise', label: 'Enterprise', description: 'Unlimited seats and SSO' }
];

function TwoLine({ item }) {
  return (
    <span className='flex flex-col items-start gap-px text-left'>
      <span className='font-medium'>{item.label}</span>
      <small className='text-xs text-text-muted'>{item.description}</small>
    </span>
  );
}

// Options with a second line. The access trigger hides the description to stay
// one line; the plan trigger grows to show both lines.
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      <Field>
        <FieldLabel htmlFor='select-access'>Access level</FieldLabel>
        <Select defaultValue='edit'>
          <SelectTrigger id='select-access' className='w-full [&_small]:hidden'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectGroup>
              {accessLevels.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <TwoLine item={item} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor='select-plan'>Plan</FieldLabel>
        <Select defaultValue='team'>
          <SelectTrigger id='select-plan' className='h-auto! w-full py-1.5'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectGroup>
              {plans.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <TwoLine item={item} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
