import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const item = {
  label: 'Documentation',
  description:
    'Find guides, API references, and examples to integrate with our platform.',
  link: 'View docs',
  icon: <RegistryIcon lucide='BookOpenIcon' aria-hidden='true' />
};
export function Pattern() {
  return (
    <Card className='w-full max-w-xs p-0'>
      <CardContent className='p-0'>
        <div className='border-b px-4 py-3'>
          <div className='text-ui-muted-foreground flex items-center gap-2 [&_svg]:size-4'>
            {item.icon}
            <span className='text-ui-foreground text-sm font-medium'>
              {item.label}
            </span>
          </div>
        </div>
        <div className='space-y-3 p-4'>
          <p className='text-ui-muted-foreground text-sm leading-relaxed'>
            {item.description}
          </p>
          <a
            href='#'
            className='text-ui-primary inline-flex items-center gap-1 text-xs font-medium hover:underline'
          >
            <RegistryIcon
              lucide='LinkIcon'
              aria-hidden='true'
              className='size-2.5 shrink-0'
            />
            {item.link}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
