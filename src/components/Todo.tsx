import React, { useState } from 'react';
import { todoService } from '../services/todoService';
import { TodoItem, FilterType, PriorityType } from '../types/todo';
import {
  TodoContainer,
  TodoTitle,
  TodoInputContainer,
  TodoInput,
  TodoSelect,
  TodoButton,
  TodoFilterContainer,
  TodoFilterButton,
  TodoList,
  TodoListItem,
  TodoCheckbox,
  TodoText,
  TodoDeleteButton,
  TodoSummary
} from './TodoStyles';

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => todoService.getTodos());
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [priority, setPriority] = useState<PriorityType>('medium');

  const addTodo = () => {
    if (inputText.trim() !== '') {
      setTodos(todoService.addTodo(todos, inputText, priority));
      setInputText('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todoService.toggleTodo(todos, id));
  };

  const deleteTodo = (id: number) => {
    setTodos(todoService.deleteTodo(todos, id));
  };

  const changePriority = (id: number, newPriority: PriorityType) => {
    setTodos(todoService.changePriority(todos, id, newPriority));
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  return (
    <TodoContainer>
      <TodoTitle>Tino's Todo List</TodoTitle>
      <TodoInputContainer>
        <TodoInput
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a new todo"
        />
        <TodoSelect 
          value={priority} 
          onChange={(e) => setPriority(e.target.value as PriorityType)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </TodoSelect>
        <TodoButton onClick={addTodo}>Add</TodoButton>
      </TodoInputContainer>
      <TodoFilterContainer>
        <TodoFilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</TodoFilterButton>
        <TodoFilterButton active={filter === 'active'} onClick={() => setFilter('active')}>Active</TodoFilterButton>
        <TodoFilterButton active={filter === 'completed'} onClick={() => setFilter('completed')}>Completed</TodoFilterButton>
      </TodoFilterContainer>
      <TodoList>
        {filteredTodos.map(todo => (
          <TodoListItem key={todo.id}>
            <TodoCheckbox
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <TodoText completed={todo.completed} priority={todo.priority}>
              {todo.text}
            </TodoText>
            <TodoSelect 
              value={todo.priority} 
              onChange={(e) => changePriority(todo.id, e.target.value as PriorityType)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </TodoSelect>
            <TodoDeleteButton onClick={() => deleteTodo(todo.id)}>Delete</TodoDeleteButton>
          </TodoListItem>
        ))}
      </TodoList>
      <TodoSummary>
        {filter === 'all' && `Total: ${todos.length}`}
        {filter === 'active' && `Active: ${todos.filter(todo => !todo.completed).length}`}
        {filter === 'completed' && `Completed: ${todos.filter(todo => todo.completed).length}`}
      </TodoSummary>
    </TodoContainer>
  );
};

export default Todo;