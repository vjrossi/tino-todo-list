import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DueDateContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const DueDateButton = styled.button<{ active: boolean }>`
  padding: 5px 10px;
  margin-right: 5px;
  border: 1px solid #ccc;
  background-color: ${props => props.active ? '#4CAF50' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    background-color: ${props => props.active ? '#45a049' : '#f0f0f0'};
  }
`;

interface DueDateSelectorProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const DueDateSelector: React.FC<DueDateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateButtonClick = (days: number | string) => {
    let newDate: Date | null = null;

    if (days === 'today') {
      newDate = new Date();
    } else if (days === 'tomorrow') {
      newDate = new Date();
      newDate.setDate(newDate.getDate() + 1);
    } else if (days === 'friday') {
      newDate = new Date();
      newDate.setDate(newDate.getDate() + ((5 + 7 - newDate.getDay()) % 7));
    } else if (days === 'custom') {
      setShowDatePicker(true);
      return;
    }

    if (newDate) {
      newDate.setHours(23, 59, 59, 999);
    }

    onDateChange(newDate);
    setShowDatePicker(false);
  };

  const handleDatePickerChange = (date: Date | null) => {
    if (date) {
      date.setHours(23, 59, 59, 999);
    }
    onDateChange(date);
    setShowDatePicker(false);
  };

  const isActive = (days: number | string) => {
    if (!selectedDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);

    if (days === 'today') return selectedDay.getTime() === today.getTime();
    if (days === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return selectedDay.getTime() === tomorrow.getTime();
    }
    if (days === 'friday') {
      const friday = new Date(today);
      friday.setDate(friday.getDate() + ((5 + 7 - friday.getDay()) % 7));
      return selectedDay.getTime() === friday.getTime();
    }
    return false;
  };

  return (
    <DueDateContainer>
      <DueDateButton active={isActive('today')} onClick={() => handleDateButtonClick('today')}>
        Today
      </DueDateButton>
      <DueDateButton active={isActive('tomorrow')} onClick={() => handleDateButtonClick('tomorrow')}>
        Tomorrow
      </DueDateButton>
      <DueDateButton active={isActive('friday')} onClick={() => handleDateButtonClick('friday')}>
        Friday
      </DueDateButton>
      <DueDateButton active={false} onClick={() => handleDateButtonClick('custom')}>
        In x days
      </DueDateButton>
      {showDatePicker && (
        <DatePicker
          selected={selectedDate}
          onChange={handleDatePickerChange}
          dateFormat="MMMM d, yyyy"
          minDate={new Date()}
          inline
        />
      )}
    </DueDateContainer>
  );
};

export default DueDateSelector;