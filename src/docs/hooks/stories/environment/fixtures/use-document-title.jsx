import { useState } from 'react';
import Button from '../../../../../components/core/Button';
import Input from '../../../../../components/core/Input';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useDocumentTitle } from '../../../../../hooks/environment/use-document-title.js';

export function TitlePreview() {
  const [title, setTitle] = useState('Writing room');
  const [enabled, setEnabled] = useState(false);
  useDocumentTitle(`${title} · Preview`, { enabled });
  return <div className='grid gap-3'>
    <label className='grid gap-2 text-sm'>Page title<Input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
    <Readout label='Preview document'><Value>{enabled ? `${title} · Preview` : 'Original title'}</Value></Readout>
    <div><Button aria-pressed={enabled} onClick={() => setEnabled((value) => !value)}>{enabled ? 'Restore title' : 'Apply title'}</Button></div>
    <p className='text-sm text-text-muted'>In Storybook this changes the preview frame title. A host page changes its browser tab title.</p>
  </div>;
}
