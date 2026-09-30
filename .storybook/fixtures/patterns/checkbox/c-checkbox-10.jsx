import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
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
    <Frame className='w-full max-w-xs' spacing='sm'>
      <FrameHeader>
        <FrameTitle>Notification Settings</FrameTitle>
      </FrameHeader>
      <FramePanel className='overflow-hidden p-0!'>
        <FieldGroup className='gap-0'>
          <Field>
            <FieldLabel className='p-3'>
              <Checkbox defaultChecked />
              <FieldTitle>Push notifications</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className='p-3'>
              <Checkbox />
              <FieldTitle>Email notifications</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className='p-3'>
              <Checkbox />
              <FieldTitle>SMS notifications</FieldTitle>
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FramePanel>
    </Frame>
  );
}
