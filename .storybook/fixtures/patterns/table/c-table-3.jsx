import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../src/components/mdx/Table/parts/table.jsx';
const tasks = [
  {
    id: '1',
    name: 'Design homepage',
    status: 'Completed',
    statusColor: 'bg-green-500/10 text-green-700 dark:text-green-300'
  },
  {
    id: '2',
    name: 'Implement API',
    status: 'In Progress',
    statusColor: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
  },
  {
    id: '3',
    name: 'Write tests',
    status: 'Pending',
    statusColor: 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col'>
      <Card className='p-0'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className='text-right'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className='font-medium'>{task.name}</TableCell>
                  <TableCell className='text-right'>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${task.statusColor}`}
                    >
                      {task.status}
                    </span>
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
