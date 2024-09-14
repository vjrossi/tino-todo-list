import React, { useState, KeyboardEvent } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.trim() !== '') {
      addTodo();
    }
  };

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

  const startEditing = (id: number) => {
    setEditingId(id);
  };

  const finishEditing = (id: number, newText: string) => {
    if (newText.trim() !== '') {
      setTodos(todoService.editTodo(todos, id, newText));
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing(id, e.currentTarget.value);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = todoService.reorderTodos(
      todos,
      result.source.index,
      result.destination.index
    );

    setTodos(items);
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
          onKeyPress={handleInputKeyPress}
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <TodoList {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTodos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(provided) => (
                    <TodoListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TodoCheckbox
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                      />
                      <TodoText
                        completed={todo.completed}
                        priority={todo.priority}
                        onClick={() => toggleTodo(todo.id)}
                      >
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
                      <TodoDeleteButton onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </TodoDeleteButton>
                    </TodoListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </TodoList>
          )}
        </Droppable>
      </DragDropContext>
      <TodoSummary>
        {filter === 'all' && `Total: ${todos.length}`}
        {filter === 'active' && `Active: ${todos.filter(todo => !todo.completed).length}`}
        {filter === 'completed' && `Completed: ${todos.filter(todo => todo.completed).length}`}
      </TodoSummary>
    </TodoContainer>
  );
};

export default Todo;