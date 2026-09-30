// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../src/components/mdx/Table/parts/table.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const products = [
  { id: '1', name: 'Wireless Mouse', price: '$29.99' },
  { id: '2', name: 'Mechanical Keyboard', price: '$129.99' },
  { id: '3', name: 'USB-C Hub', price: '$49.99' }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col'>
      <Card className='p-0'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className='font-medium'>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='size-8'>
                          <RegistryIcon lucide='MoreHorizontalIcon' />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant='destructive'>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
