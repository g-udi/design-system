// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs p-0'>
      <FieldGroup className='gap-0'>
        <Field>
          <FieldLabel className='px-4 py-3'>
            <Checkbox defaultChecked />
            <FieldTitle>Push notifications</FieldTitle>
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className='px-4 py-3'>
            <Checkbox />
            <FieldTitle>Email notifications</FieldTitle>
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className='px-4 py-3'>
            <Checkbox />
            <FieldTitle>SMS notifications</FieldTitle>
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Card>
  );
}
