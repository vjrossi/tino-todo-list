import styled from 'styled-components';
import { PriorityType } from '../types/todo';

export const TodoContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

export const TodoTitle = styled.h1`
  text-align: center;
  color: #333;
`;

export const TodoInputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

export const TodoInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const TodoSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 10px;
`;

export const TodoButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

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
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

export const TodoCheckbox = styled.input`
  margin-right: 10px;
`;

export const TodoText = styled.span<{ completed: boolean; priority: PriorityType }>`
  flex-grow: 1;
  margin-right: 10px;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#888' : 
    props.priority === 'high' ? 'red' :
    props.priority === 'medium' ? 'orange' : 'green'};
  cursor: pointer;
`;

export const TodoDeleteButton = styled.button`
  margin-left: 10px;
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
`;
