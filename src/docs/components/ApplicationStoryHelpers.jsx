// Every component uses the same documentation contract as Accordion.
import { cn } from '../../utilities/cn';

export { CatalogueDocsPage as ApplicationDocsPage } from './ComponentDocs';

export const applicationDocs = (description, code, accessibility, docsOptions = {}) => ({
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      ...docsOptions,
      gaudi: { description, accessibility, usage: code },
      description: {
        component: `${description}\n\n**Accessibility:** ${accessibility}\n\nExamples use illustrative data and local state. Application callbacks own persistence and network requests.`
      },
      source: { language: 'jsx' }
    }
  }
});
export const source = (code) => ({
  docs: { source: { code, language: 'jsx' } }
});
export function ExampleFrame({ children, wide = false, className }) {
  return (
    <div
      className={cn('ds-example-frame mx-auto w-full min-w-0 p-2 sm:p-4', !wide && 'max-w-2xl', className)}
    >
      {children}
    </div>
  );
}
