/**
 * Per-page switches for LayoutContainer's site chrome
 *
 * @description Render it anywhere in a page to turn off, while that page is shown, the layout
 * background (the `background` slot or the default Borealis) and/or the page-level ScrollEdges.
 * It renders a hidden marker that PageChrome.css matches with `:has()`, so it works in server
 * components and the chrome is already hidden in the server HTML: no flash, no client JavaScript.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.background=true] - Show LayoutContainer's background on this page
 * @param {boolean} [props.scrollEdges=true] - Show the page ScrollEdges (those without a targetRef)
 *
 * @returns {JSX.Element|null} A hidden marker, or nothing when every part stays on
 *
 * @example
 * // app/about/page.js: the page draws its own header background.
 * <PageChrome background={ false } />
 */
const PageChrome = ({ background = true, scrollEdges = true }) => {
  if (background && scrollEdges) return null;

  return (
    <span
      hidden
      aria-hidden='true'
      data-slot='page-chrome'
      data-background={ background ? undefined : 'off' }
      data-scroll-edges={ scrollEdges ? undefined : 'off' }
    />
  );
};

export default PageChrome;
