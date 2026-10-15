import { useEffect, useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CardRoot as Card, CardAction, CardContent, CardHeader, CardTitle } from '@gaudi/design-system/core/Card';
import { Badge } from '@gaudi/design-system/core/Pill';
import { SkeletonMorph, SkeletonMorphBlock } from '@gaudi/design-system/core/Skeleton';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Illustrative data; the delay stands in for a request.
const profile = { name: 'Mara Lindqvist', role: 'Editor, Field Notes', bio: 'Writes about cities, maps and the people who draw them. Currently editing a series on river towns.' };
const payouts = [
  { id: 'p1', label: 'October issue', amount: '€1,240.00', status: 'Paid' },
  { id: 'p2', label: 'River towns, part 2', amount: '€860.00', status: 'Scheduled' },
  { id: 'p3', label: 'Map essays bundle', amount: '€410.00', status: 'Scheduled' }
];

function useDemoRequest(delay = 1400) {
  const [ request, setRequest ] = useState(0);
  const [ loading, setLoading ] = useState(true);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [ request, delay ]);
  return { loading, reload: () => setRequest((value) => value + 1) };
}

export function Pattern() {
  const { loading, reload } = useDemoRequest();
  return (
    <div className='mx-auto grid w-full max-w-md gap-4'>
      <Card>
        <SkeletonMorph loading={loading} label='Loading profile' as={CardContent} className='flex items-start gap-3 pt-4'>
          <SkeletonMorphBlock shape='circle' width={48} height={48} className='shrink-0'>
            <Avatar className='size-12'>
              <AvatarImage src='/avatars/person-23.svg' alt='' />
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
          </SkeletonMorphBlock>
          <div className='grid min-w-0 flex-1 gap-1'>
            <SkeletonMorphBlock width={140} lines={1}>
              <p className='m-0 leading-5 font-semibold'>{profile.name}</p>
            </SkeletonMorphBlock>
            <SkeletonMorphBlock width={110} lines={1}>
              <p className='text-text-muted m-0 text-sm leading-5'>{profile.role}</p>
            </SkeletonMorphBlock>
            <SkeletonMorphBlock lines={2}>
              <p className='m-0 text-sm leading-5'>{profile.bio}</p>
            </SkeletonMorphBlock>
          </div>
        </SkeletonMorph>
      </Card>
      <Card>
        <CardHeader className='items-center'>
          <CardTitle>Payouts</CardTitle>
          <CardAction>
            <Button variant='outline' size='sm' onClick={reload} disabled={loading}>
              <RegistryIcon lucide='RotateCw' aria-hidden='true' />
              Reload
            </Button>
          </CardAction>
        </CardHeader>
        <SkeletonMorph loading={loading} label='Loading payouts' as={CardContent}>
          <ul className='m-0 grid list-none gap-3 p-0'>
            {payouts.map((payout) => (
              <li key={payout.id} className='flex items-center justify-between gap-3'>
                <SkeletonMorphBlock width={150} lines={1} className='min-w-0'>
                  <span className='block truncate text-sm leading-5'>{payout.label}</span>
                </SkeletonMorphBlock>
                <SkeletonMorphBlock width={120} height={20}>
                  <span className='flex items-center gap-2 text-sm tabular-nums'>
                    {payout.amount}
                    <Badge variant={payout.status === 'Paid' ? 'success-light' : 'secondary'} size='sm'>{payout.status}</Badge>
                  </span>
                </SkeletonMorphBlock>
              </li>
            ))}
          </ul>
        </SkeletonMorph>
      </Card>
    </div>
  );
}
