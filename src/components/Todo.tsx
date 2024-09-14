import React, { useState } from 'react';
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
  TodoSummary,
  PriorityGroup,
  PriorityTitle,
  CompactModeToggle
} from './TodoStyles';

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => todoService.getTodos());
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(false);

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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reorder within the same priority group
      const priority = source.droppableId as PriorityType;
      const items = todoService.reorderTodosWithinPriority(
        todos,
        priority,
        source.index,
        destination.index
      );
      setTodos(items);
    } else {
      // Move between priority groups
      const items = todoService.moveTodoBetweenPriorities(
        todos,
        source.droppableId as PriorityType,
        destination.droppableId as PriorityType,
        source.index,
        destination.index
      );
      setTodos(items);
    }
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

  const groupedTodos = {
    high: filteredTodos.filter(todo => todo.priority === 'high'),
    medium: filteredTodos.filter(todo => todo.priority === 'medium'),
    low: filteredTodos.filter(todo => todo.priority === 'low'),
  };

  return (
    <TodoContainer id="todo-container">
      <CompactModeToggle id="compact-mode-toggle" onClick={() => setIsCompactMode(!isCompactMode)}>
        {isCompactMode ? 'Normal Mode' : 'Compact Mode'}
      </CompactModeToggle>
      <TodoTitle id="todo-title">Tino's Todo List</TodoTitle>
      <TodoInputContainer id="todo-input-container">
        <TodoInput
          id="todo-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleInputKeyPress}
          placeholder="Add a new todo"
        />
        <TodoSelect 
          id="priority-select"
          value={priority} 
          onChange={(e) => setPriority(e.target.value as PriorityType)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </TodoSelect>
        <TodoButton id="add-todo-button" onClick={addTodo}>Add</TodoButton>
      </TodoInputContainer>
      <TodoFilterContainer id="todo-filter-container">
        <TodoFilterButton id="filter-all" active={filter === 'all'} onClick={() => setFilter('all')}>All</TodoFilterButton>
        <TodoFilterButton id="filter-active" active={filter === 'active'} onClick={() => setFilter('active')}>Active</TodoFilterButton>
        <TodoFilterButton id="filter-completed" active={filter === 'completed'} onClick={() => setFilter('completed')}>Completed</TodoFilterButton>
      </TodoFilterContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(groupedTodos).map(([priority, todos]) => (
          <PriorityGroup key={priority}>
            <PriorityTitle>{priority.charAt(0).toUpperCase() + priority.slice(1)} Priority</PriorityTitle>
            <Droppable droppableId={priority}>
              {(provided) => (
                <TodoList {...provided.droppableProps} ref={provided.innerRef}>
                  {todos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                      {(provided) => (
                        <TodoListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            padding: isCompactMode ? '5px' : '10px',
                            fontSize: isCompactMode ? '14px' : '16px',
                          }}
                        >
                          <TodoCheckbox
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                          />
                          <TodoText
                            completed={todo.completed}
                            priority={todo.priority}
                            onClick={() => startEditing(todo.id)}
                          >
                            {editingId === todo.id ? (
                              <input
                                type="text"
                                defaultValue={todo.text}
                                onBlur={(e) => finishEditing(todo.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    finishEditing(todo.id, e.currentTarget.value);
                                  }
                                }}
                                autoFocus
                                style={{
                                  width: '100%',
                                  border: 'none',
                                  background: 'transparent',
                                  fontSize: 'inherit',
                                  fontFamily: 'inherit',
                                  color: 'inherit',
                                  outline: 'none',
                                  padding: '0',
                                }}
                              />
                            ) : (
                              todo.text
                            )}
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
          </PriorityGroup>
        ))}
      </DragDropContext>
      <TodoSummary id="todo-summary">
        {filter === 'all' && `Total: ${todos.length}`}
        {filter === 'active' && `Active: ${todos.filter(todo => !todo.completed).length}`}
        {filter === 'completed' && `Completed: ${todos.filter(todo => todo.completed).length}`}
      </TodoSummary>
    </TodoContainer>
  );
};

export default Todo;