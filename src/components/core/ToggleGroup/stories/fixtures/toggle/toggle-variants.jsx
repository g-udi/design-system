import { default as Button } from '@gaudi/design-system/core/Button';
import { Toggle } from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const Row = ({ label, children }) => (
  <>
    <span className='text-xs text-text-muted'>{label}</span>
    <div className='flex flex-wrap items-center gap-2'>{children}</div>
  </>
);

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-lg grid-cols-[5.5rem_1fr] items-center gap-x-3 gap-y-3'>
      <Row label='Default'>
        <Toggle aria-label='Bold' defaultPressed><RegistryIcon lucide='BoldIcon' /></Toggle>
        <Toggle aria-label='Italic'><RegistryIcon lucide='ItalicIcon' /></Toggle>
        <Toggle aria-label='Underline'><RegistryIcon lucide='UnderlineIcon' /></Toggle>
        <Toggle aria-label='Strikethrough' disabled><RegistryIcon lucide='StrikethroughIcon' /></Toggle>
      </Row>
      <Row label='Outline'>
        <Toggle variant='outline' defaultPressed><RegistryIcon lucide='EyeIcon' />Preview</Toggle>
        <Toggle variant='outline'><RegistryIcon lucide='StarIcon' />Starred</Toggle>
        <Toggle variant='outline'>
          <RegistryIcon lucide='BookmarkIcon' className='group-data-[state=on]/toggle:fill-current' />
          Bookmark
        </Toggle>
        <Toggle variant='outline' disabled>Disabled</Toggle>
      </Row>
      <Row label='Sizes'>
        {['sm', 'default', 'lg'].map((size) => (
          <Toggle key={size} variant='outline' size={size}>
            <RegistryIcon lucide='StarIcon' />
            {size === 'default' ? 'Default' : size === 'sm' ? 'Small' : 'Large'}
          </Toggle>
        ))}
      </Row>
      <Row label='With buttons'>
        <Button size='sm' variant='outline' tone='neutral'>Button</Button>
        <Toggle variant='outline' size='sm'>Toggle</Toggle>
        <Button size='icon' variant='outline' tone='neutral' aria-label='Bold button'><RegistryIcon lucide='BoldIcon' aria-hidden='true' /></Button>
        <Toggle variant='outline' aria-label='Bold toggle'><RegistryIcon lucide='BoldIcon' /></Toggle>
      </Row>
    </div>
  );
}
