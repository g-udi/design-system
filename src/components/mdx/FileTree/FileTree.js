/**
 * File Tree Component
 *
 * @description A static file and folder listing for technical articles. Each file type gets its own
 * icon and a semantic tint; folders open by default and `isOpen: false` collapses one.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import Icon from '../../core/Icon';
import { cn } from '../../../utilities/cn';

const INDENT = 20;

// Special file names first, then extensions. Tints use status tokens so they follow the theme.
const fileIcons = {
  'names': {
    '.dockerignore': [ 'docker', 'text-info' ],
    '.gitattributes': [ 'git', 'text-danger' ],
    '.gitignore': [ 'git', 'text-danger' ],
    'changelog.md': [ 'markdown', 'text-info' ],
    'dockerfile': [ 'docker', 'text-info' ],
    'package-lock.json': [ 'node', 'text-success' ],
    'package.json': [ 'node', 'text-success' ],
    'readme.md': [ 'markdown', 'text-info' ]
  },
  'extensions': {
    'cjs': [ 'javascript', 'text-warning' ],
    'css': [ 'css', 'text-info' ],
    'html': [ 'html', 'text-danger' ],
    'js': [ 'javascript', 'text-warning' ],
    'json': [ 'json', 'text-warning' ],
    'jsx': [ 'react', 'text-info' ],
    'md': [ 'markdown', 'text-text-muted' ],
    'mdx': [ 'markdown', 'text-text-muted' ],
    'mjs': [ 'javascript', 'text-warning' ],
    'py': [ 'python', 'text-warning' ],
    'ts': [ 'typescript', 'text-info' ],
    'tsx': [ 'typescript', 'text-info' ]
  }
};

const getFileIcon = (name, isFolder, isOpen) => {
  if (isFolder) return [ isOpen ? 'folder-open' : 'folder', 'text-accent' ];

  const filename = name.toLowerCase();

  return fileIcons.names[filename] || fileIcons.extensions[filename.split('.').pop()] || [ 'file', 'text-text-subtle' ];
};

const FileTreeItem = ({ name, isFolder = false, level, childrenProp = [], isOpen = true }) => {
  const [ icon, tint ] = getFileIcon(name, isFolder, isOpen);

  return (
    <li className='m-0 p-0'>
      <div className='flex items-center gap-2 rounded py-1 pe-2 transition-colors hover:bg-surface-muted' style={{ 'paddingLeft': `${(level * INDENT) + 8}px` }}>
        <Icon name={ icon } decorative className={ cn('size-4 shrink-0', tint) } />
        <span className={ isFolder ? 'font-medium text-text' : 'text-text-muted' }>{name}</span>
      </div>
      {isFolder && isOpen && childrenProp.length > 0 ? <FileTreeList items={ childrenProp } level={ level + 1 } /> : null}
    </li>
  );
};

const FileTreeList = ({ items, level }) => (
  <ul className='m-0 list-none p-0'>
    {items.map((item, index) => (
      <FileTreeItem key={ `${item.name}-${index}` } { ...item } isOpen={ item.isOpen !== false } level={ level } />
    ))}
  </ul>
);

/**
 * @param {Object} props
 * @param {Array<{ name: string, isFolder?: boolean, isOpen?: boolean, childrenProp?: Array }>} props.data - Tree records
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 *
 * @example
 * <FileTree data={[{ name: 'content', isFolder: true, childrenProp: [{ name: 'post.mdx' }] }, { name: 'package.json' }]} />
 */
const FileTree = ({ data = [], className }) => (
  <div className={ cn('not-prose max-h-96 overflow-y-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm', className) }>
    <FileTreeList items={ data } level={ 0 } />
  </div>
);

export default FileTree;
