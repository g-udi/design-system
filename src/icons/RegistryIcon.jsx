import { getIcon } from './index';

/** Reconciles imported examples with Gaudi's single icon registry. */
export function RegistryIcon({ lucide, ...props }) {
  const Glyph = getIcon(lucide?.replace(/Icon$/, '')) || getIcon(lucide);
  if (!Glyph) return null;
  return (
    <Glyph aria-hidden={props['aria-label'] ? undefined : true} {...props} />
  );
}
