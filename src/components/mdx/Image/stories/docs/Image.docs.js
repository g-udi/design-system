export default {
  "MDX/Image": {
    'accessibility': 'Image keeps article images semantic with alt text, figure captions, and a button trigger for the modal preview.',
    'description': 'Image renders editorial MDX images with caption, dark-mode source, fallback source, and click-to-open modal behavior.',
    'recovery': ['Provide a valid fallback source for editorial images that can fail independently of the article.', 'Keep useful alt text available when both image sources fail; never replace the article with an empty frame.'],
    'props': [['src', 'string', '-', 'Primary image source.'], ['fallback', 'string', '-', 'Fallback image source used after load failure.'], ['darkSrc', 'string', '-', 'Optional image source shown in dark mode.'], ['alt', 'string', 'post-image', 'Accessible alt text for informative images.'], ['caption', 'ReactNode', '-', 'Optional visible figure caption.'], ['width', 'number', '-', 'Image width for Next image rendering unless fill is supplied.'], ['height', 'number', '-', 'Image height for Next image rendering unless fill is supplied.'], ['fill', 'boolean', 'false', 'Uses the parent box instead of explicit dimensions.'], ['sizes', 'string', '-', 'Responsive image sizes hint passed to Next image.'], ['className', 'string', '-', 'Image class override.']],
    usage: "<Image\n  src='/static/images/art/0.svg'\n  fallback='/static/images/art/1.svg'\n  darkSrc='/static/images/art/5.svg'\n  alt='Lavender gradient artwork'\n  caption='A study in lavender and light.'\n  width={420}\n  height={236}\n/>"
  }
};
