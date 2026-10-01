import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' }
];
const channels = [
  { value: 'email', label: 'Email', icon: 'MailIcon' },
  { value: 'phone', label: 'Phone', icon: 'SmartphoneIcon' },
  { value: 'chat', label: 'Chat', icon: 'MessageCircleIcon' }
];

function List({ title, defaultValue, items, trailing }) {
  return (
    <Frame spacing='sm'>
      <FrameHeader>
        <FrameTitle>{title}</FrameTitle>
      </FrameHeader>
      <FramePanel className='overflow-hidden p-0!'>
        <RadioGroup defaultValue={defaultValue} aria-label={title} className='gap-0'>
          {items.map((item, index) => (
            <div key={item.value}>
              {index > 0 && <Separator />}
              <label htmlFor={`${title}-${item.value}`} className='flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm font-medium'>
                {!trailing && <RadioGroupItem value={item.value} id={`${title}-${item.value}`} />}
                {item.icon && <RegistryIcon lucide={item.icon} aria-hidden='true' className='size-4 text-text-muted' />}
                <span className='flex-1'>{item.label}</span>
                {trailing && <RadioGroupItem value={item.value} id={`${title}-${item.value}`} />}
              </label>
            </div>
          ))}
        </RadioGroup>
      </FramePanel>
    </Frame>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      <List title='Language' defaultValue='en' items={languages} />
      <List title='Contact channel' defaultValue='email' items={channels} trailing />
    </div>
  );
}
