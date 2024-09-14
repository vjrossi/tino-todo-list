import { TodoItem } from '../types/todo';

const STORAGE_KEY = 'todos';

export const todoService = {
  getTodos: (): TodoItem[] => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error('Error retrieving todos from localStorage:', error);
      return [];
    }
  },

  saveTodos: (todos: TodoItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
      // Optionally, you could throw the error here to be handled by the component
      // throw new Error('Failed to save todos');
    }
  },

  addTodo: (todos: TodoItem[], text: string): TodoItem[] => {
    const newTodo: TodoItem = { id: Date.now(), text, completed: false };
    const updatedTodos = [...todos, newTodo];
    try {
      todoService.saveTodos(updatedTodos);
      return updatedTodos;
    } catch (error) {
      console.error('Error adding todo:', error);
      return todos; // Return original todos if save fails
    }
  },

  toggleTodo: (todos: TodoItem[], id: number): TodoItem[] => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    try {
      todoService.saveTodos(updatedTodos);
      return updatedTodos;
    } catch (error) {
      console.error('Error toggling todo:', error);
      return todos; // Return original todos if save fails
    }
  },

  deleteTodo: (todos: TodoItem[], id: number): TodoItem[] => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    try {
      todoService.saveTodos(updatedTodos);
      return updatedTodos;
    } catch (error) {
      console.error('Error deleting todo:', error);
      return todos; // Return original todos if save fails
    }
  },
};