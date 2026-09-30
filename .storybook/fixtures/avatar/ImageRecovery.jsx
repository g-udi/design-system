import { useState } from 'react';
import { Avatar } from '../../../src/components/core/Avatar/index.js';
import { default as Button } from '../../../src/components/core/Button/index.js';

const image = 'https://randomuser.me/api/portraits/women/44.jpg';
const broken = 'data:image/png;base64,broken';

export function ImageRecovery() {
  const [source, setSource] = useState(broken);
  const [status, setStatus] = useState('loading');
  return (
    <div className='grid justify-items-start gap-4'>
      <div className='flex items-center gap-4'>
        <Avatar name='Maya Chen' src={source} size='xl' shape='tile' tone='teal' onLoadingStatusChange={setStatus} data-testid='recovering-avatar' />
        <div><p className='font-medium'>Maya Chen</p><p className='text-sm text-ui-muted-foreground' role='status'>{status === 'loaded' ? 'Image loaded' : status === 'error' ? 'Image unavailable — initials shown' : 'Loading image — initials shown'}</p></div>
      </div>
      <div className='flex flex-wrap gap-2'>
        <Button variant='outline' onClick={() => setSource(image)}>Load sample photo</Button>
        <Button variant='outline' tone='neutral' onClick={() => setSource(broken)}>Use broken image</Button>
        <Button variant='ghost' tone='neutral' onClick={() => setSource('')}>Remove image</Button>
      </div>
    </div>
  );
}
