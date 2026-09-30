const parseAccept = (accept = '') =>
  accept
    .split(',')
    .map((type) => type.trim().toLowerCase())
    .filter((type) => type && type !== '*');

/** True when `file` matches native `accept` syntax: extensions, `type/*` wildcards or exact MIME types. */
export function acceptsFile(file, accept) {
  const types = Array.isArray(accept) ? accept : parseAccept(accept);
  const name = file.name.toLowerCase();
  const mime = (file.type || '').toLowerCase();

  return (
    !types.length ||
    types.some((type) => {
      if (type.startsWith('.')) return name.endsWith(type);
      if (type.endsWith('/*')) return mime.startsWith(type.slice(0, -1));
      return mime === type;
    })
  );
}

/** Merges `incoming` into `current`, rejecting files by type, size or count. Never clears a valid single choice. */
export function selectFiles(
  current,
  incoming,
  { accept = '', maxSize = Infinity, maxFiles = Infinity, multiple = false } = {}
) {
  const limit = (n) => (n === Infinity ? n : Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0);
  const types = parseAccept(accept);
  const files = multiple ? [...current] : [];
  const rejected = [];
  for (const file of incoming) {
    if (files.includes(file)) continue;
    let reason = null;
    if (!acceptsFile(file, types)) reason = 'type';
    else if (file.size > limit(maxSize)) reason = 'size';
    else if (files.length >= Math.min(limit(maxFiles), multiple ? Infinity : 1)) reason = 'count';
    if (reason) rejected.push({ file, reason });
    else files.push(file);
  }
  return { files: !multiple && !files.length ? current : files, rejected };
}
