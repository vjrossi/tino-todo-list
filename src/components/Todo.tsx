import React, { useState } from 'react';
import styled from 'styled-components';
import { todoService } from '../services/todoService';
import { TodoItem } from '../types/todo';

type FilterType = 'all' | 'active' | 'completed';
type PriorityType = 'low' | 'medium' | 'high';

const TodoContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const TodoTitle = styled.h1`
  text-align: center;
  color: #333;
`;

const TodoInputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const TodoInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
`;

const TodoSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-left: none;
  background-color: white;
`;

const TodoButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
`;

const TodoFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const TodoFilterButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  background-color: ${props => props.active ? '#ddd' : '#f1f1f1'};
  border: none;
  cursor: pointer;
  margin: 0 5px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const TodoList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TodoListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const TodoCheckbox = styled.input`
  margin-right: 10px;
`;

const TodoText = styled.span<{ completed: boolean; priority: PriorityType }>`
  flex-grow: 1;
  margin-right: 10px;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#888' : 
    props.priority === 'high' ? 'red' :
    props.priority === 'medium' ? 'orange' : 'green'};
`;

const TodoDeleteButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const TodoSummary = styled.div`
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
`;

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

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <TodoContainer>
      <TodoTitle>Todo List</TodoTitle>
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