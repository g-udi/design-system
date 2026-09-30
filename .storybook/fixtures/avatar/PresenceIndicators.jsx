import { Avatar, AvatarBadge } from '../../../src/components/core/Avatar/index.js';

export function PresenceIndicators() {
  const states = [
    { label: 'Online', tone: 'success' },
    { label: 'Away', tone: 'warning', position: 'top-end' },
    { label: 'Do not disturb', tone: 'danger', icon: 'Minus' },
    { label: 'Offline', tone: 'neutral', position: 'bottom-start' },
    { label: 'Verified', tone: 'primary', icon: 'Check', position: 'top-start' }
  ];
  return (
    <div className='flex flex-wrap items-start gap-6'>
      {states.map((indicator) => <div key={indicator.label} className='grid w-20 justify-items-center gap-3 text-center'><Avatar name='Maya Chen' src='https://randomuser.me/api/portraits/women/44.jpg' size='lg' shape='circle' tone='teal' indicator={indicator} /><span className='text-xs text-ui-muted-foreground'>{indicator.label}</span></div>)}
      <div className='grid w-20 justify-items-center gap-3 text-center'>
        <Avatar name='Alex Johnson' src='https://randomuser.me/api/portraits/men/32.jpg' size='lg' shape='circle' tone='blue' aria-label='Alex Johnson, online, 3 unread messages' indicator={{ label: 'Online', tone: 'success' }}>
          <AvatarBadge className='inset-auto -top-1 -right-1 size-5 bg-red-600 text-[10px] text-white' aria-hidden='true'>3</AvatarBadge>
        </Avatar>
        <span className='text-xs text-ui-muted-foreground'>Unread messages</span>
      </div>
      <div dir='rtl' className='grid w-20 justify-items-center gap-3 text-center'>
        <Avatar name='محمد أحمد' src='https://randomuser.me/api/portraits/men/49.jpg' size='lg' shape='circle' tone='teal' indicator={{ label: 'موثّق', tone: 'primary', icon: 'Check', position: 'top-start' }} />
        <span className='text-xs text-ui-muted-foreground'>موثّق</span>
      </div>
    </div>
  );
}
