// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import {
  CascaderAction,
  CascaderFooter,
  CascaderSubmenu,
  CascaderSubmenuContent,
  CascaderSubmenuTrigger,
  useCascaderSubmenu
} from '../../../../src/components/core/Cascader/parts/cascader-footer-extended.jsx';
import {
  CascaderGroup,
  CascaderItems,
  CascaderLabel,
  CascaderSeparator
} from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { Dropbox } from '../../../../src/icons/brands/dropbox.jsx';
import { GithubDark } from '../../../../src/icons/brands/githubDark.jsx';
import { GithubLight } from '../../../../src/icons/brands/githubLight.jsx';
import { GoogleDrive } from '../../../../src/icons/brands/googleDrive.jsx';
import { Redis } from '../../../../src/icons/brands/redis.jsx';
import { Slack } from '../../../../src/icons/brands/slack.jsx';
import { Stripe } from '../../../../src/icons/brands/stripe.jsx';
import { Supabase } from '../../../../src/icons/brands/supabase.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const basicsIcon = <RegistryIcon lucide='FileTextIcon' className='size-4' />;
const peopleIcon = <RegistryIcon lucide='UsersIcon' className='size-4' />;
const datesIcon = <RegistryIcon lucide='CalendarDaysIcon' className='size-4' />;
const workflowIcon = <RegistryIcon lucide='RouteIcon' className='size-4' />;
const metricsIcon = <RegistryIcon lucide='BarChart3Icon' className='size-4' />;
const linksIcon = <RegistryIcon lucide='LinkIcon' className='size-4' />;
const billingIcon = <RegistryIcon lucide='CreditCardIcon' className='size-4' />;
const textIcon = <RegistryIcon lucide='TypeIcon' className='size-4' />;
const longTextIcon = <RegistryIcon lucide='AlignLeftIcon' className='size-4' />;
const slugIcon = <RegistryIcon lucide='HashIcon' className='size-4' />;
const personIcon = <RegistryIcon lucide='UserIcon' className='size-4' />;
const approverIcon = <RegistryIcon lucide='UserCheckIcon' className='size-4' />;
const watcherIcon = <RegistryIcon lucide='EyeIcon' className='size-4' />;
const timestampIcon = <RegistryIcon lucide='ClockIcon' className='size-4' />;
const deadlineIcon = (
  <RegistryIcon lucide='CalendarCheckIcon' className='size-4' />
);
const shippedIcon = <RegistryIcon lucide='TruckIcon' className='size-4' />;
const statusIcon = <RegistryIcon lucide='FlagIcon' className='size-4' />;
const priorityIcon = <RegistryIcon lucide='FlameIcon' className='size-4' />;
const stageIcon = <RegistryIcon lucide='Columns3Icon' className='size-4' />;
const effortIcon = (
  <RegistryIcon lucide='SlidersHorizontalIcon' className='size-4' />
);
const impactIcon = <RegistryIcon lucide='TrendingUpIcon' className='size-4' />;
const repositoryIcon = (
  <RegistryIcon lucide='GitBranchIcon' className='size-4' />
);
const designIcon = <RegistryIcon lucide='PaletteIcon' className='size-4' />;
const planIcon = <RegistryIcon lucide='PackageIcon' className='size-4' />;
const seatsIcon = <RegistryIcon lucide='UsersRoundIcon' className='size-4' />;
const noteIcon = <RegistryIcon lucide='SquarePenIcon' className='size-4' />;
const importIcon = (
  <RegistryIcon lucide='CloudDownloadIcon' className='size-4' />
);
const slackLogo = <Slack className='size-4' aria-hidden='true' />;
const githubLogo = (
  <>
    <GithubLight className='size-4 dark:hidden' aria-hidden='true' />
    <GithubDark className='hidden size-4 dark:block' aria-hidden='true' />
  </>
);
const driveLogo = <GoogleDrive className='size-4' aria-hidden='true' />;
const dropboxLogo = <Dropbox className='size-4' aria-hidden='true' />;
const supabaseLogo = <Supabase className='size-4' aria-hidden='true' />;
const stripeLogo = <Stripe className='size-4' aria-hidden='true' />;
const redisLogo = <Redis className='size-4' aria-hidden='true' />;
const properties = [
  {
    value: 'basics',
    label: 'Basics',
    icon: basicsIcon,
    children: [
      { value: 'basics.title', label: 'Title', icon: textIcon },
      { value: 'basics.summary', label: 'Summary', icon: longTextIcon },
      { value: 'basics.slug', label: 'Slug', icon: slugIcon }
    ]
  },
  {
    value: 'people',
    label: 'People',
    icon: peopleIcon,
    children: [
      { value: 'people.owner', label: 'Owner', icon: personIcon },
      { value: 'people.reviewers', label: 'Reviewers', icon: approverIcon },
      { value: 'people.watchers', label: 'Watchers', icon: watcherIcon }
    ]
  },
  {
    value: 'dates',
    label: 'Dates',
    icon: datesIcon,
    children: [
      { value: 'dates.created', label: 'Created at', icon: timestampIcon },
      { value: 'dates.due', label: 'Due date', icon: deadlineIcon },
      { value: 'dates.shipped', label: 'Shipped at', icon: shippedIcon }
    ]
  },
  {
    value: 'workflow',
    label: 'Workflow',
    icon: workflowIcon,
    children: [
      { value: 'workflow.status', label: 'Status', icon: statusIcon },
      { value: 'workflow.priority', label: 'Priority', icon: priorityIcon },
      { value: 'workflow.stage', label: 'Stage', icon: stageIcon }
    ]
  },
  {
    value: 'metrics',
    label: 'Metrics',
    icon: metricsIcon,
    children: [
      { value: 'metrics.effort', label: 'Effort', icon: effortIcon },
      { value: 'metrics.impact', label: 'Impact', icon: impactIcon }
    ]
  },
  {
    value: 'links',
    label: 'Links',
    icon: linksIcon,
    children: [
      { value: 'links.repo', label: 'Repository', icon: repositoryIcon },
      { value: 'links.design', label: 'Design file', icon: designIcon }
    ]
  },
  {
    value: 'billing',
    label: 'Billing',
    icon: billingIcon,
    children: [
      { value: 'billing.plan', label: 'Plan', icon: planIcon },
      { value: 'billing.seats', label: 'Seats', icon: seatsIcon }
    ]
  },
  { value: 'notes', label: 'Notes', icon: noteIcon }
];
function ImportSourceMenu({ onImport }) {
  const { close } = useCascaderSubmenu();
  const run = (source) => () => {
    onImport(source);
    close();
  };
  return (
    <>
      <CascaderGroup className='gap-0.5'>
        <CascaderLabel>Apps</CascaderLabel>
        <CascaderAction icon={slackLogo} onSelect={run('Slack')}>
          Slack
        </CascaderAction>
        <CascaderAction icon={githubLogo} onSelect={run('GitHub')}>
          GitHub
        </CascaderAction>
        <CascaderAction icon={driveLogo} onSelect={run('Google Drive')}>
          Google Drive
        </CascaderAction>
        <CascaderAction icon={dropboxLogo} onSelect={run('Dropbox')}>
          Dropbox
        </CascaderAction>
      </CascaderGroup>

      <CascaderSeparator />

      <CascaderGroup className='gap-0.5'>
        <CascaderLabel>Data sources</CascaderLabel>
        <CascaderAction icon={supabaseLogo} onSelect={run('Supabase')}>
          Supabase
        </CascaderAction>
        <CascaderAction icon={stripeLogo} onSelect={run('Stripe')}>
          Stripe
        </CascaderAction>
        <CascaderAction icon={redisLogo} onSelect={run('Redis')}>
          Redis
        </CascaderAction>
      </CascaderGroup>
    </>
  );
}
export function Pattern() {
  const [value, setValue] = useState('');
  const [log, setLog] = useState('');
  return (
    <div className='flex w-full flex-col items-center gap-3 self-start px-4 pt-6 pb-4'>
      <Cascader items={properties} value={value} onValueChange={setValue}>
        <CascaderTrigger
          aria-label='Property'
          render={
            <Button
              variant='outline'
              className='w-72 justify-between gap-2 font-normal'
            />
          }
        >
          <CascaderValue placeholder='Select a property' />
        </CascaderTrigger>

        <CascaderContent className='w-72'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>

            {/* A SIBLING of the list, never a child of it: anything rendered
       inside the list would be clicked by the list's own Enter
       handler. */}
            <CascaderFooter>
              <CascaderSubmenu>
                <CascaderSubmenuTrigger icon={importIcon}>
                  Import properties from
                </CascaderSubmenuTrigger>
                <CascaderSubmenuContent>
                  <ImportSourceMenu
                    onImport={(source) => setLog(`Importing from ${source}`)}
                  />
                </CascaderSubmenuContent>
              </CascaderSubmenu>
            </CascaderFooter>

            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>

      <p className='text-ui-muted-foreground min-h-4 text-xs' role='status'>
        {log}
      </p>
    </div>
  );
}
