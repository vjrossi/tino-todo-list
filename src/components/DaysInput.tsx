import React, { useState } from 'react';
import styled from 'styled-components';

const DaysInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const DaysInputWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  height: 32px;
`;

const DaysInputField = styled.input`
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

const DaysSpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DaysSpinnerButton = styled.button`
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

const DaysLabel = styled.span`
  font-size: 14px;
  margin-left: 5px;
`;

interface DaysInputProps {
  value: number;
  onChange: (value: number) => void;
  onCustomClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}

export const DaysInput: React.FC<DaysInputProps> = ({ value, onChange, onCustomClick, isActive, children }) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(parseInt(newValue, 10) || 0);
  };

  const handleIncrement = () => {
    const newValue = value + 1;
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(0, value - 1);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  return (
    <DaysInputContainer>
      <DaysInputWrapper>
        <DaysInputField
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          min="0"
        />
        <DaysSpinnerContainer>
          <DaysSpinnerButton onClick={handleIncrement}>▲</DaysSpinnerButton>
          <DaysSpinnerButton onClick={handleDecrement}>▼</DaysSpinnerButton>
        </DaysSpinnerContainer>
      </DaysInputWrapper>
      {React.cloneElement(children as React.ReactElement, { onClick: onCustomClick, active: isActive })}
    </DaysInputContainer>
  );
};