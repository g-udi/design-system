import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button>
      <RegistryIcon lucide='CloudDownloadIcon' aria-hidden='true' />
      Download
    </Button>
  );
}
