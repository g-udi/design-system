export function selectFiles(
  current,
  incoming,
  {
    accept = '',
    maxSize = Infinity,
    maxFiles = Infinity,
    multiple = false
  } = {}
) {
  const limit = (n) =>
    n === Infinity ? n : Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  const types = accept
    .split(',')
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean);
  const files = multiple ? [...current] : [];
  const rejected = [];
  for (const file of incoming) {
    if (files.includes(file)) continue;
    const matches =
      !types.length ||
      types.some((type) =>
        type.startsWith('.')
          ? file.name.toLowerCase().endsWith(type)
          : type.endsWith('/*')
            ? file.type.toLowerCase().startsWith(type.slice(0, -1))
            : file.type.toLowerCase() === type
      );
    const reason = !matches
      ? 'type'
      : file.size > limit(maxSize)
        ? 'size'
        : files.length >= Math.min(limit(maxFiles), multiple ? Infinity : 1)
          ? 'count'
          : null;
    if (reason) rejected.push({ file, reason });
    else files.push(file);
  }
  return { files: !multiple && !files.length ? current : files, rejected };
}
