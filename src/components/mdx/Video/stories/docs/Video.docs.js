export default {
  "MDX/Video": {
    'accessibility': 'Video uses a native button for the thumbnail trigger, an aria-modal dialog, Escape-to-close behavior, labelled close controls, and returns focus to the trigger when closed.',
    'description': 'Video renders a video thumbnail that opens an embedded video in an accessible modal dialog.',
    'overview': 'Use Video inside MDX when an article needs a focused video walkthrough without embedding an always-loaded iframe in the page flow.',
    'props': [['videoSrc', 'YouTube embed URL or embeddable URL', '-', 'Source URL converted to an embeddable iframe URL when possible.'], ['thumbnailSrc', 'string', '-', 'Optional thumbnail image source.'], ['thumbnailAlt', 'string', 'Video thumbnail', 'Accessible alt text for the thumbnail image or fallback thumbnail label.'], ['animationStyle', 'from-center | from-bottom | from-top | from-left | from-right | fade | top-in-bottom-out | left-in-right-out', 'from-center', 'Dialog entrance animation.'], ['title', 'string', 'Video', 'Dialog heading and iframe title.'], ['ariaLabel', 'string', 'playLabel', 'Accessible label for the thumbnail trigger.'], ['autoplay', 'boolean', 'true', 'Adds autoplay to the iframe URL when the dialog opens.'], ['playLabel', 'string', 'Play video', 'Fallback accessible label for the thumbnail trigger.'], ['className', 'string', '-', 'Thumbnail trigger class override.'], ['classNames', '{ trigger, thumbnail, playWrapper, playButton, dialog, overlay, panel, title, close, video }', '-', 'Slot-level class overrides.']],
    usage: "<Video\n  animationStyle='from-center'\n  videoSrc='https://www.youtube.com/embed/qh3NGpYRG3I'\n  thumbnailSrc='/static/images/og-card.jpg'\n  thumbnailAlt='Video preview'\n  title='Video walkthrough'\n/>"
  }
};
