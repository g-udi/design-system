// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs p-0'>
      <RadioGroup defaultValue='standard'>
        <FieldGroup className='gap-0'>
          <Field>
            <FieldLabel className='px-4 py-3'>
              <RadioGroupItem value='standard' id='ship-standard' />
              <FieldTitle>Standard Shipping</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className='px-4 py-3'>
              <RadioGroupItem value='express' id='ship-express' />
              <FieldTitle>Express Shipping</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className='px-4 py-3'>
              <RadioGroupItem value='overnight' id='ship-overnight' />
              <FieldTitle>Overnight Shipping</FieldTitle>
            </FieldLabel>
          </Field>
        </FieldGroup>
      </RadioGroup>
    </Card>
  );
}
