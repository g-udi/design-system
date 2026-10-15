// Safe defaults for isolated components. Kept out of the client module so server code reads the object, not a client reference.
export const defaultSiteConfig = {
  'metadata': {
    'author': { 'name': '' },
    'description': '',
    'email': '',
    'locale': 'en-US',
    'theme': 'system',
    'title': ''
  },
  'navigation': {
    'categoriesMetadata': {},
    'links': []
  },
  // App-owned link preview settings. Gaudi loads nothing by default: without an
  // `endpoint` LinkPreview fetches nothing, and without `resolveImage` it derives no images.
  'preview': {
    'endpoint': null,
    'resolveImage': null
  }
};
