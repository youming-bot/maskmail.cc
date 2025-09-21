import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import getAllTodos from '@/modules/todos/actions/get-todos.action';
import { TodoCard } from '@/modules/todos/components/todo-card';
import todosRoutes from './todos.route';

export default async function TodoListPage() {
  const todos = await getAllTodos();

  return (
    <>
      <div className="flex justify-between items-center mb-8 w-full">
        <div>
          <h1 className="text-3xl font-bold">Todos</h1>
          <p className="text-gray-600 mt-1">Manage your tasks and stay organized</p>
        </div>
        <Link href={todosRoutes.new}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Todo
          </Button>
        </Link>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12 w-full">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No todos yet</h3>
          <p className="text-gray-500 mb-6">Create your first todo to get started</p>
          <Link href={todosRoutes.new}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create First Todo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {todos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </>
  );
}
