import { cn } from '../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { getLinkHost } from '../../core/LinkPreview/linkPreviewData.js';

/*
 * A source is `{ title, url?, kind?: 'web' | 'document', site?, excerpt?, quote?, icon? }`. Citations, the
 * sources list and the search results in a reasoning step all read it the same way.
 */

const siteOf = (source) => source.site || getLinkHost(source.url);

/** The source's favicon when it has one, otherwise a globe or a document. */
function ChatSourceIcon({ source, className }) {
  if (source.icon) return <img src={source.icon} alt='' className={cn('size-4 shrink-0 rounded-sm', className)} />;
  return <RegistryIcon lucide={source.kind === 'document' ? 'FileText' : 'Globe'} className={cn('text-text-muted size-4 shrink-0', className)} />;
}

export { ChatSourceIcon, siteOf };
