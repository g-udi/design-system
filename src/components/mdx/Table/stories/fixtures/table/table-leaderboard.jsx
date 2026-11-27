import { Badge } from '@gaudi/design-system/core/Pill';
import { getAvatarInitials,
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  TableRoot as Table,
  TableBodyPrimitive as TableBody,
  TableCellPrimitive as TableCell,
  TableHeadPrimitive as TableHead,
  TableHeader,
  TableRowPrimitive as TableRow
} from '@gaudi/design-system/mdx/Table';
import { StatDelta } from '@gaudi/design-system/blocks/StatCard';
const leaders = [
  {
    rank: 1,
    name: 'Sabine Okafor',
    handle: '@sarahchen',
    avatar:
      '/avatars/person-20.svg',
    score: 12840,
    change: '+320',
    changeUp: true,
    level: 'Diamond',
    levelVariant: 'info'
  },
  {
    rank: 2,
    name: 'Dorian Oduya',
    handle: '@marcusj',
    avatar:
      '/avatars/person-41.svg',
    score: 11250,
    change: '+180',
    changeUp: true,
    level: 'Platinum',
    levelVariant: 'default'
  },
  {
    rank: 3,
    name: 'Juno Saarinen',
    handle: '@emilyp',
    avatar:
      '/avatars/person-25.svg',
    score: 10890,
    change: '-45',
    changeUp: false,
    level: 'Platinum',
    levelVariant: 'default'
  },
  {
    rank: 4,
    name: 'Ottilie Nakamura',
    handle: '@davidk',
    avatar:
      '/avatars/person-43.svg',
    score: 9420,
    change: '+520',
    changeUp: true,
    level: 'Gold',
    levelVariant: 'warning'
  },
  {
    rank: 5,
    name: 'Sorrel Davanzo',
    handle: '@sofiad',
    avatar:
      '/avatars/person-19.svg',
    score: 8750,
    change: '+90',
    changeUp: true,
    level: 'Gold',
    levelVariant: 'warning'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12 text-center'>#</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Level</TableHead>
            <TableHead className='text-right'>Score</TableHead>
            <TableHead className='text-right'>Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaders.map((leader) => (
            <TableRow key={leader.rank}>
              <TableCell className='text-center text-sm font-bold'>
                {leader.rank}
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <Avatar size='sm'>
                    <AvatarImage src={leader.avatar} alt={leader.name} />
                    <AvatarFallback>
                      {getAvatarInitials(leader.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>{leader.name}</span>
                    <span className='text-text-muted text-xs'>
                      {leader.handle}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={leader.levelVariant} size='sm'>
                  {leader.level}
                </Badge>
              </TableCell>
              <TableCell className='text-right font-mono text-sm font-medium'>
                {leader.score.toLocaleString()}
              </TableCell>
              <TableCell className='text-right'>
                <StatDelta value={leader.change} direction={leader.changeUp ? 'up' : 'down'} tone={leader.changeUp ? 'success' : 'danger'} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
