/** True when `target` lies outside every ref'd node. Detached targets (removed mid-click) count as inside. */
export function isOutside(refs, target) {
  if (!target || (typeof target.isConnected === 'boolean' && !target.isConnected)) return false;
  return refs.every((ref) => !ref?.current || !ref.current.contains(target));
}
