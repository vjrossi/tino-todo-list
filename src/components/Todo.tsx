import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { todoService } from '../services/todoService';
import { TodoItem, FilterType, PriorityType } from '../types/todoItem';
import {
  TodoContainer,
  TodoTitle,
  TodoInputContainer,
  TodoInput,
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
  DaysInputContainer,
  DaysInput,
  DueDateButton,
  CustomDaysButton,
  DaysSpinnerButton,
  DaysSpinnerContainer,
  DaysInputField,
  InputSectionHeading,
  TodoActions,
} from './TodoStyles';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const formatDueDate = (dueDate: Date): string => {
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays > 7 && diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
  if (diffDays > 30 && diffDays <= 365) return `In ${Math.ceil(diffDays / 30)} months`;
  
  return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => todoService.getTodos());
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [daysInput, setDaysInput] = useState<number>(1);
  const [selectedDueDateOption, setSelectedDueDateOption] = useState<string>('today');

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.trim() !== '') {
      addTodo();
    }
  };

  const addTodo = () => {
    if (inputText.trim() !== '') {
      setTodos(todoService.addTodo(todos, inputText, priority, dueDate));
      setInputText('');
      handleDateButtonClick(selectedDueDateOption);
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

  const handleDateButtonClick = (option: string) => {
    let newDate: Date | null = null;
    const today = new Date();

    switch (option) {
      case 'today':
        newDate = today;
        break;
      case 'tomorrow':
        newDate = new Date(today);
        newDate.setDate(today.getDate() + 1);
        break;
      case 'friday':
        newDate = new Date(today);
        newDate.setDate(today.getDate() + ((5 + 7 - today.getDay()) % 7));
        break;
      case 'custom':
        newDate = new Date(today);
        newDate.setDate(today.getDate() + daysInput);
        break;
      case 'picker':
        // Do nothing here, as the date will be set by the DatePicker component
        return;
    }

    if (newDate) {
      newDate.setHours(23, 59, 59, 999);
    }

    setDueDate(newDate);
    setSelectedDueDateOption(option);
  };

  const getDaysUntilDue = (dueDate: Date): number => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <TodoContainer id="todo-container">
      <CompactModeToggle id="compact-mode-toggle" onClick={() => setIsCompactMode(!isCompactMode)}>
        {isCompactMode ? 'Normal Mode' : 'Compact Mode'}
      </CompactModeToggle>
      <TodoTitle id="todo-title">Tino's Todo List</TodoTitle>
      <TodoInputContainer>
        <InputSectionHeading>Task Details</InputSectionHeading>
        <TodoInput
          id="todo-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleInputKeyPress}
          placeholder="Add a new todo and press Enter"
        />
        <InputSectionHeading>Due Date</InputSectionHeading>
        <DueDateContainer>
          <DueDateButton active={selectedDueDateOption === 'today'} onClick={() => handleDateButtonClick('today')}>
            Today
          </DueDateButton>
          <DueDateButton active={selectedDueDateOption === 'tomorrow'} onClick={() => handleDateButtonClick('tomorrow')}>
            Tomorrow
          </DueDateButton>
          <DueDateButton active={selectedDueDateOption === 'friday'} onClick={() => handleDateButtonClick('friday')}>
            Friday
          </DueDateButton>
          <DaysInputContainer>
            <DaysInput>
              <DaysInputField
                type="number"
                min="1"
                max="365"
                value={daysInput}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(365, parseInt(e.target.value, 10) || 1));
                  setDaysInput(value);
                  if (selectedDueDateOption === 'custom') {
                    handleDateButtonClick('custom');
                  }
                }}
              />
              <DaysSpinnerContainer>
                <DaysSpinnerButton onClick={() => setDaysInput(prev => Math.min(prev + 1, 365))}>
                  ▴
                </DaysSpinnerButton>
                <DaysSpinnerButton onClick={() => setDaysInput(prev => Math.max(prev - 1, 1))}>
                  ▾
                </DaysSpinnerButton>
              </DaysSpinnerContainer>
            </DaysInput>
            <CustomDaysButton active={selectedDueDateOption === 'custom'} onClick={() => handleDateButtonClick('custom')}>
              Days
            </CustomDaysButton>
          </DaysInputContainer>
          <DueDateButton active={selectedDueDateOption === 'picker'} onClick={() => setSelectedDueDateOption('picker')}>
            Pick Date
          </DueDateButton>
        </DueDateContainer>
        {selectedDueDateOption === 'picker' && (
          <DatePicker
            selected={dueDate}
            onChange={(date: Date | null) => {
              if (date) {
                setDueDate(date);
                setSelectedDueDateOption('picker');
              }
            }}
            minDate={new Date()}
            inline
          />
        )}
        <InputSectionHeading>Priority</InputSectionHeading>
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
        <TodoFilterButton id="filter-all" $active={filter === 'all'} onClick={() => setFilter('all')}>All</TodoFilterButton>
        <TodoFilterButton id="filter-active" $active={filter === 'active'} onClick={() => setFilter('active')}>Active</TodoFilterButton>
        <TodoFilterButton id="filter-completed" $active={filter === 'completed'} onClick={() => setFilter('completed')}>Completed</TodoFilterButton>
      </TodoFilterContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(groupedTodos).map(([priority, todos]) => (
          <PriorityGroup key={priority}>
            <PriorityTitle>{priority.charAt(0).toUpperCase() + priority.slice(1)} Priority</PriorityTitle>
            <Droppable droppableId={priority} key={priority}>
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
                            $completed={todo.completed}
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
                          <TodoActions>
                            {todo.dueDate && (
                              <TodoDueDate 
                                $daysUntilDue={getDaysUntilDue(todo.dueDate)}
                                data-tooltip={todo.dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              >
                                {formatDueDate(todo.dueDate)}
                              </TodoDueDate>
                            )}
                            <TodoDeleteButton onClick={() => deleteTodo(todo.id)}>
                              Delete
                            </TodoDeleteButton>
                          </TodoActions>
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