import styled from 'styled-components';
import { PriorityType } from '../types/todoItem';

const getColorForPriority = (priority: PriorityType): string => {
  switch (priority) {
    case 'high':
      return '#ff4d4d';
    case 'medium':
      return '#ffa64d';
    case 'low':
      return '#4da6ff';
    default:
      return 'black';
  }
};

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
  flex-grow: 1;
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

export const TodoFilterButton = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  font-size: 16px;
  background-color: ${props => props.$active ? '#4CAF50' : '#f1f1f1'};
  color: ${props => props.$active ? 'white' : 'black'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    background-color: ${props => props.$active ? '#45a049' : '#ddd'};
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

  /* Add these new styles */
  justify-content: space-between;
`;

export const TodoCheckbox = styled.input`
  margin-right: 15px;
  transform: scale(1.2);
`;

export const TodoText = styled.span<{ $completed: boolean; priority: PriorityType }>`
  flex-grow: 1;
  text-align: left;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  color: ${props => props.$completed ? '#888' : getColorForPriority(props.priority)};
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
  flex: 1;
  text-align: center;

  input[type="radio"] {
    display: none;
  }

  label {
    display: block;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  input[type="radio"]:checked + label {
    background-color: #4CAF50;
    color: white;
  }

  &:hover label {
    background-color: #e0e0e0;
  }
`;

export const TodoDueDate = styled.span<{ $daysUntilDue: number }>`
  font-size: 12px;
  color: #fff;
  background-color: ${props => 
    props.$daysUntilDue === 0 ? '#e74c3c' :
    props.$daysUntilDue === 1 ? '#f39c12' :
    props.$daysUntilDue <= 7 ? '#3498db' :
    '#2ecc71'
  };
  padding: 3px 8px;
  border-radius: 12px;
  margin-left: 10px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

export const DaysInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

export const DaysInput = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
   height: 32px;
`;

export const DaysInputField = styled.input`
  width: 30px;
  border: none;
  text-align: center;
  font-size: 14px;
  padding: 0;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const DaysSpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const DaysSpinnerButton = styled.button`
  width: 18px;
  height: 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #aaa;
  padding: 0;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: #666;
    background-color: #f0f0f0;
  }

  &:active {
    color: #333;
    background-color: #e0e0e0;
  }
`;

export const DaysLabel = styled.span`
  font-size: 14px;
`;

export const DueDateContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const DueDateButton = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  margin-right: 10px;
  border: 1px solid #ccc;
  background-color: ${props => props.active ? '#4CAF50' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#45a049' : '#f0f0f0'};
  }
`;
export const CustomDaysButton = styled(DueDateButton)`
  border-radius: 0 4px 4px 0;
  margin-right: 0;
  margin-left: -1px;
`;

export const DatePickerContainer = styled.div`
  margin-top: 10px;
`;

export const InputSectionHeading = styled.h3`
  font-size: 16px;
  color: #333;
  margin-top: 15px;
  margin-bottom: 10px;
`;

export const TodoActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
