import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs'>
      <FieldLabel htmlFor='sw-danger'>
        <Field orientation='horizontal'>
          <FieldContent>
            <FieldTitle className='text-ui-destructive'>
              Delete all data on sign out
            </FieldTitle>
            <FieldDescription>
              When enabled, all local data will be permanently removed when you
              sign out. This action cannot be undone.
            </FieldDescription>
          </FieldContent>
          <Switch id='sw-danger' className='data-checked:bg-ui-destructive' />
        </Field>
      </FieldLabel>
    </div>
  );
}
