import { TodoItem, PriorityType } from '../types/todo';

const STORAGE_KEY = 'todos';

export const todoService = {
  getTodos: (): TodoItem[] => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  },

  saveTodos: (todos: TodoItem[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },

  addTodo: (todos: TodoItem[], text: string, priority: PriorityType): TodoItem[] => {
    const newTodo: TodoItem = { id: Date.now(), text, completed: false, priority, order: todos.length, editing: false };
    const updatedTodos = [...todos, newTodo];
    todoService.saveTodos(updatedTodos);
    return updatedTodos;
  },
  editTodo: (todos: TodoItem[], id: number, newText: string): TodoItem[] => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text: newText.trim() } : todo
    );
    todoService.saveTodos(updatedTodos);
    return updatedTodos;
  },
  toggleTodo: (todos: TodoItem[], id: number): TodoItem[] => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    todoService.saveTodos(updatedTodos);
    return updatedTodos;
  },

  deleteTodo: (todos: TodoItem[], id: number): TodoItem[] => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    todoService.saveTodos(updatedTodos);
    return updatedTodos;
  },

  changePriority: (todos: TodoItem[], id: number, newPriority: PriorityType): TodoItem[] => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, priority: newPriority } : todo
    );
    todoService.saveTodos(updatedTodos);
    return updatedTodos;
  },

  reorderTodos: (todos: TodoItem[], startIndex: number, endIndex: number): TodoItem[] => {
    const result = Array.from(todos);
    const [reorderedItem] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, reorderedItem);

    // Update the order property for each todo
    const updatedTodos = result.map((todo, index) => ({
      ...todo,
      order: index
    }));

    todoService.saveTodos(updatedTodos);
    return updatedTodos;
  },
};