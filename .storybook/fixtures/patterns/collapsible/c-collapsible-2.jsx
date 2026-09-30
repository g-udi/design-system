import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const settings = [
  { id: 'push', label: 'Push notifications', defaultChecked: true },
  { id: 'email', label: 'Email notifications', defaultChecked: false },
  { id: 'sms', label: 'SMS notifications', defaultChecked: false }
];
export function Pattern() {
  return (
    <div className='h-40 w-full max-w-xs'>
      <Collapsible className='flex flex-col gap-2' defaultOpen>
        <CollapsibleTrigger asChild>
          <Button
            variant='outline'
            className='bg-ui-background! w-full justify-start'
          >
            <RegistryIcon
              lucide='ChevronRightIcon'
              aria-hidden='true'
              className='size-4 group-data-panel-open/button:rotate-90'
            />
            <span className='sr-only'>Toggle notification settings</span>
            Notification settings
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Card className='p-0'>
            <FieldGroup className='gap-0 divide-y'>
              {settings.map((item) => (
                <Field key={item.id}>
                  <FieldLabel className='px-3 py-2'>
                    <Checkbox defaultChecked={item.defaultChecked} />
                    <FieldTitle>{item.label}</FieldTitle>
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
