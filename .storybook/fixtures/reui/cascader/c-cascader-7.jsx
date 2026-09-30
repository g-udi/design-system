// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Cascader,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import { CascaderItems } from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const gettingStartedIcon = (
  <RegistryIcon lucide='RocketIcon' className='size-4' />
);
const componentsIcon = (
  <RegistryIcon lucide='LayoutGridIcon' className='size-4' />
);
const primitivesIcon = <RegistryIcon lucide='LayersIcon' className='size-4' />;
const guidesIcon = <RegistryIcon lucide='BookOpenIcon' className='size-4' />;
const stylesIcon = <RegistryIcon lucide='PaletteIcon' className='size-4' />;
const integrationsIcon = (
  <RegistryIcon lucide='PuzzleIcon' className='size-4' />
);
const mcpIcon = <RegistryIcon lucide='BotIcon' className='size-4' />;
const changelogIcon = <RegistryIcon lucide='TagIcon' className='size-4' />;
const installIcon = <RegistryIcon lucide='DownloadIcon' className='size-4' />;
const themingIcon = (
  <RegistryIcon lucide='SlidersHorizontalIcon' className='size-4' />
);
const cliIcon = <RegistryIcon lucide='TerminalIcon' className='size-4' />;
const upgradeIcon = <RegistryIcon lucide='RefreshCwIcon' className='size-4' />;
const cascaderIcon = (
  <RegistryIcon lucide='ChevronsRightIcon' className='size-4' />
);
const dataGridIcon = <RegistryIcon lucide='TableIcon' className='size-4' />;
const kanbanIcon = <RegistryIcon lucide='KanbanIcon' className='size-4' />;
const ganttIcon = <RegistryIcon lucide='ChartBarIcon' className='size-4' />;
const calendarIcon = (
  <RegistryIcon lucide='CalendarDaysIcon' className='size-4' />
);
const frameIcon = <RegistryIcon lucide='AppWindowIcon' className='size-4' />;
const badgeIcon = <RegistryIcon lucide='BadgeCheckIcon' className='size-4' />;
const stepperIcon = <RegistryIcon lucide='RouteIcon' className='size-4' />;
const formsIcon = (
  <RegistryIcon lucide='ClipboardListIcon' className='size-4' />
);
const accessibilityIcon = (
  <RegistryIcon lucide='CircleUserRoundIcon' className='size-4' />
);
const darkModeIcon = <RegistryIcon lucide='MoonIcon' className='size-4' />;
const novaIcon = <RegistryIcon lucide='SparklesIcon' className='size-4' />;
const lyraIcon = <RegistryIcon lucide='MusicIcon' className='size-4' />;
const maiaIcon = <RegistryIcon lucide='StarIcon' className='size-4' />;
const seraIcon = <RegistryIcon lucide='SunIcon' className='size-4' />;
const nextIcon = <RegistryIcon lucide='GlobeIcon' className='size-4' />;
const viteIcon = <RegistryIcon lucide='ZapIcon' className='size-4' />;
const remixIcon = <RegistryIcon lucide='GitMergeIcon' className='size-4' />;
const setupIcon = <RegistryIcon lucide='SettingsIcon' className='size-4' />;
const toolsIcon = <RegistryIcon lucide='WrenchIcon' className='size-4' />;
const docs = [
  {
    value: 'getting-started',
    label: 'Getting started',
    icon: gettingStartedIcon,
    children: [
      { value: 'gs.install', label: 'Installation', icon: installIcon },
      { value: 'gs.theming', label: 'Theming', icon: themingIcon },
      { value: 'gs.cli', label: 'CLI', icon: cliIcon },
      { value: 'gs.upgrade', label: 'Upgrading', icon: upgradeIcon }
    ]
  },
  {
    value: 'components',
    label: 'Components',
    icon: componentsIcon,
    children: [
      { value: 'c.cascader', label: 'Cascader', icon: cascaderIcon },
      { value: 'c.data-grid', label: 'Data Grid', icon: dataGridIcon },
      { value: 'c.kanban', label: 'Kanban', icon: kanbanIcon },
      { value: 'c.gantt', label: 'Gantt', icon: ganttIcon },
      { value: 'c.calendar', label: 'Event Calendar', icon: calendarIcon }
    ]
  },
  {
    value: 'primitives',
    label: 'Primitives',
    icon: primitivesIcon,
    children: [
      { value: 'p.frame', label: 'Frame', icon: frameIcon },
      { value: 'p.badge', label: 'Badge', icon: badgeIcon },
      { value: 'p.stepper', label: 'Stepper', icon: stepperIcon }
    ]
  },
  {
    value: 'guides',
    label: 'Guides',
    icon: guidesIcon,
    children: [
      { value: 'g.forms', label: 'Forms', icon: formsIcon },
      { value: 'g.a11y', label: 'Accessibility', icon: accessibilityIcon },
      { value: 'g.dark-mode', label: 'Dark mode', icon: darkModeIcon }
    ]
  },
  {
    value: 'styles',
    label: 'Styles',
    icon: stylesIcon,
    children: [
      { value: 's.nova', label: 'Nova', icon: novaIcon },
      { value: 's.lyra', label: 'Lyra', icon: lyraIcon },
      { value: 's.maia', label: 'Maia', icon: maiaIcon },
      { value: 's.sera', label: 'Sera', icon: seraIcon }
    ]
  },
  {
    value: 'integrations',
    label: 'Integrations',
    icon: integrationsIcon,
    children: [
      { value: 'i.next', label: 'Next.js', icon: nextIcon },
      { value: 'i.vite', label: 'Vite', icon: viteIcon },
      { value: 'i.remix', label: 'Remix', icon: remixIcon }
    ]
  },
  {
    value: 'mcp',
    label: 'MCP',
    icon: mcpIcon,
    children: [
      { value: 'm.setup', label: 'Setup', icon: setupIcon },
      { value: 'm.tools', label: 'Tools', icon: toolsIcon }
    ]
  },
  { value: 'changelog', label: 'Changelog', icon: changelogIcon }
];
export function Pattern() {
  const [value, setValue] = useState('');
  return (
    <div className='flex w-full items-start justify-center self-start px-4 pt-6 pb-4'>
      <div className='flex w-full max-w-md flex-col gap-3'>
        <Cascader inline items={docs} value={value} onValueChange={setValue}>
          <Card className='py-0'>
            <CascaderPanel>
              <CascaderNav>
                <CascaderInput placeholder='Search documentation...' />
              </CascaderNav>
              <CascaderBreadcrumb />
              <CascaderEmpty />
              {/* Kept, and the ONE shape where it is not a shortcut: `inline` has no
       positioner, so there is no `--available-height` to bound the
       panel and the cap is the only thing that does. Every popover
       example below drops it and lets the viewport decide. */}
              <CascaderList maxHeight={240}>
                <CascaderItems />
              </CascaderList>
              <CascaderStatus />
            </CascaderPanel>
          </Card>
        </Cascader>
      </div>
    </div>
  );
}
