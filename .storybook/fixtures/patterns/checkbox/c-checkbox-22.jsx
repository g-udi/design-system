import { Badge } from '../../../../src/components/core/Pill/parts/badge.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const badge = 'h-4.5 rounded-control px-1.5 text-xs tracking-wider uppercase';
const tones = [
  { id: 'cb-info', label: 'Info', className: 'data-checked:border-info data-checked:bg-info' },
  { id: 'cb-success', label: 'Success', className: 'data-checked:border-success data-checked:bg-success' },
  { id: 'cb-warning', label: 'Warning', className: 'data-checked:border-warning data-checked:bg-warning' }
];

export function Pattern() {
  return (
    <TooltipProvider>
      <div className='mx-auto grid w-full max-w-xs gap-3'>
        <Field orientation='horizontal'>
          <Checkbox id='cb-analytics' />
          <div className='flex items-center gap-1.5'>
            <FieldLabel htmlFor='cb-analytics'>Enable advanced analytics</FieldLabel>
            <Tooltip>
              <TooltipTrigger className='text-text-muted' aria-label='About advanced analytics'>
                <RegistryIcon lucide='HelpCircleIcon' aria-hidden='true' className='size-3.5' />
              </TooltipTrigger>
              <TooltipContent side='right'>Deeper insight into user behaviour and performance.</TooltipContent>
            </Tooltip>
          </div>
        </Field>
        <Field orientation='horizontal'>
          <Checkbox id='cb-suggestions' defaultChecked />
          <div className='flex items-center gap-2'>
            <FieldLabel htmlFor='cb-suggestions'>AI-powered suggestions</FieldLabel>
            <Badge className={badge}>New</Badge>
          </div>
        </Field>
        <Field orientation='horizontal'>
          <Checkbox id='cb-beta' />
          <div className='flex items-center gap-2'>
            <FieldLabel htmlFor='cb-beta'>Beta feature access</FieldLabel>
            <Badge variant='secondary' className={badge}>Beta</Badge>
          </div>
        </Field>
        {/* A round checkbox that strikes through its label, for to-do lists. */}
        <Field orientation='horizontal'>
          <Checkbox id='cb-todo' className='rounded-full' defaultChecked />
          <FieldLabel
            htmlFor='cb-todo'
            className='relative transition-colors peer-data-checked:text-text-muted after:absolute after:inset-x-0 after:top-1/2 after:h-px after:-translate-y-1/2 after:scale-x-0 after:bg-current after:transition-transform peer-data-checked:after:scale-x-100'
          >
            Send the release notes
          </FieldLabel>
        </Field>
        <div className='flex flex-wrap items-center gap-4'>
          {tones.map((tone) => (
            <Field key={tone.id} orientation='horizontal' className='w-auto'>
              <Checkbox id={tone.id} defaultChecked className={tone.className} />
              <FieldLabel htmlFor={tone.id}>{tone.label}</FieldLabel>
            </Field>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
