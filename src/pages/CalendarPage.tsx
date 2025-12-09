import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { DayView } from '@/components/calendar/DayView';
import { WeekView } from '@/components/calendar/WeekView';
import { MonthView } from '@/components/calendar/MonthView';
import { appointments } from '@/data/mockData';
import { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';

type ViewType = 'day' | 'week' | 'month';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');

  const handlePrevious = () => {
    switch (view) {
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          onNewAppointment={() => {}}
        />

        <div className="animate-fade-in">
          {view === 'day' && (
            <DayView appointments={appointments} selectedDate={currentDate} />
          )}
          {view === 'week' && (
            <WeekView appointments={appointments} selectedDate={currentDate} />
          )}
          {view === 'month' && (
            <MonthView appointments={appointments} selectedDate={currentDate} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
