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

    // Update the order property for all todos
    const updatedTodos = result.map((todo, index) => ({
      ...todo,
      order: index
    }));

    todoService.saveTodos(updatedTodos);
    return updatedTodos;
  },

  reorderTodosWithinPriority: (todos: TodoItem[], priority: PriorityType, startIndex: number, endIndex: number): TodoItem[] => {
    const priorityTodos = todos.filter(todo => todo.priority === priority);
    const otherTodos = todos.filter(todo => todo.priority !== priority);
    
    const [reorderedItem] = priorityTodos.splice(startIndex, 1);
    priorityTodos.splice(endIndex, 0, reorderedItem);

    const updatedTodos = [...otherTodos, ...priorityTodos].map((todo, index) => ({
      ...todo,
      order: index
    }));

    todoService.saveTodos(updatedTodos);
    return updatedTodos;
  },

  moveTodoBetweenPriorities: (todos: TodoItem[], sourcePriority: PriorityType, destinationPriority: PriorityType, sourceIndex: number, destinationIndex: number): TodoItem[] => {
    const sourceTodos = todos.filter(todo => todo.priority === sourcePriority);
    const destinationTodos = todos.filter(todo => todo.priority === destinationPriority);
    const otherTodos = todos.filter(todo => todo.priority !== sourcePriority && todo.priority !== destinationPriority);

    const [movedItem] = sourceTodos.splice(sourceIndex, 1);
    movedItem.priority = destinationPriority;
    destinationTodos.splice(destinationIndex, 0, movedItem);

    const updatedTodos = [...otherTodos, ...sourceTodos, ...destinationTodos].map((todo, index) => ({
      ...todo,
      order: index
    }));

    todoService.saveTodos(updatedTodos);
    return updatedTodos;
  },

};