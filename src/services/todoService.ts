import { TodoItem } from '../types/todo';

const STORAGE_KEY = 'todos';

export const todoService = {
  getTodos: (): TodoItem[] => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  },

  saveTodos: (todos: TodoItem[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },

  addTodo: (todos: TodoItem[], text: string): TodoItem[] => {
    const newTodo: TodoItem = { id: Date.now(), text, completed: false };
    const updatedTodos = [...todos, newTodo];
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

  updateTodo: (todos: TodoItem[], id: number, newText: string): TodoItem[] => {
    return todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
  },
};