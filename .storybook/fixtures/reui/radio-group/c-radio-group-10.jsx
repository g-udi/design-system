// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
export function Pattern() {
  return (
    <Frame className='w-full max-w-xs' spacing='sm'>
      <FrameHeader>
        <FrameTitle>Language</FrameTitle>
      </FrameHeader>
      <FramePanel className='overflow-hidden p-0!'>
        <RadioGroup defaultValue='en'>
          <FieldGroup className='gap-0'>
            <Field>
              <FieldLabel className='p-3'>
                <RadioGroupItem value='en' id='lang-en' />
                <FieldTitle>English</FieldTitle>
              </FieldLabel>
            </Field>
            <Separator />
            <Field>
              <FieldLabel className='p-3'>
                <RadioGroupItem value='es' id='lang-es' />
                <FieldTitle>Spanish</FieldTitle>
              </FieldLabel>
            </Field>
            <Separator />
            <Field>
              <FieldLabel className='p-3'>
                <RadioGroupItem value='fr' id='lang-fr' />
                <FieldTitle>French</FieldTitle>
              </FieldLabel>
            </Field>
            <Separator />
            <Field>
              <FieldLabel className='p-3'>
                <RadioGroupItem value='de' id='lang-de' />
                <FieldTitle>German</FieldTitle>
              </FieldLabel>
            </Field>
          </FieldGroup>
        </RadioGroup>
      </FramePanel>
    </Frame>
  );
}
