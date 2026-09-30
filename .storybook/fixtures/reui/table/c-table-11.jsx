// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
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
  {
    name: 'Ergonomic Desk Chair',
    sku: 'FRN-001',
    category: 'Furniture',
    price: '$549.00',
    stock: 124,
    stockStatus: 'In Stock',
    stockVariant: 'success-light'
  },
  {
    name: 'Wireless Noise-Canceling Headphones',
    sku: 'AUD-042',
    category: 'Audio',
    price: '$349.99',
    stock: 8,
    stockStatus: 'Low Stock',
    stockVariant: 'warning-light'
  },
  {
    name: '4K Ultra HD Monitor 32"',
    sku: 'DSP-019',
    category: 'Displays',
    price: '$799.00',
    stock: 0,
    stockStatus: 'Out of Stock',
    stockVariant: 'destructive-light'
  },
  {
    name: 'Mechanical Keyboard RGB',
    sku: 'INP-087',
    category: 'Input',
    price: '$179.99',
    stock: 56,
    stockStatus: 'In Stock',
    stockVariant: 'success-light'
  },
  {
    name: 'USB-C Docking Station',
    sku: 'ACC-033',
    category: 'Accessories',
    price: '$249.00',
    stock: 3,
    stockStatus: 'Low Stock',
    stockVariant: 'warning-light'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className='text-right'>Price</TableHead>
            <TableHead className='w-10' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.sku}>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <div className='bg-ui-muted flex size-9 shrink-0 items-center justify-center rounded-sm'>
                    <RegistryIcon
                      lucide='PackageIcon'
                      className='text-ui-muted-foreground size-4'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>{product.name}</span>
                    <span className='text-ui-muted-foreground truncate font-mono text-xs'>
                      {product.sku}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className='text-ui-muted-foreground text-sm'>
                {product.category}
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Badge variant={product.stockVariant} size='sm'>
                    {product.stockStatus}
                  </Badge>
                  <span className='text-ui-muted-foreground text-xs'>
                    ({product.stock})
                  </span>
                </div>
              </TableCell>
              <TableCell className='text-right text-sm font-medium'>
                {product.price}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='size-8'>
                      <RegistryIcon lucide='MoreHorizontalIcon' />
                      <span className='sr-only'>Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Restock</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant='destructive'>
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
