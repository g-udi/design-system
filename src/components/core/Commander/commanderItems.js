/** Collection names control grouping; hosts supply identities, destinations and display values. */
export function prepareCommandCollection(collection = [], type) {
  return (collection ?? []).map((item) => ({
    ...item,
    id: item.id ?? item.slug,
    children: item.children ?? item.title ?? item.display ?? item.name,
    title: item.title ?? item.display ?? item.name,
    type: item.type ?? type,
    subtitle: item.subtitle ?? (type === 'publication'
      ? item.year
      : type === 'project'
        ? item.description ?? item.summary
        : type === 'thought' ? item.summary ?? item.description : undefined)
  }));
}

export function commandItemProps({ closeOnSelect, disabled, href, onClick }) {
  return { closeOnSelect, disabled, href, onClick };
}
