import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const settings = [
  { id: 'push', icon: 'BellIcon', title: 'Push notifications', description: 'Alerts on your phone while you are away.', checked: true },
  { id: 'email', icon: 'MailIcon', title: 'Email notifications', description: 'Replies, mentions and review requests.', checked: true },
  { id: 'status', icon: 'EyeIcon', title: 'Show online status', description: 'Teammates see when you are active.', checked: false },
  { id: 'data', icon: 'ShieldIcon', title: 'Allow data collection', description: 'Share anonymous usage to improve the product.', checked: false }
];

export function Pattern() {
  return (
    <Frame className='mx-auto w-full max-w-sm' spacing='sm'>
      <FrameHeader>
        <FrameTitle>Notifications and privacy</FrameTitle>
      </FrameHeader>
      <FramePanel className='overflow-hidden p-0!'>
        {settings.map((setting, index) => (
          <div key={setting.id}>
            {index > 0 && <Separator />}
            <label htmlFor={`sw-${setting.id}`} className='flex cursor-pointer items-center gap-3 px-3 py-2.5'>
              <RegistryIcon lucide={setting.icon} aria-hidden='true' className='size-4 shrink-0 text-text-muted' />
              <span className='flex min-w-0 flex-1 flex-col gap-0.5'>
                <span className='text-sm font-medium'>{setting.title}</span>
                <span className='text-xs text-text-muted'>{setting.description}</span>
              </span>
              <Switch id={`sw-${setting.id}`} size='sm' defaultChecked={setting.checked} />
            </label>
          </div>
        ))}
      </FramePanel>
    </Frame>
  );
}
