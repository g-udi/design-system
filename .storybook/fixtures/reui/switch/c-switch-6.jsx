// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs p-0'>
      <FieldGroup className='gap-0'>
        <Field>
          <FieldLabel className='justify-between px-4 py-3'>
            <FieldTitle>Push notifications</FieldTitle>
            <Switch defaultChecked />
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className='justify-between px-4 py-3'>
            <FieldTitle>Email notifications</FieldTitle>
            <Switch />
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className='justify-between px-4 py-3'>
            <FieldTitle>SMS notifications</FieldTitle>
            <Switch />
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Card>
  );
}
