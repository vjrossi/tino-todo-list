import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { todoService } from '../services/todoService';
import { TodoItem, FilterType, PriorityType } from '../types/todoItem';
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
  CompactModeToggle,
  PriorityOption,
  PrioritySelector,
  TodoDueDate,
  DueDateContainer,
  DueDateButton
} from './TodoStyles';
import DueDateSelector from './DueDateSelector';

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => todoService.getTodos());
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.trim() !== '') {
      addTodo();
    }
  };

  const addTodo = () => {
    if (inputText.trim() !== '') {
      setTodos(todoService.addTodo(todos, inputText, priority, dueDate));
      setInputText('');
      setDueDate(null);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todoService.toggleTodo(todos, id));
  };

  const deleteTodo = (id: number) => {
    setTodos(todoService.deleteTodo(todos, id));
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

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isTomorrow = (date: Date | null) => {
    if (!date) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();
  };

  const isFriday = (date: Date | null) => {
    if (!date) return false;
    return date.getDay() === 5;
  };

  const handleDateButtonClick = (option: string) => {
    let newDate: Date | null = null;
    switch (option) {
      case 'today':
        newDate = new Date();
        break;
      case 'tomorrow':
        newDate = new Date();
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'friday':
        newDate = new Date();
        newDate.setDate(newDate.getDate() + ((5 + 7 - newDate.getDay()) % 7));
        break;
      case 'custom':
        // Implement custom date picker logic here
        break;
    }
    if (newDate) {
      newDate.setHours(23, 59, 59, 999);
    }
    setDueDate(newDate);
  };

  return (
    <TodoContainer id="todo-container">
      <CompactModeToggle id="compact-mode-toggle" onClick={() => setIsCompactMode(!isCompactMode)}>
        {isCompactMode ? 'Normal Mode' : 'Compact Mode'}
      </CompactModeToggle>
      <TodoTitle id="todo-title">Tino's Todo List</TodoTitle>
      <TodoInputContainer>
        <TodoInput
          id="todo-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleInputKeyPress}
          placeholder="Add a new todo and press Enter"
        />
        <DueDateContainer>
          <DueDateButton active={isToday(dueDate)} onClick={() => handleDateButtonClick('today')}>
            Today
          </DueDateButton>
          <DueDateButton active={isTomorrow(dueDate)} onClick={() => handleDateButtonClick('tomorrow')}>
            Tomorrow
          </DueDateButton>
          <DueDateButton active={isFriday(dueDate)} onClick={() => handleDateButtonClick('friday')}>
            Friday
          </DueDateButton>
          <DueDateButton active={false} onClick={() => handleDateButtonClick('custom')}>
            In x days
          </DueDateButton>
        </DueDateContainer>
        <PrioritySelector>
          {['low', 'medium', 'high'].map((p) => (
            <PriorityOption key={p}>
              <input
                type="radio"
                id={`priority-${p}`}
                name="priority"
                value={p}
                checked={priority === p}
                onChange={() => setPriority(p as PriorityType)}
              />
              <label htmlFor={`priority-${p}`}>{p.charAt(0).toUpperCase() + p.slice(1)}</label>
            </PriorityOption>
          ))}
        </PrioritySelector>
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
                          {todo.dueDate && (
                            <TodoDueDate>
                              Due: {new Date(todo.dueDate).toLocaleDateString()}
                            </TodoDueDate>
                          )}
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