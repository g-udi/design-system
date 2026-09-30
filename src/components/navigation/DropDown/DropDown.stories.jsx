import { useId, useRef, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import DropDown from './DropDown';

const docs = getComponentDocs('Navigation/DropDown');
const panelText = 'Design, engineering, and research notes.';

function DisclosureExample({ bounded = false, name, setMenuDropDownOpen }) {
  const [open, setOpen] = useState(false);
  const boundaryRef = useRef(null);
  const id = useId();
  const update = (next) => {
    setOpen(next);
    setMenuDropDownOpen(next);
  };
  return (
    <div ref={boundaryRef} className='inline-block'>
      <DropDown
        id={`${id}-trigger`}
        controlsId={`${id}-panel`}
        name={name}
        menuDropDownOpen={open}
        setMenuDropDownOpen={update}
        outsideClickRef={bounded ? boundaryRef : undefined}
      />
      <div
        id={`${id}-panel`}
        aria-labelledby={`${id}-trigger`}
        hidden={!open}
        className='mt-2 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-800'
      >
        {panelText}
      </div>
    </div>
  );
}

export default {
  title: 'Navigation/DropDown',
  id: 'navigation-dropdown',
  component: DropDown,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { name: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  args: { name: 'Topics', setMenuDropDownOpen: fn() }
};

export const Playground = {
  parameters: {
    docs: {
      source: playgroundSource('DropDown', {
        imports: "import { useState } from 'react';\nimport { DropDown } from '@gaudi/design-system';\n\nconst [open, setOpen] = useState(false);",
        attributes: ['menuDropDownOpen={open}', 'setMenuDropDownOpen={setOpen}']
      })
    }
  },
  render: (args) => <DisclosureExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: args.name });
    await expect(document.getElementById(trigger.getAttribute('aria-controls'))).not.toBeVisible();
    await userEvent.click(trigger);
    await expect(args.setMenuDropDownOpen).toHaveBeenLastCalledWith(true);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await expect(args.setMenuDropDownOpen).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(document.body);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};

export const OutsideClickBoundary = {
  parameters: { docs: { description: { story: '`outsideClickRef` widens the boundary to the trigger and its panel, so clicks inside the panel keep it open.' } } },
  render: (args) => <DisclosureExample bounded {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: args.name });
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByText(panelText));
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(document.body);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};
