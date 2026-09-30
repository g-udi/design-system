import {
  createComponentDocsPage,
  getComponentDocs
} from '../../../../.storybook/stories/ComponentDocs';
import { useState } from 'react';
import Button from '../Button';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import {
  PlusMinusExample,
  BorderedExample,
  CardExample,
  DisabledExample,
  IconsExample,
  FramedExample,
  NestedExample,
  MembersExample,
  ArrowExample,
  OnboardingExample,
  RetainedFormExample,
  PatternGallery,
  faqItems
} from '../../../../.storybook/fixtures/accordion/Examples';
import exampleSource from '../../../../.storybook/fixtures/accordion/Examples.jsx?raw';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import {
  Accordion,
  AccordionContent,
  AccordionGroup,
  AccordionItem,
  AccordionTrigger
} from './Accordion';

const componentDocs = getComponentDocs('Core/Accordion');
const previewControls = ['type', 'variant', 'collapsible', 'disabled', 'highlight', 'indicator', 'indicatorPosition'];
const propControl = (name, control, options) => {
  const [, summary, defaultValue, description] = componentDocs.props.find(([prop]) => prop === name);
  return {
    control,
    description,
    ...(options ? { options } : {}),
    table: { type: { summary }, defaultValue: { summary: defaultValue } }
  };
};
const previewSource = (_source, { args }) => {
  const attributes = previewControls.map((name) => {
    const value = JSON.stringify(args[name]);
    return `  ${name}=${typeof args[name] === 'string' ? value : `{${value}}`}`;
  });
  return `import { AccordionGroup } from '@gaudi/design-system';\nimport '@gaudi/design-system/global.css';\n\nconst items = ${JSON.stringify(args.items, null, 2)};\n\n<AccordionGroup\n  items={items}\n${attributes.join('\n')}\n/>`;
};
// Keep every preview's code tied to its fixture so examples do not drift.
const sharedSource = exampleSource.slice(
  exampleSource.indexOf('export const faqItems'),
  exampleSource.indexOf('export function BasicExample')
);
const exampleCode = (name) => {
  const start = exampleSource.indexOf(`export function ${name}(`);
  const end = exampleSource.indexOf('\nexport ', start + 1);
  return `import { useId, useState } from 'react';\nimport { AccordionRoot, AccordionGroup, AccordionItem, AccordionTrigger, AccordionContent, Avatar, Button, Card, Icon, Input, Pill, Progress } from '@gaudi/design-system';\nimport '@gaudi/design-system/global.css';\n\n${name === 'OnboardingExample' ? "// Supply a QR image encoding your public setup-guide URL.\nconst setupQr = '/setup-guide.svg';\n" : ''}${sharedSource}\n${exampleSource.slice(start, end < 0 ? undefined : end)}`;
};
const demo = (Component, name, description) => ({
  parameters: {
    docs: {
      description: { story: description },
      source: { code: exampleCode(name), language: 'jsx' }
    }
  },
  render: () => (
    <ExampleFrame>
      <Component />
    </ExampleFrame>
  )
});

export default {
  argTypes: {
    items: {
      ...propControl('items', false),
      table: {
        type: { summary: 'Array', detail: componentDocs.props.find(([name]) => name === 'items')[1] },
        defaultValue: { summary: '[]' }
      }
    },
    type: propControl('type', 'select', ['single', 'multiple']),
    variant: propControl('variant', 'select', ['outline', 'flush', 'separated', 'solid', 'framed']),
    collapsible: propControl('collapsible', 'boolean'),
    disabled: propControl('disabled', 'boolean'),
    highlight: propControl('highlight', 'boolean'),
    indicator: propControl('indicator', 'select', ['chevron', 'plus-minus', 'arrow']),
    indicatorPosition: propControl('indicatorPosition', 'select', ['start', 'end']),
    defaultValue: propControl('defaultValue', false)
  },
  component: AccordionGroup,
  parameters: {
    controls: {
      disable: true,
      include: [...previewControls, 'items']
    },
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs, { examples: true, primaryStory: () => BasicDisclosure, previewControls })
    }
  },
  tags: ['autodocs'],
  id: 'core-accordion',
  title: 'Core/Accordion'
};

export const PatternOverview = {
  render: () => <PatternGallery />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'All eleven ReUI accordion patterns adapted to Gaudi. Each has a focused, copyable story below.'
      }
    }
  }
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const usageTrigger = canvas.getByRole('button', {
      name: 'When should I use accordion?'
    });
    const accessibilityTrigger = canvas.getByRole('button', {
      name: 'Is it accessible?'
    });

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByText(
        'Use it for content that benefits from progressive disclosure.'
      )
    ).toBeVisible();
    await expect(accessibilityTrigger).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    await waitFor(() =>
      expect(
        canvas.queryByText(
          'The trigger is a native button and exposes expanded state.'
        )
      ).not.toBeInTheDocument()
    );

    await userEvent.click(accessibilityTrigger);

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(
        canvas.queryByText(
          'Use it for content that benefits from progressive disclosure.'
        )
      ).not.toBeInTheDocument()
    );
    await expect(accessibilityTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByText(
        'The trigger is a native button and exposes expanded state.'
      )
    ).toBeVisible();
  },
  render: () => (
    <div className='max-w-xl p-6'>
      <AccordionGroup
        items={[
          {
            content:
              'Use it for content that benefits from progressive disclosure.',
            title: 'When should I use accordion?',
            value: 'usage'
          },
          {
            content:
              'The trigger is a native button and exposes expanded state.',
            title: 'Is it accessible?',
            value: 'a11y'
          }
        ]}
      />
    </div>
  )
};

export const MultipleOpen = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const usageTrigger = canvas.getByRole('button', {
      name: 'Can multiple sections stay open?'
    });
    const accessibilityTrigger = canvas.getByRole('button', {
      name: 'What is the keyboard contract?'
    });
    const contentTrigger = canvas.getByRole('button', {
      name: 'How should content be written?'
    });

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(accessibilityTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(contentTrigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(contentTrigger);

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(accessibilityTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(contentTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByText(
        'Keep titles short and put long explanations inside the panel content.'
      )
    ).toBeVisible();
  },
  render: () => (
    <div className='max-w-xl p-6'>
      <AccordionGroup
        type='multiple'
        defaultValue={['usage', 'a11y']}
        items={[
          {
            content:
              'Use it when readers may need more than one answer open while comparing information.',
            title: 'Can multiple sections stay open?',
            value: 'usage'
          },
          {
            content:
              'Triggers are buttons and expose aria-expanded to assistive technology.',
            title: 'What is the keyboard contract?',
            value: 'a11y'
          },
          {
            content:
              'Keep titles short and put long explanations inside the panel content.',
            title: 'How should content be written?',
            value: 'content'
          }
        ]}
      />
    </div>
  )
};

export const Flush = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole('button', { name: '2024' });

    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Two publications')).toBeVisible();
    await expect(firstTrigger.closest('.ds-accordion')).toHaveAttribute(
      'data-variant',
      'flush'
    );
    await expect(getComputedStyle(firstTrigger).paddingInlineStart).toBe('0px');
  },
  render: () => (
    <div className='max-w-xl p-6'>
      <AccordionGroup
        variant='flush'
        items={[
          { content: 'Two publications', title: '2024', value: '2024' },
          { content: 'Three publications', title: '2023', value: '2023' }
        ]}
      />
    </div>
  )
};

export const Composed = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tokensTrigger = canvas.getByRole('button', { name: 'Tokens' });
    const componentsTrigger = canvas.getByRole('button', {
      name: 'Components'
    });

    await expect(tokensTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByText('Color, type, spacing, radius, and motion values.')
    ).toBeVisible();
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(componentsTrigger);

    await expect(tokensTrigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(
        canvas.queryByText('Color, type, spacing, radius, and motion values.')
      ).not.toBeInTheDocument()
    );
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByText(
        'Core components use tokens and expose documented customization props.'
      )
    ).toBeVisible();
  },
  render: () => (
    <div className='max-w-xl p-6'>
      <Accordion defaultValue='tokens'>
        {({ currentValue, setValue }) => (
          <>
            {[
              {
                content: 'Color, type, spacing, radius, and motion values.',
                title: 'Tokens',
                value: 'tokens'
              },
              {
                content:
                  'Core components use tokens and expose documented customization props.',
                title: 'Components',
                value: 'components'
              }
            ].map((item) => {
              const isOpen = currentValue === item.value;

              return (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger
                    isOpen={isOpen}
                    onClick={() => setValue(isOpen ? undefined : item.value)}
                  >
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent isOpen={isOpen}>
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </>
        )}
      </Accordion>
    </div>
  )
};

export const Controlled = {
  args: {
    onValueChange: fn()
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const tokensTrigger = canvas.getByRole('button', { name: 'Tokens' });
    const componentsTrigger = canvas.getByRole('button', {
      name: 'Components'
    });

    await expect(tokensTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(componentsTrigger);

    await expect(args.onValueChange).toHaveBeenLastCalledWith('components');
    await expect(tokensTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByText(
        'Core components use tokens and expose documented customization props.'
      )
    ).toBeVisible();

    await userEvent.click(componentsTrigger);

    await expect(args.onValueChange).toHaveBeenLastCalledWith(undefined);
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(
        canvas.queryByText(
          'Core components use tokens and expose documented customization props.'
        )
      ).not.toBeInTheDocument()
    );
  },
  render: ({ onValueChange }) => {
    const ControlledAccordion = () => {
      const [value, setValue] = useState('tokens');

      return (
        <Accordion
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
        >
          {({ currentValue, setValue: setAccordionValue }) => (
            <>
              {[
                {
                  content: 'Color, type, spacing, radius, and motion values.',
                  title: 'Tokens',
                  value: 'tokens'
                },
                {
                  content:
                    'Core components use tokens and expose documented customization props.',
                  title: 'Components',
                  value: 'components'
                }
              ].map((item) => {
                const isOpen = currentValue === item.value;

                return (
                  <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger
                      isOpen={isOpen}
                      onClick={() =>
                        setAccordionValue(isOpen ? undefined : item.value)
                      }
                    >
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent isOpen={isOpen}>
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </>
          )}
        </Accordion>
      );
    };

    return (
      <div className='max-w-xl p-6'>
        <ControlledAccordion />
      </div>
    );
  }
};

export const BasicDisclosure = {
  args: {
    items: faqItems,
    type: 'single',
    variant: 'flush',
    collapsible: true,
    disabled: false,
    highlight: false,
    indicator: 'chevron',
    indicatorPosition: 'end',
    onValueChange: fn()
  },
  parameters: {
    controls: { disable: false },
    docs: {
      description: { story: 'A single open panel, separators, and automatically associated headings and content. Adjust the controls to explore the group variants and behavior.' },
      source: { type: 'dynamic', language: 'jsx', transform: previewSource }
    }
  },
  render: (args) => (
    <ExampleFrame>
      <AccordionGroup key={args.type} {...args} />
    </ExampleFrame>
  )
};
export const PlusMinus = demo(
  PlusMinusExample,
  'PlusMinusExample',
  'Plus becomes minus when expanded; both icons are decorative.'
);
export const BorderedItems = demo(
  BorderedExample,
  'BorderedExample',
  'Individually bordered items with space between questions.'
);
export const InsideCard = {
  ...demo(
    CardExample,
    'CardExample',
    'A Card supplies the heading and description. Links and actions belong inside the content, outside the trigger.'
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Compare plans' })
    );
    await expect(
      canvas.getByText('Shared collections and member roles.')
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Which plan is right for my team?' })
    ).toHaveAttribute('aria-expanded', 'true');
  }
};
export const DisabledAndHighlighted = {
  ...demo(
    DisabledExample,
    'DisabledExample',
    'Unavailable items explain the access requirement. Open headers use the accent surface.'
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: 'Account history' });
    const locked = canvas.getByRole('button', { name: /Advanced audit logs/ });
    const last = canvas.getByRole('button', { name: 'Email preferences' });
    await expect(locked).toBeDisabled();
    first.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(last).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(first).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(last).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(last).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(last).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(last).toHaveAttribute('aria-expanded', 'false');
  }
};
export const IconsAndBadges = demo(
  IconsExample,
  'IconsExample',
  'Compose existing Icon and Pill components into noninteractive header slots.'
);
export const FramedPanels = demo(
  FramedExample,
  'FramedExample',
  'A muted outer frame groups settings without introducing another container primitive.'
);
export const NestedSections = {
  ...demo(
    NestedExample,
    'NestedExample',
    'Nested accordions have independent values, unique IDs, and their own arrow-key navigation. Use the next heading level for inner sections.'
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByRole('button', { name: 'Additional details' });
    const inner = canvas.getByRole('button', {
      name: 'Technical specifications'
    });
    const sibling = canvas.getByRole('button', { name: 'Compatibility' });
    inner.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(sibling).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(inner).toHaveFocus();
    await userEvent.click(sibling);
    await expect(parent).toHaveAttribute('aria-expanded', 'true');
    await expect(sibling).toHaveAttribute('aria-expanded', 'true');
    parent.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      canvas.getByRole('button', { name: 'Support options' })
    ).toHaveFocus();
  }
};
export const MemberDirectory = demo(
  MembersExample,
  'MembersExample',
  'Avatars are decorative alongside a visible name. Roles and descriptions wrap on narrow screens.'
);
export const LeadingArrow = demo(
  ArrowExample,
  'ArrowExample',
  'A leading arrow rotates on expansion. Logical positioning also supports right-to-left text.'
);
export const GuidedSetup = {
  ...demo(
    OnboardingExample,
    'OnboardingExample',
    'A real QR image links to the public package guide. Completing a step advances the controlled accordion; the form saves locally for this demonstration.'
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: /Set your display name/ })
    ).toBeDisabled();
    const qr = canvas.getByRole('img', {
      name: 'QR code for the Gaudi setup guide'
    });
    await waitFor(() => expect(qr.naturalWidth).toBeGreaterThan(0));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mark guide as read' })
    );
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('value', '2');
    await expect(
      canvas.getByRole('textbox', { name: 'Display name' })
    ).toHaveFocus();
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Display name' }),
      'Amira'
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save display name' })
    );
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Display name saved in this example.'
    );
  }
};
export const RetainedForm = {
  ...demo(
    RetainedFormExample,
    'RetainedFormExample',
    'Use forceMount to keep form drafts mounted. Closed content is hidden and inert, so it leaves both the accessibility tree and tab order.'
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Display name' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Retained draft');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Notifications' })
    );
    await expect(input).not.toBeVisible();
    await expect(input.closest('[role="region"]')).toHaveAttribute('inert');
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole('button', { name: /Profile draft/ })
    );
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('Retained draft');
  }
};
export const MultipleDefault = {
  args: { onValueChange: fn() },
  parameters: {
    docs: {
      description: {
        story:
          'In multiple mode the default first item is an array. Additional sections can open and close independently.'
      },
      source: {
        code: "<AccordionGroup type='multiple' items={items} onValueChange={(values) => console.log(values)} />"
      }
    }
  },
  render: ({ onValueChange }) => (
    <ExampleFrame>
      <AccordionGroup
        type='multiple'
        items={faqItems}
        onValueChange={onValueChange}
      />
    </ExampleFrame>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Can I change my billing schedule?' })
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith([
      'plans',
      'billing'
    ]);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Which plan is right for my team?' })
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['billing']);
  }
};
function ControlledGroupExample({ onValueChange }) {
  const [value, setValue] = useState('plans');
  return (
    <ExampleFrame>
      <div className='grid gap-4 [&>button]:justify-self-start'>
        <Button size='sm' variant='outline' onClick={() => setValue(undefined)}>
          Collapse all
        </Button>
        <AccordionGroup
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange(next);
          }}
          items={faqItems}
        />
      </div>
    </ExampleFrame>
  );
}
export const ControlledGroup = {
  parameters: {
    docs: {
      description: {
        story:
          'An explicitly undefined value keeps a controlled group fully collapsed, including after external updates.'
      },
      source: {
        code: "const [value, setValue] = useState('plans');\n\n<div className='grid gap-4 [&>button]:justify-self-start'>\n  <Button size='sm' variant='outline' onClick={() => setValue(undefined)}>\n    Collapse all\n  </Button>\n  <AccordionGroup value={value} onValueChange={setValue} items={items} />\n</div>"
      }
    }
  },
  args: { onValueChange: fn() },
  render: (args) => <ControlledGroupExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Can I change my billing schedule?' })
    );
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse all' }));
    await expect(
      canvas.getByRole('button', { name: 'Can I change my billing schedule?' })
    ).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Which plan is right for my team?' })
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith('plans');
  }
};
export const AlwaysOneOpen = {
  parameters: {
    docs: {
      description: {
        story:
          '`collapsible={false}` prevents closing the active section, while keeping navigation to other sections available.'
      },
      source: {
        code: "<AccordionGroup collapsible={false} defaultValue='plans' items={items} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <AccordionGroup collapsible={false} items={faqItems} />
    </ExampleFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', {
      name: 'Which plan is right for my team?'
    });
    await expect(first).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(first);
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Can I change my billing schedule?' })
    );
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  }
};
export const CustomIndicatorAndSolid = {
  render: () => (
    <ExampleFrame>
      <AccordionGroup
        variant='solid'
        indicator={({ isOpen }) => <span>{isOpen ? 'Close' : 'Read'}</span>}
        defaultValue={null}
        items={faqItems}
      />
    </ExampleFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Supply a node or a render function for an indicator, or null to hide it. The trigger always communicates expanded state to assistive technology.'
      },
      source: {
        code: "<AccordionGroup variant='solid' defaultValue={null} indicator={({ isOpen }) => <span>{isOpen ? 'Close' : 'Read'}</span>} items={items} />"
      }
    }
  }
};
export const RightToLeft = {
  render: () => (
    <ExampleFrame>
      <AccordionGroup
        dir='rtl'
        indicator='arrow'
        indicatorPosition='start'
        items={[
          {
            value: 'account',
            title: 'إعدادات الحساب',
            description: 'إدارة الملف الشخصي والإشعارات',
            content: 'يمكنك تحديث اسمك وتفضيلات الإشعارات من إعدادات الحساب.'
          },
          {
            value: 'support',
            title: 'المساعدة والدعم',
            content: 'تواصل مع مسؤول مساحة العمل للحصول على المساعدة.'
          }
        ]}
      />
    </ExampleFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Logical spacing and start alignment support RTL content. The reading direction is supplied by the consumer.'
      }
    }
  }
};
