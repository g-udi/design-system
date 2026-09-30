/** Unicode-aware initials; applications can provide a custom fallback. */
export function getAvatarInitials(name) {
  const words = String(name || '').trim().split(/\s+/)
    .map((word) => word.match(/[\p{L}\p{N}]/gu) || [])
    .filter((characters) => characters.length);
  if (!words.length) return '?';
  return (words.length === 1 ? words[0].slice(0, 2) : [words[0][0], words.at(-1)[0]])
    .join('').toUpperCase();
}

export function getAvatarGroupState(avatars, max = 4) {
  const limit = Number.isFinite(max) && max > 0 ? Math.max(1, Math.floor(max)) : 0;
  const visible = limit > 0 ? avatars.slice(0, limit) : avatars;
  return { visible, overflow: avatars.length - visible.length };
}
