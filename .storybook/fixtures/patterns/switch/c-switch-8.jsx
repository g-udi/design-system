import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
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
    <Frame className='w-full max-w-xs' spacing='sm'>
      <FrameHeader>
        <FrameTitle>Privacy Settings</FrameTitle>
      </FrameHeader>
      <FramePanel className='overflow-hidden p-0!'>
        <FieldGroup className='gap-0'>
          <Field>
            <FieldLabel className='justify-between p-3'>
              <FieldTitle>Profile visibility</FieldTitle>
              <Switch defaultChecked />
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className='justify-between p-3'>
              <FieldTitle>Show online status</FieldTitle>
              <Switch defaultChecked />
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className='justify-between p-3'>
              <FieldTitle>Allow data collection</FieldTitle>
              <Switch />
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FramePanel>
    </Frame>
  );
}
