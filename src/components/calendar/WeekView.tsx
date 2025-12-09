import { Appointment } from '@/types';
import { teamMembers } from '@/data/mockData';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  appointments: Appointment[];
  selectedDate: Date;
}

const hours = Array.from({ length: 12 }, (_, i) => i + 8);

export function WeekView({ appointments, selectedDate }: WeekViewProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentStyle = (appointment: Appointment) => {
    const startHour = parseInt(appointment.startTime.split(':')[0]);
    const startMinute = parseInt(appointment.startTime.split(':')[1]);
    const top = ((startHour - 8) * 60 + startMinute) * (60 / 60);
    const height = appointment.duration * (60 / 60);
    
    const teamMember = teamMembers.find(t => t.id === appointment.teamMemberId);
    
    return {
      top: `${top}px`,
      height: `${Math.max(height, 24)}px`,
      backgroundColor: `${teamMember?.color}20`,
      borderLeftColor: teamMember?.color,
    };
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), date));
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-border">
        <div className="w-16 shrink-0" />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "py-4 text-center border-l border-border",
              isToday(day) && "bg-primary/5"
            )}
          >
            <p className="text-xs text-muted-foreground uppercase">
              {format(day, 'EEE')}
            </p>
            <p className={cn(
              "text-xl font-display font-semibold mt-1",
              isToday(day) ? "text-primary" : "text-foreground"
            )}>
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="relative overflow-y-auto max-h-[600px]">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-border last:border-b-0">
            <div className="w-16 shrink-0 py-4 px-2 text-right text-xs text-muted-foreground">
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "h-[60px] relative border-l border-border",
                  isToday(day) && "bg-primary/5"
                )}
              />
            ))}
          </div>
        ))}

        {/* Appointments Overlay */}
        {weekDays.map((day, dayIndex) => (
          <div
            key={day.toISOString()}
            className="absolute inset-y-0 pointer-events-none"
            style={{
              left: `calc(4rem + ${dayIndex * (100 / 7)}% - ${dayIndex * (4 / 7)}rem)`,
              width: `calc(${100 / 7}% - ${4 / 7}rem)`,
            }}
          >
            {getAppointmentsForDay(day).map((appointment) => (
              <div
                key={appointment.id}
                className={cn(
                  "absolute left-0.5 right-0.5 rounded border-l-2 p-1 pointer-events-auto cursor-pointer",
                  "hover:shadow-medium transition-shadow duration-200 overflow-hidden"
                )}
                style={getAppointmentStyle(appointment)}
              >
                <p className="font-medium text-xs text-foreground truncate">
                  {appointment.clientName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {appointment.startTime}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
