import Pill from '@gaudi/design-system/core/Pill';
import { ProgressRoot } from '@gaudi/design-system/core/Progress';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '@gaudi/design-system/core/Card';
import {
  TableRoot as Table,
  TableBodyPrimitive as TableBody,
  TableCellPrimitive as TableCell,
  TableRowPrimitive as TableRow
} from '@gaudi/design-system/mdx/Table';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col'>
      <Frame spacing='sm'>
        <FrameHeader className='px-2!'>
          <FrameTitle>Server status</FrameTitle>
          <FrameDescription>
            Primary production server{' '}
            <Badge variant='outline' size='sm'>
              prod-api-us-east-1
            </Badge>
          </FrameDescription>
        </FrameHeader>
        <FramePanel className='p-0!'>
          <Table>
            <TableBody>
              <TableRow className='*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r'>
                <TableCell as='th' scope='row' className='bg-surface-muted w-40 py-2 text-sm font-medium'>
                  Status
                </TableCell>
                <TableCell className='py-2'>
                  <Pill tone='green' variant='subtle' pulse>Operational</Pill>
                </TableCell>
              </TableRow>
              <TableRow className='*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r'>
                <TableCell as='th' scope='row' className='bg-surface-muted py-2 text-sm font-medium'>
                  Instance Type
                </TableCell>
                <TableCell className='py-2'>
                  <span className='font-mono text-sm'>c6g.2xlarge</span>
                </TableCell>
              </TableRow>
              <TableRow className='*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r'>
                <TableCell as='th' scope='row' className='bg-surface-muted py-2 text-sm font-medium'>
                  Region
                </TableCell>
                <TableCell className='py-2 text-sm'>
                  US East (N. Virginia)
                </TableCell>
              </TableRow>
              <TableRow className='*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r'>
                <TableCell as='th' scope='row' className='bg-surface-muted py-2 text-sm font-medium'>
                  CPU Usage
                </TableCell>
                <TableCell className='py-2'>
                  <div className='flex items-center gap-3'>
                    <ProgressRoot value={42} aria-label='CPU usage' className='h-2 w-24' />
                    <span className='text-text-muted text-sm'>
                      42%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className='*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r'>
                <TableCell as='th' scope='row' className='bg-surface-muted py-2 text-sm font-medium'>
                  Memory
                </TableCell>
                <TableCell className='py-2'>
                  <div className='flex items-center gap-3'>
                    <ProgressRoot value={67} aria-label='Memory usage' className='h-2 w-24 *:data-[slot=progress-indicator]:bg-warning' />
                    <span className='text-text-muted text-sm'>
                      10.7 / 16 GB
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className='*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r'>
                <TableCell as='th' scope='row' className='bg-surface-muted py-2 text-sm font-medium'>
                  Uptime
                </TableCell>
                <TableCell className='py-2 text-sm'>
                  47 days, 12 hours
                </TableCell>
              </TableRow>
              <TableRow className='*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r'>
                <TableCell as='th' scope='row' className='bg-surface-muted py-2 text-sm font-medium'>
                  OS
                </TableCell>
                <TableCell className='py-2 text-sm'>
                  Amazon Linux 2023
                </TableCell>
              </TableRow>
              <TableRow className='*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r'>
                <TableCell as='th' scope='row' className='bg-surface-muted py-2 text-sm font-medium'>
                  Tags
                </TableCell>
                <TableCell className='py-2'>
                  <div className='flex flex-wrap gap-1.5'>
                    <Badge variant='secondary' size='sm'>
                      production
                    </Badge>
                    <Badge variant='secondary' size='sm'>
                      api
                    </Badge>
                    <Badge variant='secondary' size='sm'>
                      critical
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </FramePanel>
      </Frame>
    </div>
  );
}
