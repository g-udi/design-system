import { useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '../../../components/blocks/AppShell';
import Banner from '../../../components/core/Banner';
import Button from '../../../components/core/Button';
import Card from '../../../components/core/Card';
import Checkbox from '../../../components/core/Checkbox';
import DataTable from '../../../components/core/DataTable';
import { Field, FieldDescription, FieldLabel } from '../../../components/core/Field';
import Pill from '../../../components/core/Pill';
import Progress from '../../../components/core/Progress';
import Switch from '../../../components/core/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/core/Tabs';
import { BarChart } from '../../../components/charts/BarChart';
import { applyTheme } from '../../../themes/runtime.js';
import { EmailInput } from '../../../components/core/Input/index.js';

const rows = [
  { id: 'r1', page: 'Field notes', status: 'Published', readers: 1284 },
  { id: 'r2', page: 'Design tokens', status: 'Review', readers: 642 },
  { id: 'r3', page: 'Theme studio', status: 'Draft', readers: 97 }
];
const columns = [
  { key: 'page', header: 'Page' },
  { key: 'status', header: 'Status', render: (row) => <Pill size='sm' tone={ row.status === 'Published' ? 'green' : row.status === 'Review' ? 'amber' : 'neutral' }>{row.status}</Pill> },
  { key: 'readers', header: 'Readers', align: 'right' }
];
const traffic = [
  { month: 'Jan', search: 420, social: 240, newsletter: 180, direct: 120 },
  { month: 'Feb', search: 480, social: 220, newsletter: 210, direct: 150 },
  { month: 'Mar', search: 530, social: 300, newsletter: 260, direct: 170 },
  { month: 'Apr', search: 610, social: 280, newsletter: 300, direct: 190 }
];
const series = [ { key: 'search', label: 'Search' }, { key: 'social', label: 'Social' }, { key: 'newsletter', label: 'Newsletter' }, { key: 'direct', label: 'Direct' } ];

/** Injects a theme's CSS for previews (recomputed tokens included) and removes it on change. */
export function usePreviewTheme(theme) {
  useEffect(() => applyTheme(theme, { derived: true }).remove, [ theme ]);
}

/** Real Gaudi components rendered inside a themed scope. */
export function ThemePreview({ theme, mode }) {
  usePreviewTheme(theme);
  return (
    <div data-theme={ theme.id } className={ `${mode} rounded-lg border border-border bg-surface p-4 text-text` } style={ { colorScheme: mode } } aria-label={ `${theme.name} preview (${mode})` } role='region'>
      <div className='grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)]'>
        <SidebarProvider className='min-h-0 w-auto'>
          <Sidebar collapsible='none' className='w-full rounded border border-ui-sidebar-border'>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[ 'Overview', 'Articles', 'Analytics', 'Settings' ].map((item, index) => (
                      <SidebarMenuItem key={ item }>
                        <SidebarMenuButton isActive={ index === 1 }>{item}</SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
        <div className='flex min-w-0 flex-col gap-4'>
          <div>
            <h3 className='text-2xl font-semibold text-text'>Quarterly review</h3>
            <p className='text-text-muted'>Body copy in the theme&apos;s sans stack, with <a className='text-accent underline' href='#preview'>an inline link</a> and <code className='font-mono text-sm'>monospace</code>.</p>
            <p className='text-sm text-text-subtle'>Subtle caption text.</p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button variant='solid' tone='accent'>Publish</Button>
            <Button variant='outline'>Preview</Button>
            <Button variant='soft' tone='accent'>Share</Button>
            <Button variant='solid' tone='danger'>Delete</Button>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card title='Profile' subtitle='Cards use the raised surface.'>
              <div className='flex flex-col gap-3'>
                <Field>
                  <FieldLabel htmlFor={ `${theme.id}-${mode}-email` }>Email</FieldLabel>
                  <EmailInput id={ `${theme.id}-${mode}-email` }  placeholder='ada@example.com' />
                  <FieldDescription>Used for publishing updates.</FieldDescription>
                </Field>
                <Switch id={ `${theme.id}-${mode}-digest` } label='Weekly digest' defaultChecked />
                <Checkbox id={ `${theme.id}-${mode}-drafts` } label='Include drafts' />
              </div>
            </Card>
            <Card title='Status' subtitle='Status tones and progress.'>
              <div className='flex flex-col gap-2'>
                <Banner tone='success' size='sm' title='Saved'>All changes are published.</Banner>
                <Banner tone='warning' size='sm' title='Review'>Two drafts need a check.</Banner>
                <Banner tone='danger' size='sm' title='Failed'>One export did not finish.</Banner>
                <div className='flex flex-wrap gap-1.5'>
                  {[ [ 'accent', 'blue' ], [ 'success', 'green' ], [ 'warning', 'amber' ], [ 'danger', 'red' ], [ 'discovery', 'teal' ], [ 'attention', 'rose' ] ].map(([ label, tone ]) => <Pill key={ label } size='sm' tone={ tone }>{label}</Pill>)}
                </div>
                <Progress value={ 64 } label='Storage used' />
              </div>
            </Card>
          </div>
          <Tabs defaultValue='table'>
            <TabsList aria-label='Preview data'>
              <TabsTrigger value='table'>Table</TabsTrigger>
              <TabsTrigger value='chart'>Chart</TabsTrigger>
            </TabsList>
            <TabsContent value='table'>
              <DataTable columns={ columns } rows={ rows } getRowId={ (row) => row.id } />
            </TabsContent>
            <TabsContent value='chart'>
              <BarChart title='Readers by channel' ariaLabel='Monthly readers by channel' data={ traffic } xKey='month' series={ series } showLegend height={ 220 } />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
