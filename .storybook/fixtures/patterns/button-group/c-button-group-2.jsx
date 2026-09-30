import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline'>Button</Button>
      <Input
        aria-label='Type something here...'
        placeholder='Type something here...'
      />
    </ButtonGroup>
  );
}
