import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';

import {
  TableRoot as Table,
  TableBodyPrimitive as TableBody,
  TableCellPrimitive as TableCell,
  TableHeadPrimitive as TableHead,
  TableHeader,
  TableRowPrimitive as TableRow
} from '@gaudi/design-system/mdx/Table';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';
const items = [
  { id: '1', name: 'Item Alpha', quantity: 1, price: '$10.00' },
  { id: '2', name: 'Item Beta', quantity: 2, price: '$20.00' },
  { id: '3', name: 'Item Gamma', quantity: 1, price: '$30.00' }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col'>
      <Card className='p-0'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className='text-right'>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.name}</TableCell>
                  <TableCell>
                    <NumberField defaultValue={item.quantity} className='h-8 w-20' min={0}>
                      <NumberFieldGroup>
                        <NumberFieldInput aria-label='Quantity' />
                      </NumberFieldGroup>
                    </NumberField>
                  </TableCell>
                  <TableCell className='text-right'>{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
