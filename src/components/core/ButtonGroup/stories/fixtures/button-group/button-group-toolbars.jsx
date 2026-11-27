'use client';
import { useRef, useState } from 'react';
import { FieldInput } from '@gaudi/design-system/core/Field';
import { useFileUpload } from '@gaudi/design-system/core/FileUpload';
import { toCsv } from '@gaudi/design-system/core/DataTable';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { Badge } from '@gaudi/design-system/core/Pill';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  ButtonGroup,
  ButtonGroupSeparator, ButtonGroupText
} from '@gaudi/design-system/core/ButtonGroup';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const initialFiles = [
  { name: 'Release notes', kind: 'Docs', trashed: false },
  { name: 'Reader dashboard', kind: 'Projects', trashed: false },
  { name: 'Cover artwork', kind: 'Media', trashed: false },
  { name: 'Old sketch', kind: 'Media', trashed: true }
];
const fields = [{ header: 'Name', value: (file) => file.name }, { header: 'Collection', value: (file) => file.kind }];
function exportPng(title, files, element) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 112 + Math.max(files.length, 1) * 36;
  const context = canvas.getContext('2d');
  if (!context) return;
  const styles = getComputedStyle(element);
  context.fillStyle = styles.backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = styles.color;
  context.font = 'bold 30px sans-serif';
  context.fillText(title, 32, 52, 735);
  context.font = '22px sans-serif';
  (files.length ? files.map((file) => file.name + ' · ' + file.kind) : ['No files']).forEach((line, index) => context.fillText(line, 32, 101 + index * 36, 735));
  const link = document.createElement('a');
  link.download = 'library.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
function Row({ label, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-xs text-text-muted'>{label}</span>
      <div className='flex flex-wrap items-center gap-2'>{children}</div>
    </div>
  );
}
export function Pattern() {
  const [files, setFiles] = useState(initialFiles);
  const [trash, setTrash] = useState(false);
  const [collection, setCollection] = useState('');
  const [title, setTitle] = useState('Library dashboard');
  const [editing, setEditing] = useState(false);
  const [showKinds, setShowKinds] = useState(true);
  const [share, setShare] = useState(false);
  const [align, setAlign] = useState('left');
  const [, { getInputProps, openFileDialog }] = useFileUpload({
    multiple: true,
    onFilesAdded: (entries) => {
      setFiles((current) => [...current, ...entries.map(({ file }) => ({ name: file.name, kind: 'Docs', trashed: false }))]);
      setTrash(false);
      setCollection('');
    }
  });
  const report = useRef(null);
  const { copy, isCopied } = useCopyToClipboard();
  const visible = files.filter((file) => file.trashed === trash && (!collection || file.kind === collection));
  const csv = toCsv(visible, fields);
  const shareText = [title, ...visible.map((file) => file.name)].join('\n');
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <Row label='Labelled, one disabled'>
        <ToggleGroup
          label='Library'
          size='sm'
          value={trash ? 'Trash' : 'Files'}
          onValueChange={(value) => {
            if (value) setTrash(value === 'Trash');
            setCollection('');
          }}
          options={[
            { value: 'Files', label: <><RegistryIcon aria-hidden='true' lucide='FileIcon' />Files</> },
            { value: 'Folder', disabled: true, label: <><RegistryIcon aria-hidden='true' lucide='FolderIcon' />Folder</> },
            { value: 'Trash', label: <><RegistryIcon aria-hidden='true' lucide='TrashIcon' />Trash</> }
          ]}
        />
      </Row>
      <Row label='Icon only'>
        <ToggleGroup
          label='Text alignment'
          size='sm'
          value={align}
          onValueChange={(value) => value && setAlign(value)}
          options={[['left', 'AlignLeftIcon'], ['center', 'AlignCenterIcon'], ['right', 'AlignRightIcon']].map(([value, icon]) => ({
            value,
            ariaLabel: 'Align ' + value,
            label: <RegistryIcon aria-hidden='true' lucide={icon} />
          }))}
        />
      </Row>
      <Row label='Icons and a badge'>
        <ButtonGroup aria-label='Document'>
          <ButtonGroupText><RegistryIcon aria-hidden='true' lucide='FileTextIcon' /><Badge variant='warning-light'>Draft</Badge></ButtonGroupText>
          <Button variant='outline' aria-pressed={editing} onClick={() => setEditing(!editing)}><RegistryIcon aria-hidden='true' lucide='PencilIcon' />Edit</Button>
          <Button variant='outline' size='icon' aria-label='Import file names' onClick={openFileDialog}><RegistryIcon aria-hidden='true' lucide='UploadIcon' /></Button>
        </ButtonGroup>
        <input {...getInputProps({ 'aria-label': 'Choose library files' })} hidden />
      </Row>
      <Row label='Separators'>
        <ToggleGroup
          label='Media library'
          size='sm'
          value={collection}
          options={['Docs', 'Projects', 'Media'].map((value) => ({ value, label: value }))}
          onValueChange={setCollection}
        />
        <ButtonGroup aria-label='Dashboard actions'>
          <Button variant='outline' size='sm' aria-pressed={share} onClick={() => setShare(!share)}><RegistryIcon aria-hidden='true' lucide='Share2Icon' />Share</Button>
          <ButtonGroupSeparator />
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant='outline' size='icon-sm' aria-label='More options'><RegistryIcon aria-hidden='true' lucide='MoreHorizontalIcon' /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setEditing(true)}><RegistryIcon aria-hidden='true' lucide='PencilIcon' />Edit dashboard title</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowKinds(!showKinds)}>{showKinds ? 'Hide' : 'Show'} collection names</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild><a download='library.csv' href={'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)}><RegistryIcon aria-hidden='true' lucide='FileTextIcon' />Export CSV</a></DropdownMenuItem>
                <DropdownMenuItem onSelect={() => exportPng(title, visible, report.current)}><RegistryIcon aria-hidden='true' lucide='ImageIcon' />Export PNG</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </Row>
      {editing && <FieldInput aria-label='Dashboard title' value={title} onChange={(event) => setTitle(event.target.value)} />}
      <section ref={report} className='rounded-md bg-surface-muted p-3 text-sm text-text' aria-label='Library report' style={{ textAlign: align }}>
        <h3 className='font-medium'>{title}</h3>
        <ul className='list-none p-0'>{visible.map((file, index) => <li key={file.name + index}>{file.name}{showKinds && ' · ' + file.kind}</li>)}</ul>
        {!visible.length && <p>No files</p>}
      </section>
      {share && <div className='flex flex-wrap items-center gap-2'><FieldInput aria-label='Library summary' readOnly value={shareText} /><Button size='sm' onClick={() => copy(shareText)}>{isCopied ? 'Copied' : 'Copy summary'}</Button></div>}
    </div>
  );
}
