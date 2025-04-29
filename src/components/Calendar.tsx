'use client';

import { useState } from 'react';

type CalendarProps = {
  completedDates: string[]; // Dates in "YYYY-MM-DD" format
};

export function Calendar({ completedDates }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // number of days in month

    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null); // empty slots before 1st
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
  };

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;

  const days = getMonthDays(currentMonth);

  return (
    <div className="bg-zinc-800 p-4 rounded-lg text-white">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="text-green-400 hover:underline">&lt; Prev</button>
        <h2 className="text-lg font-bold">
          {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="text-green-400 hover:underline">Next &gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="font-bold text-zinc-400">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((date, idx) => (
          <div key={idx} className="w-8 h-8 flex items-center justify-center">
            {date ? (
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  completedDates.includes(formatDate(date))
                    ? 'bg-green-400 text-zinc-900 font-bold'
                    : 'bg-zinc-700 text-white'
                }`}
              >
                {date.getDate()}
              </div>
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}