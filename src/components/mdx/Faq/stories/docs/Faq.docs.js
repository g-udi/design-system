export default {
  "MDX/FAQ": {
    'accessibility': 'Faq uses a semantic definition list and native disclosure buttons. Choose a headingLevel that follows the surrounding article heading without skipping a level.',
    'props': [['questions', 'Array<{ question, answer }>', '-', 'Question and answer disclosures.'], ['heading', 'ReactNode', 'FAQ', 'Visible section heading.'], ['headingLevel', '2 | 3 | 4 | 5 | 6', '2', 'Semantic level for the section heading.']],
    usage: "<Faq questions={[\n  {\n    question: 'Why use FAQ blocks?',\n    answer: 'They structure repeated article answers.'\n  }\n]} />",
    description: "Article questions and answers with semantic disclosure controls and configurable heading hierarchy."
  }
};
