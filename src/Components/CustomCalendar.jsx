import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSwipeable } from 'react-swipeable';

const CustomCalendar = ({ selectedDate: initialSelectedDate, handleDateChange, isSelectable, dayStatus }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(new Date().getMinutes());
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);

  const [touchStartX, setTouchStartX] = useState(null);

  const monthDate = new Date(currentYear, currentMonth, 1);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (currentMonth > new Date().getMonth()) {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < new Date().getMonth() + 2) {
      setCurrentMonth(prev => prev + 1);
    }
  };


  let initialSwipeDirection = null;
  let initialDeltaX = null;

  const hourHandlers = useSwipeable({
    onSwiping: (eventData) => {
      let { dir, deltaX } = eventData;
      if (!initialSwipeDirection) {
        initialSwipeDirection = dir;
        initialDeltaX = deltaX;
      }
      const distance = Math.round((deltaX - initialDeltaX) / 30);
      if (dir === 'Left') {
        setSelectedHour(oldHour => Math.max(oldHour - (distance > 0 ? distance : distance * -1), 0));
      } else if (dir === 'Right') {
        setSelectedHour(oldHour => Math.min(oldHour + distance, 23));
      }
    },
    onSwiped: () => {
      initialSwipeDirection = null;
      initialDeltaX = null;
    },
  });

  initialSwipeDirection = null;
  initialDeltaX = null;

  const minuteHandlers = useSwipeable({
    onSwiping: (eventData) => {
      let { dir, deltaX } = eventData;
      if (!initialSwipeDirection) {
        initialSwipeDirection = dir;
        initialDeltaX = deltaX;
      }
      const distance = Math.round(Math.abs(deltaX - initialDeltaX) / 30);
      if (dir === 'Left') {
        setSelectedMinute(oldMinute => Math.max(oldMinute - distance, 0));
      } else if (dir === 'Right') {
        setSelectedMinute(oldMinute => Math.min(oldMinute + distance, 59));
      }
    },
    onSwiped: () => {
      initialSwipeDirection = null;
      initialDeltaX = null;
    },
  });

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };


  const handleTouchMove = (e) => {
    if (!touchStartX) {
      return;
    }

    const touchEndX = e.touches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 100) { // swipe distance threshold
      if (diffX > 0) {
        handleNextMonth();
      } else {
        handlePrevMonth();
      }

      setTouchStartX(null); // reset touch start X position
    }
  };


  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
  const daysInPrevMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 0).getDate();
  const days = [...Array(daysInMonth).keys()].map(i => i + 1);
  const prevMonthDays = [...Array(startDay).keys()].map(i => daysInPrevMonth - i).reverse();
  const nextMonthDays = [...Array(42 - days.length - prevMonthDays.length).keys()].map(i => i + 1);

  const hours = [...Array(24).keys()].map(i => i.toString().padStart(2, '0'));
  const minutes = [...Array(60).keys()].map(i => i.toString().padStart(2, '0'));

  return (
    <div
      className="flex flex-col items-center bg-white rounded-lg shadow p-4 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold text-green-500">{new Date(new Date().getFullYear(), currentMonth).toLocaleString('default', { month: 'long' })}</h1>
      <div className="flex items-center justify-between mb-2">
        <button onClick={handlePrevMonth} disabled={currentMonth === new Date().getMonth()}>
          <FiChevronLeft className="mr-2 w-10 h-10 text-green-500" />
        </button>
        <div className="flex flex-col items-center mt-2 w-full">
          <h2 className="text-md font-bold py-2">{daysOfWeek[selectedDate.getDay()]} {selectedDate.getDate()} {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</h2>
          <div className="flex items-center justify-around">
            <input {...hourHandlers} type="number" min="0" max="23" value={selectedHour} onChange={e => setSelectedHour(Math.min(e.target.value, 23))} className="border flex-shrink rounded px-3 py-2 mr-2 border-none text-md font-bold flex-grow outline-none focus:text-green-500 text-right" />
            <span className="flex-grow">:</span>
            <input {...minuteHandlers} type="number" min="0" max="59" value={selectedMinute} onChange={e => setSelectedMinute(Math.min(e.target.value, 59))} className="border rounded px-3 py-2 ml-2 border-none text-md font-bold flex-grow outline-none focus:text-green-500" />
          </div>
        </div>
        <button onClick={handleNextMonth} disabled={currentMonth === new Date().getMonth() + 2}>
          <FiChevronRight className="ml-2 w-10 h-10 text-green-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}>
        {daysOfWeek.map((day, index) => (
          <div key={index} className="font-bold text-center">{day}</div>
        ))}
        {prevMonthDays.map(day => (
          <button key={day} className="w-10 h-10 bg-transparent text-gray-500 text-center" disabled>{day}</button>
        ))}
        {days.map(day => {
          const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
          const status = dayStatus(date);
          let colorClass;
          switch (status) {
            case 'available':
              colorClass = 'text-green-500'; // green for available
              break;
            case 'full':
              colorClass = 'text-red-500'; // red for full
              break;
            default:
              colorClass = 'text-gray-500'; // gray for unavailable
          }
          return (
            <button
              key={day}
              onClick={() => {
                setSelectedDate(date);
                handleDateChange(date);
              }}
              disabled={!isSelectable(day)}
              className={`w-10 h-10 rounded-3xl bg-transparent ${colorClass} font-bold text-center ${day === selectedDate.getDate() && monthDate.getMonth() === selectedDate.getMonth() && monthDate.getFullYear() === selectedDate.getFullYear() ? 'bg-green-700 text-white' :
                  day === new Date().getDate() && monthDate.getMonth() === new Date().getMonth() && monthDate.getFullYear() === new Date().getFullYear() ? 'bg-green-300 text-white' : ''
                }`}
            >
              {day}
            </button>
          );
        })}
        {nextMonthDays.map(day => (
          <button key={day} className="w-10 h-10 bg-transparent text-gray-500 text-center" disabled>{day}</button>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;