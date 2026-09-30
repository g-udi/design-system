import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';

const roles = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Admin', value: 'admin' }
];

// The popup layers above the dialog and stays inside its focus trap.
export function Pattern() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>Choose the role they join with.</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor='select-dialog-role'>Role</FieldLabel>
          <Select defaultValue='editor'>
            <SelectTrigger id='select-dialog-role' className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectGroup>
                {roles.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </DialogContent>
    </Dialog>
  );
}
