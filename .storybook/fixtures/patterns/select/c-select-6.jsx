import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
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
    name: 'Starter',
    description: 'Perfect for individuals getting started.'
  },
  {
    name: 'Professional',
    description: 'Ideal for growing teams and businesses.'
  },
  {
    name: 'Enterprise',
    description: 'Advanced features for large organizations.'
  }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue='Starter'>
        <SelectTrigger aria-label='Select plan' className='h-auto! w-full'>
          <SelectValue placeholder='Select plan' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {plans.map((plan) => (
              <SelectItem key={plan.name} value={plan.name}>
                <SelectPlanItem plan={plan} />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
function SelectPlanItem({ plan }) {
  return (
    <Item size='xs' className='w-full p-0'>
      <ItemContent className='gap-0'>
        <ItemTitle>{plan.name}</ItemTitle>
        <ItemDescription className='text-xs'>
          {plan.description}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
