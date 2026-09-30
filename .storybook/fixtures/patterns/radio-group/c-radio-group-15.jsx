import { Badge } from '../../../../src/components/core/Pill/parts/badge.jsx';
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const badge = 'h-4.5 rounded-control px-1.5 text-xs tracking-wider uppercase';
const visibility = [
  { value: 'public', label: 'Public', hint: 'Anyone on the internet can see this.' },
  { value: 'private', label: 'Private', hint: 'Only you and collaborators can access this.' }
];
const tones = [
  { value: 'info', label: 'Info', className: 'border-info data-checked:border-info [&_[data-slot=radio-group-indicator]]:text-info' },
  { value: 'success', label: 'Success', className: 'border-success data-checked:border-success [&_[data-slot=radio-group-indicator]]:text-success' },
  { value: 'warning', label: 'Warning', className: 'border-warning data-checked:border-warning [&_[data-slot=radio-group-indicator]]:text-warning' }
];

function Group({ legend, children }) {
  return (
    <FieldSet className='gap-2'>
      <FieldLegend variant='label'>{legend}</FieldLegend>
      {children}
    </FieldSet>
  );
}

export function Pattern() {
  return (
    <TooltipProvider>
      <div className='mx-auto grid w-full max-w-xs gap-4'>
        <Group legend='Visibility'>
          <RadioGroup defaultValue='public' aria-label='Visibility'>
            {visibility.map((item) => (
              <Field key={item.value} orientation='horizontal'>
                <RadioGroupItem value={item.value} id={`vis-${item.value}`} />
                <div className='flex items-center gap-1.5'>
                  <FieldLabel htmlFor={`vis-${item.value}`}>{item.label}</FieldLabel>
                  <Tooltip>
                    <TooltipTrigger className='text-text-muted' aria-label={`About ${item.label.toLowerCase()}`}>
                      <RegistryIcon lucide='HelpCircleIcon' aria-hidden='true' className='size-3.5' />
                    </TooltipTrigger>
                    <TooltipContent side='right'>{item.hint}</TooltipContent>
                  </Tooltip>
                </div>
              </Field>
            ))}
          </RadioGroup>
        </Group>
        <Group legend='Release channel'>
          <RadioGroup defaultValue='stable' aria-label='Release channel'>
            <Field orientation='horizontal'>
              <RadioGroupItem value='stable' id='ch-stable' />
              <div className='flex items-center gap-2'>
                <FieldLabel htmlFor='ch-stable'>Stable</FieldLabel>
                <Badge variant='secondary' className={badge}>Recommended</Badge>
              </div>
            </Field>
            <Field orientation='horizontal'>
              <RadioGroupItem value='beta' id='ch-beta' />
              <div className='flex items-center gap-2'>
                <FieldLabel htmlFor='ch-beta'>Beta</FieldLabel>
                <Badge className={badge}>New</Badge>
              </div>
            </Field>
            <Field orientation='horizontal'>
              <RadioGroupItem value='canary' id='ch-canary' />
              <FieldLabel htmlFor='ch-canary'>Canary</FieldLabel>
            </Field>
          </RadioGroup>
        </Group>
        <Group legend='Role'>
          <RadioGroup defaultValue='viewer' aria-label='Role' className='flex flex-wrap items-center gap-4'>
            {['Admin', 'Editor', 'Viewer'].map((role) => (
              <Field key={role} orientation='horizontal' className='w-auto'>
                <RadioGroupItem value={role.toLowerCase()} id={`role-${role.toLowerCase()}`} />
                <FieldLabel htmlFor={`role-${role.toLowerCase()}`}>{role}</FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </Group>
        <Group legend='Status colour'>
          <RadioGroup defaultValue='info' aria-label='Status colour' className='flex flex-wrap items-center gap-4'>
            {tones.map((tone) => (
              <Field key={tone.value} orientation='horizontal' className='w-auto'>
                <RadioGroupItem value={tone.value} id={`tone-${tone.value}`} className={tone.className} />
                <FieldLabel htmlFor={`tone-${tone.value}`}>{tone.label}</FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </Group>
      </div>
    </TooltipProvider>
  );
}
