import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const Row = ({ label, gap = 'gap-2', children }) => (
  <>
    <span className='text-xs text-text-muted'>{label}</span>
    <div className={`flex flex-wrap items-center ${gap}`}>{children}</div>
  </>
);

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-3xl grid-cols-[5.5rem_1fr] items-center gap-x-3 gap-y-3'>
      <Row label='Leading icon'>
        <Button><RegistryIcon lucide='CloudDownloadIcon' aria-hidden='true' />Download</Button>
        <Button variant='secondary'><RegistryIcon lucide='GithubIcon' aria-hidden='true' />GitHub</Button>
        <Button variant='outline'><RegistryIcon lucide='PlusIcon' aria-hidden='true' />Add item</Button>
        <Button variant='ghost'><RegistryIcon lucide='SettingsIcon' aria-hidden='true' />Settings</Button>
        <Button variant='destructive'><RegistryIcon lucide='Trash2Icon' aria-hidden='true' />Delete account</Button>
      </Row>
      <Row label='Trailing icon'>
        <Button>Get started<RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' /></Button>
        <Button variant='secondary'>Open project<RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' /></Button>
        <Button variant='outline'>Options<RegistryIcon lucide='Settings2Icon' aria-hidden='true' /></Button>
        <Button variant='ghost'>Log out<RegistryIcon lucide='LogOutIcon' aria-hidden='true' /></Button>
        <Button variant='destructive'>Confirm removal<RegistryIcon lucide='CircleAlertIcon' aria-hidden='true' /></Button>
      </Row>
      <Row label='Icon only'>
        <Button size='icon-xs' variant='outline' aria-label='Close'><RegistryIcon lucide='XIcon' aria-hidden='true' /></Button>
        <Button size='icon-sm' variant='ghost' aria-label='Notifications'><RegistryIcon lucide='BellIcon' aria-hidden='true' /></Button>
        <Button size='icon' variant='secondary' aria-label='Search'><RegistryIcon lucide='SearchIcon' aria-hidden='true' /></Button>
        <Button size='icon-lg' aria-label='Play'><RegistryIcon lucide='PlayIcon' aria-hidden='true' /></Button>
      </Row>
      <Row label='Loading'>
        <Button disabled><Spinner aria-hidden='true' />Please wait</Button>
        <Button variant='outline' disabled><Spinner aria-hidden='true' />Uploading</Button>
      </Row>
      <Row label='Links' gap='gap-x-4 gap-y-2'>
        <Button asChild variant='outline'><a href='#home'>Back to home</a></Button>
        <Button variant='link'><RegistryIcon lucide='HelpCircleIcon' aria-hidden='true' />Help center</Button>
        <Button variant='link' className='group/back' asChild>
          <a href='#back'>
            <RegistryIcon lucide='ChevronLeftIcon' aria-hidden='true' className='transition-transform duration-200 group-hover/back:-translate-x-1' />
            Go back
          </a>
        </Button>
        <Button variant='link' className='group/docs' asChild>
          <a href='#docs'>
            View documentation
            <RegistryIcon lucide='ArrowUpRightIcon' aria-hidden='true' className='transition-transform duration-200 group-hover/docs:rotate-45' />
          </a>
        </Button>
      </Row>
      <Row label='Hover reveal'>
        <Button className='group/slide relative overflow-hidden px-6'>
          <span className='transition-transform duration-300 group-hover/slide:-translate-x-2'>Get started</span>
          <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' className='absolute right-2 translate-x-8 opacity-0 transition-all duration-300 group-hover/slide:translate-x-0 group-hover/slide:opacity-100' />
        </Button>
        <Button aria-label='Create new' className='group/fab relative w-8 justify-start overflow-hidden px-2 transition-[width] duration-300 hover:w-28 focus-visible:w-28'>
          <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
          <span className='opacity-0 transition-opacity duration-300 group-hover/fab:opacity-100 group-focus-visible/fab:opacity-100'>Create new</span>
        </Button>
      </Row>
    </div>
  );
}
