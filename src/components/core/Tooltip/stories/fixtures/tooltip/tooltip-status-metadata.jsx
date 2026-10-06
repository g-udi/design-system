import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const services = [
  { name: 'API', status: 'Operational', tone: 'success' },
  { name: 'Database', status: 'Operational', tone: 'success' },
  { name: 'CDN', status: 'Degraded', tone: 'warning' }
];
const labels = [
  { name: 'Bug', tone: 'destructive' },
  { name: 'Frontend', tone: 'info' },
  { name: 'High priority', tone: 'warning' }
];
export function Pattern() {
  return (
    <TooltipProvider>
      <div className='mx-auto flex w-full max-w-lg flex-wrap items-center justify-center gap-3'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='sm'>
              <RegistryIcon lucide='FileTextIcon' className='size-4' aria-hidden='true' />
              report-q4.pdf
            </Button>
          </TooltipTrigger>
          <TooltipContent className='p-2'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <RegistryIcon lucide='FileTextIcon' className='size-4 shrink-0' aria-hidden='true' />
                <div className='flex flex-col'>
                  <span className='font-medium'>report-q4.pdf</span>
                  <span className='opacity-80'>2.4 MB · Uploaded 3 days ago</span>
                </div>
              </div>
              <div className='flex items-center gap-1'>
                <Badge variant='info' size='xs'>PDF</Badge>
                <Badge variant='success' size='xs'>Verified</Badge>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='sm'>
              <RegistryIcon lucide='TagIcon' className='size-3.5' aria-hidden='true' />
              3 labels
            </Button>
          </TooltipTrigger>
          <TooltipContent className='p-2'>
            <div className='flex items-center gap-1'>
              {labels.map((label) => (
                <Badge key={label.name} variant={label.tone} size='xs'>
                  {label.name}
                </Badge>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
        <span className='inline-flex items-center gap-1 text-sm'>
          gaudi.dev
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon-xs' aria-label='Verified domain'>
                <RegistryIcon lucide='BadgeCheckIcon' className='size-4 text-success' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Domain ownership has been confirmed</TooltipContent>
          </Tooltip>
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='outline' size='sm'>
              <span className='size-2 rounded-full bg-warning' aria-hidden='true' />
              System status
            </Button>
          </TooltipTrigger>
          <TooltipContent className='p-2'>
            <div className='flex flex-col gap-1.5'>
              {services.map((service) => (
                <div key={service.name} className='flex items-center justify-between gap-4'>
                  <span className='font-medium'>{service.name}</span>
                  <Badge variant={service.tone} size='xs'>{service.status}</Badge>
                </div>
              ))}
              <p className='opacity-80'>Updated 2 min ago</p>
            </div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='outline' size='icon-sm' aria-label='Reset workspace'>
              <RegistryIcon lucide='AlertTriangleIcon' aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className='flex items-center gap-2'>
              <RegistryIcon lucide='AlertTriangleIcon' className='size-4 shrink-0' aria-hidden='true' />
              This action cannot be undone
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
