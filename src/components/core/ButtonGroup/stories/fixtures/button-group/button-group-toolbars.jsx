'use client';
import { useRef, useState } from 'react';
import { FieldInput } from '@gaudi/design-system/core/Field';
import { useFileUpload } from '@gaudi/design-system/core/FileUpload';
import { toCsv } from '@gaudi/design-system/core/DataTable';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { Badge } from '@gaudi/design-system/core/Pill';
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
  const [collection, setCollection] = useState(null);
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
      setCollection(null);
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
        <ButtonGroup aria-label='Library'>
          <Button variant='outline' size='sm' aria-pressed={!trash} onClick={() => { setTrash(false); setCollection(null); }}><RegistryIcon aria-hidden='true' lucide='FileIcon' />Files</Button>
          <Button variant='outline' size='sm' disabled><RegistryIcon aria-hidden='true' lucide='FolderIcon' />Folder</Button>
          <Button variant='outline' size='sm' aria-pressed={trash} onClick={() => { setTrash(true); setCollection(null); }}><RegistryIcon aria-hidden='true' lucide='TrashIcon' />Trash</Button>
        </ButtonGroup>
      </Row>
      <Row label='Icon only'>
        <ButtonGroup aria-label='Text alignment'>
          {[['left', 'AlignLeftIcon'], ['center', 'AlignCenterIcon'], ['right', 'AlignRightIcon']].map(([name, icon]) => (
            <Button key={name} variant='outline' size='icon-sm' aria-label={'Align ' + name} aria-pressed={align === name} onClick={() => setAlign(name)}><RegistryIcon aria-hidden='true' lucide={icon} /></Button>
          ))}
        </ButtonGroup>
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
        <ButtonGroup aria-label='Media library' className='**:data-[slot=button]:border-0'>
          {['Docs', 'Projects', 'Media'].map((name) => (
            <Button key={name} size='sm' aria-pressed={collection === name} onClick={() => setCollection(collection === name ? null : name)}>{name}</Button>
          ))}
        </ButtonGroup>
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
