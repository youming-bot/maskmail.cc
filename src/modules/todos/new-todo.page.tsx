import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/modules/auth/utils/auth-utils';
import { getAllCategories } from '@/modules/todos/actions/get-categories.action';
import { TodoForm } from './components/todo-form';
import todosRoutes from './todos.route';

export default async function NewTodoPage() {
  const user = await requireAuth();
  const categories = await getAllCategories(user.id);

  return (
    <>
      <div className="mb-8">
        <Link href={todosRoutes.list}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Todos
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Todo</h1>
        <p className="text-gray-600 mt-1">Add a new task to your todo list</p>
      </div>

      <TodoForm user={user} categories={categories} />
    </>
  );
}
