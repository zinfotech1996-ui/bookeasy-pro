import { Appointment } from '@/types';
import { teamMembers } from '@/data/mockData';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameDay, 
  isToday,
  isSameMonth 
} from 'date-fns';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  appointments: Appointment[];
  selectedDate: Date;
}

export function MonthView({ appointments, selectedDate }: MonthViewProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), date)).slice(0, 3);
  };

  const getAppointmentCount = (date: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), date)).length;
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-border">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
          <div
            key={dayName}
            className="py-3 text-center text-xs font-medium text-muted-foreground uppercase"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="divide-y divide-border">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 divide-x divide-border">
            {week.map((day) => {
              const dayAppointments = getAppointmentsForDay(day);
              const totalCount = getAppointmentCount(day);
              const isCurrentMonth = isSameMonth(day, selectedDate);
              
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[120px] p-2 transition-colors hover:bg-secondary/50",
                    !isCurrentMonth && "bg-muted/30",
                    isToday(day) && "bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full mb-2 text-sm font-medium",
                    isToday(day) && "bg-primary text-primary-foreground",
                    !isToday(day) && isCurrentMonth && "text-foreground",
                    !isCurrentMonth && "text-muted-foreground"
                  )}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.map((appointment) => {
                      const teamMember = teamMembers.find(t => t.id === appointment.teamMemberId);
                      return (
                        <div
                          key={appointment.id}
                          className="text-xs p-1.5 rounded truncate cursor-pointer hover:shadow-soft transition-shadow"
                          style={{
                            backgroundColor: `${teamMember?.color}20`,
                            color: teamMember?.color,
                          }}
                        >
                          <span className="font-medium">{appointment.startTime}</span>
                          <span className="ml-1 opacity-80">{appointment.clientName}</span>
                        </div>
                      );
                    })}
                    {totalCount > 3 && (
                      <div className="text-xs text-muted-foreground text-center py-1">
                        +{totalCount - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
