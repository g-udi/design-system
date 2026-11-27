'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ButtonGroup, ButtonGroupSeparator } from '@gaudi/design-system/core/ButtonGroup';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import Card from '@gaudi/design-system/core/Card';
import Input from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import { downloadCsv, toCsv } from '@gaudi/design-system/core/DataTable';
import { cn } from '@gaudi/design-system/utilities/cn';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const views = [
  ['Grid view', 'LayoutGridIcon', 'grid'],
  ['List view', 'ListIcon', 'list']
];
const collection = [
  { id: 'gaudi-project', name: 'Reader dashboard', type: 'Project', created: 1, updated: 5 },
  { id: 'gaudi-domain', name: 'read.gaudi.dev', type: 'Domain', created: 2, updated: 2 },
  { id: 'gaudi-team', name: 'Editorial team', type: 'Team', created: 3, updated: 4 }
];
const fields = [
  { header: 'Name', value: (row) => row.name },
  { header: 'Type', value: (row) => row.type }
];
function excelXml(rows) {
  const text = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const cells = [['Name', 'Type'], ...rows.map((row) => [row.name, row.type])]
    .map(
      (row) =>
        `<Row>${row.map((value) => `<Cell><Data ss:Type="String">${text(value)}</Data></Cell>`).join('')}</Row>`
    )
    .join('');
  return `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Collection"><Table>${cells}</Table></Worksheet></Workbook>`;
}
export function Pattern() {
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('Newest');
  const [records, setRecords] = useState(collection);
  const [filter, setFilter] = useState('All');
  const [creating, setCreating] = useState(null);
  const [name, setName] = useState('');
  const visible = records
    .filter((row) => filter === 'All' || row.type === filter)
    .sort((a, b) =>
      sort === 'Oldest'
        ? a.created - b.created
        : sort === 'Recently updated'
          ? b.updated - a.updated
          : b.created - a.created
    );
  const json = JSON.stringify(
    visible.map(({ name, type }) => ({ name, type })),
    null,
    2
  );
  const create = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    const next = Math.max(...records.map((row) => Math.max(row.created, row.updated))) + 1;
    setRecords((rows) => [
      ...rows,
      { id: crypto.randomUUID(), name: name.trim(), type: creating, created: next, updated: next }
    ]);
    setFilter(creating);
    setName('');
    setCreating(null);
  };
  return (
    <section className='mx-auto grid w-full max-w-2xl gap-4' aria-label='Collection'>
      <div className='flex flex-wrap items-center gap-2 print:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' aria-label={`Sort: ${sort}`}>
              <RegistryIcon aria-hidden='true' lucide='ArrowUpDownIcon' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='min-w-40'>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              {['Newest', 'Oldest', 'Recently updated'].map((item) => (
                <DropdownMenuRadioItem key={item} value={item}>{item}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ButtonGroup aria-label='Filter and export'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                <RegistryIcon aria-hidden='true' lucide='ListFilterIcon' />
                {filter === 'All' ? 'Filter' : `Filter: ${filter}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuLabel>Item type</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                {['All', 'Project', 'Domain', 'Team'].map((type) => (
                  <DropdownMenuRadioItem key={type} value={type}>{type}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <ButtonGroupSeparator />
          <Button variant='outline' onClick={() => downloadCsv(toCsv(visible, fields), 'collection.csv')}>
            <RegistryIcon aria-hidden='true' lucide='DownloadIcon' />
            Export CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon' aria-label='More export options'>
                <RegistryIcon aria-hidden='true' lucide='ChevronDownIcon' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem asChild>
                <a
                  download='collection.xml'
                  href={`data:application/xml;charset=utf-8,${encodeURIComponent(excelXml(visible))}`}
                >
                  <RegistryIcon aria-hidden='true' lucide='FileSpreadsheetIcon' />
                  Export Excel XML
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  download='collection.json'
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(json)}`}
                >
                  <RegistryIcon aria-hidden='true' lucide='FileJsonIcon' />
                  Export JSON
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => window.print()}>
                <RegistryIcon aria-hidden='true' lucide='FileTextIcon' />
                Print / save PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <ToggleGroup
          label='View'
          value={view}
          onValueChange={(next) => next && setView(next)}
          options={views.map(([label, icon, value]) => ({
            value, ariaLabel: label, label: <RegistryIcon aria-hidden='true' lucide={icon} />
          }))}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              Add new
              <RegistryIcon aria-hidden='true' lucide='ChevronDownIcon' className='opacity-60' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='min-w-40'>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => {
                  setCreating('Project');
                  setName('');
                }}
              >
                <RegistryIcon aria-hidden='true' lucide='PlusIcon' />
                Project
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setCreating('Domain');
                  setName('');
                }}
              >
                <RegistryIcon aria-hidden='true' lucide='PlusIcon' />
                Domain
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setCreating('Team');
                setName('');
              }}
            >
              <RegistryIcon aria-hidden='true' lucide='PlusIcon' />
              Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {creating ? (
        <form onSubmit={create} className='grid justify-items-start gap-2 print:hidden'>
          <Label>
            {creating} name
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Label>
          <div className='flex gap-2'>
            <Button type='submit' size='sm' disabled={!name.trim()}>
              Create {creating.toLowerCase()}
            </Button>
            <Button type='button' size='sm' variant='ghost' onClick={() => setCreating(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
      <ul
        className={cn('m-0 grid list-none gap-2 p-0', view === 'grid' && 'sm:grid-cols-3')}
        aria-label='Collection items'
      >
        {visible.map((row) => (
          <li key={row.id}>
            <Card variant='outline' padding='sm' title={row.name} subtitle={row.type} />
          </li>
        ))}
      </ul>
    </section>
  );
}
