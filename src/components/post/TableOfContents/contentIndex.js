const normalizeVisualLabel = (value, fallback) => {
  const normalized = value?.replace(/\s+/g, ' ').trim();

  if (!normalized) return fallback;
  return normalized;
};

const slugifyVisualLabel = (value) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 48);

const getFigureLabel = (figure, index) => normalizeVisualLabel(
  figure.dataset.tocLabel || figure.querySelector('figcaption strong')?.textContent || figure.querySelector('figcaption')?.textContent,
  `Diagram ${index + 1}`
);

const getTableLabel = (table, index) => {
  const caption = table.querySelector('caption')?.textContent;
  const headers = [ ...table.querySelectorAll('thead th') ]
    .map((header) => header.textContent?.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(' · ');

  return normalizeVisualLabel(caption || headers, `Table ${index + 1}`);
};

export const collectVisuals = (content) => {
  const article = content || document.querySelector('main article') || document.querySelector('article');

  if (!article) return [];

  const figures = [ ...article.querySelectorAll('figure') ]
    .filter((figure) => !figure.hasAttribute('data-rehype-pretty-code-figure') && figure.querySelector('figcaption') && !figure.querySelector('img, video'))
    .map((element, index) => ({
      element,
      'kind': 'diagram',
      'label': getFigureLabel(element, index)
    }));
  const tables = [ ...article.querySelectorAll('table') ].map((element, index) => ({
    element,
    'kind': 'table',
    'label': getTableLabel(element, index)
  }));
  const candidates = [ ...figures, ...tables ].sort((first, second) => (
    first.element.compareDocumentPosition(second.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  ));
  const claimedIds = new Set([ ...document.querySelectorAll('[id]') ].map((element) => element.id).filter(Boolean));

  return candidates.map((visual, index) => {
    let id = visual.element.id;

    if (!id) {
      const labelSlug = slugifyVisualLabel(visual.label) || `${visual.kind}-${index + 1}`;
      const baseId = `visual-${visual.kind}-${labelSlug}`;
      let suffix = 1;

      id = baseId;
      while (claimedIds.has(id)) {
        suffix += 1;
        id = `${baseId}-${suffix}`;
      }

      visual.element.id = id;
      claimedIds.add(id);
    }

    return {
      id,
      'kind': visual.kind,
      'label': visual.label,
      'url': `#${id}`
    };
  });
};

