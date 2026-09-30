import { useId, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import Input from '../Input';
import {
  Accordion,
  AccordionContent,
  AccordionGroup,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from './Accordion';

const docs = getComponentDocs('Core/Accordion');
const items = [
  {
    value: 'plans',
    title: 'Which plan is right for my team?',
    content: 'A team workspace adds shared collections, review workflows, and member permissions.'
  },
  {
    value: 'billing',
    title: 'Can I change my billing schedule?',
    content: 'Review your next renewal in billing settings. Current access continues until that date.'
  },
  {
    value: 'export',
    title: 'How do I export my content?',
    content: 'Open workspace settings and choose Export to download articles and assets.'
  }
];
const trigger = (canvas, index) => canvas.getByRole('button', { name: items[index].title });

export default {
  title: 'Core/Accordion',
  id: 'core-accordion',
  component: AccordionGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    type: ['single', 'multiple'],
    variant: ['outline', 'flush', 'separated', 'solid', 'framed'],
    collapsible: 'boolean',
    disabled: 'boolean',
    highlight: 'boolean',
    indicator: ['chevron', 'plus-minus', 'arrow'],
    indicatorPosition: ['start', 'end']
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
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
    docs: {
      source: playgroundSource('AccordionGroup', {
        imports: `import { AccordionGroup } from '@gaudi/design-system';\n\nconst items = ${JSON.stringify(items, null, 2)};`
      })
    }
  },
  render: (args) => <AccordionGroup key={args.type} items={items} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(trigger(canvas, 0)).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger(canvas, 1));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(args.type === 'multiple' ? ['plans', 'billing'] : 'billing');
    await expect(canvas.getByText(items[1].content)).toBeVisible();
  }
};

export const Multiple = {
  args: { onValueChange: fn() },
  parameters: { docs: { description: { story: 'Multiple mode takes an array value, so sections open and close independently.' } } },
  render: ({ onValueChange }) => (
    <AccordionGroup type='multiple' defaultValue={['plans', 'billing']} items={items} onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(trigger(canvas, 2));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['plans', 'billing', 'export']);
    await userEvent.click(trigger(canvas, 0));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['billing', 'export']);
    await expect(trigger(canvas, 1)).toHaveAttribute('aria-expanded', 'true');
  }
};

function ControlledExample({ onValueChange }) {
  const [value, setValue] = useState('plans');
  const update = (next) => {
    setValue(next);
    onValueChange(next);
  };
  return (
    <div className='grid gap-3 [&>button]:justify-self-start'>
      <Button size='sm' variant='outline' onClick={() => setValue(undefined)}>
        Collapse all
      </Button>
      <AccordionGroup value={value} onValueChange={update} items={items} />
    </div>
  );
}
export const Controlled = {
  args: { onValueChange: fn() },
  parameters: { docs: { description: { story: 'The host owns `value`. An explicit `undefined` collapses every panel.' } } },
  render: (args) => <ControlledExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(trigger(canvas, 1));
    await expect(args.onValueChange).toHaveBeenLastCalledWith('billing');
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse all' }));
    await expect(trigger(canvas, 1)).toHaveAttribute('aria-expanded', 'false');
  }
};

export const AlwaysOneOpen = {
  parameters: { docs: { description: { story: '`collapsible={false}` keeps the active section open until another one opens.' } } },
  render: () => <AccordionGroup collapsible={false} items={items} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(trigger(canvas, 0)).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(trigger(canvas, 0));
    await expect(trigger(canvas, 0)).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger(canvas, 1));
    await expect(trigger(canvas, 0)).toHaveAttribute('aria-expanded', 'false');
  }
};

export const Compound = {
  parameters: { docs: { description: { story: 'Compose `AccordionRoot`, `AccordionItem`, `AccordionTrigger`, and `AccordionContent` for full control over each part.' } } },
  render: () => (
    <AccordionRoot defaultValue='tokens' variant='outline'>
      <AccordionItem value='tokens'>
        <AccordionTrigger description='Color, type, spacing, and motion'>Tokens</AccordionTrigger>
        <AccordionContent>Every component reads the same semantic tokens.</AccordionContent>
      </AccordionItem>
      <AccordionItem value='components'>
        <AccordionTrigger>Components</AccordionTrigger>
        <AccordionContent>Components expose documented customization props.</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Components' }));
    await expect(canvas.getByRole('button', { name: /Tokens/ })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('Components expose documented customization props.')).toBeVisible();
  }
};

function RetainedFormExample() {
  const inputId = useId();
  return (
    <AccordionRoot defaultValue='profile' variant='separated'>
      <AccordionItem value='profile'>
        <AccordionTrigger description='Drafts remain when this panel closes.'>Profile draft</AccordionTrigger>
        <AccordionContent forceMount>
          <label htmlFor={inputId}>Display name</label>
          <Input id={inputId} defaultValue='Amira' />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='notifications'>
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>Choose your notification preferences in account settings.</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
export const RetainedForm = {
  parameters: { docs: { description: { story: '`forceMount` keeps drafts mounted. Closed content is hidden and inert, so it leaves the accessibility tree and tab order.' } } },
  render: () => <RetainedFormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Display name' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Retained draft');
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }));
    await expect(input).not.toBeVisible();
    await expect(input.closest('[role="region"]')).toHaveAttribute('inert');
    await userEvent.click(canvas.getByRole('button', { name: /Profile draft/ }));
    await expect(input).toHaveValue('Retained draft');
  }
};

export const CustomIndicator = {
  parameters: { docs: { description: { story: 'Pass a node or render function as `indicator`, or `null` to hide it. The trigger still exposes its expanded state.' } } },
  render: () => (
    <AccordionGroup
      variant='solid'
      defaultValue={null}
      indicator={({ isOpen }) => <span className='text-xs text-text-muted'>{isOpen ? 'Close' : 'Read'}</span>}
      items={items}
    />
  )
};

export const RenderFunction = {
  args: { onValueChange: fn() },
  parameters: { docs: { description: { story: 'Legacy render-function children with explicit `isOpen` and `onClick` remain supported for existing consumers.' } } },
  render: ({ onValueChange }) => (
    <Accordion defaultValue='plans' onValueChange={onValueChange}>
      {({ currentValue, setValue }) =>
        items.slice(0, 2).map((item) => {
          const isOpen = currentValue === item.value;
          return (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger isOpen={isOpen} onClick={() => setValue(isOpen ? undefined : item.value)}>
                {item.title}
              </AccordionTrigger>
              <AccordionContent isOpen={isOpen}>{item.content}</AccordionContent>
            </AccordionItem>
          );
        })
      }
    </Accordion>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(trigger(canvas, 1));
    await expect(args.onValueChange).toHaveBeenLastCalledWith('billing');
    await waitFor(() => expect(canvas.queryByText(items[0].content)).not.toBeInTheDocument());
    await userEvent.click(trigger(canvas, 1));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(undefined);
  }
};

export const RightToLeft = {
  parameters: { docs: { description: { story: 'Logical spacing and indicator position follow the reading direction supplied by the consumer.' } } },
  render: () => (
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
        { value: 'support', title: 'المساعدة والدعم', content: 'تواصل مع مسؤول مساحة العمل للحصول على المساعدة.' }
      ]}
    />
  )
};
