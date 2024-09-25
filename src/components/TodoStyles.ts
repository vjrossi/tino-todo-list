import styled from 'styled-components';
import { PriorityType } from '../types/todoItem';

export const TodoContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

export const TodoTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

export const TodoInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TodoInput = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
`;

export const TodoSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

export const TodoButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export const TodoFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const TodoFilterButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  font-size: 16px;
  background-color: ${props => props.active ? '#4CAF50' : '#f1f1f1'};
  color: ${props => props.active ? 'white' : 'black'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    background-color: ${props => props.active ? '#45a049' : '#ddd'};
  }
`;

export const TodoList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const TodoListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:first-child {
    border-top: 1px solid #e0e0e0;
  }
`;

export const TodoCheckbox = styled.input`
  margin-right: 15px;
  transform: scale(1.2);
`;

export const TodoText = styled.span<{ completed: boolean; priority: PriorityType }>`
  flex-grow: 1;
  margin-right: 15px;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#888' : 
    props.priority === 'high' ? 'red' :
    props.priority === 'medium' ? 'orange' : 'green'};
  cursor: pointer;
`;

export const TodoDeleteButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

export const TodoSummary = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 16px;
  color: #666;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const PriorityGroup = styled.div`
  margin-bottom: 20px;
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const PriorityTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

export const CompactModeToggle = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  font-size: 14px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export const TodoContainerCompact = styled(TodoContainer)`
  padding: 10px;
`;

export const TodoListItemCompact = styled(TodoListItem)`
  padding: 5px;
  margin-bottom: 14px;
`;

export const TodoTextCompact = styled(TodoText)`
  font-size: 14px;
`;

export const TodoSelectCompact = styled(TodoSelect)`
  padding: 2px 5px;
  font-size: 12px;
`;

export const TodoDeleteButtonCompact = styled(TodoDeleteButton)`
  padding: 2px 5px;
  font-size: 12px;
`;

export const PrioritySelector = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 5px;
`;

export const PriorityOption = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  input[type="radio"] {
    display: none;
  }

  label {
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 3px;
    font-size: 14px;
    transition: all 0.3s ease;
    text-align: center;
    width: 100%;
  }

  input[type="radio"]:checked + label {
    background-color: #4CAF50;
    color: white;
  }

  &:hover label {
    background-color: #e0e0e0;
  }
`;

export const TodoDueDate = styled.span`
  font-size: 12px;
  color: #888;
  margin-left: 10px;
`;

export const DueDateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const DueDateButton = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? '#4CAF50' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  border-radius: 4px;
  flex: 1;
  margin: 0 5px;
  transition: all 0.3s ease;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: ${props => props.active ? '#45a049' : '#f0f0f0'};
  }
`;
