// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const attachment = {
  name: 'Q4-Product-Roadmap.pdf',
  size: '2.4 MB'
};
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline' size='xs'>
        <RegistryIcon lucide='PaperclipIcon' aria-hidden='true' />
        {attachment.name}
        <span className=''>({attachment.size})</span>
      </Button>
      <Button variant='outline' size='icon-xs' aria-label='Download attachment'>
        <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
