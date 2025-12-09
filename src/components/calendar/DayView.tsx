import { Appointment } from '@/types';
import { teamMembers } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface DayViewProps {
  appointments: Appointment[];
  selectedDate: Date;
}

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

export function DayView({ appointments, selectedDate }: DayViewProps) {
  const getAppointmentStyle = (appointment: Appointment) => {
    const startHour = parseInt(appointment.startTime.split(':')[0]);
    const startMinute = parseInt(appointment.startTime.split(':')[1]);
    const top = ((startHour - 8) * 60 + startMinute) * (80 / 60);
    const height = appointment.duration * (80 / 60);
    
    const teamMember = teamMembers.find(t => t.id === appointment.teamMemberId);
    
    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: `${teamMember?.color}20`,
      borderLeftColor: teamMember?.color,
    };
  };

  const dayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Time Grid */}
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="flex border-b border-border last:border-b-0">
            <div className="w-20 shrink-0 py-5 px-3 text-right text-sm text-muted-foreground border-r border-border">
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
            <div className="flex-1 h-20 relative bg-secondary/20 hover:bg-secondary/40 transition-colors" />
          </div>
        ))}

        {/* Appointments Overlay */}
        <div className="absolute inset-0 left-20 pointer-events-none">
          {dayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={cn(
                "absolute left-2 right-2 rounded-lg border-l-4 p-3 pointer-events-auto cursor-pointer",
                "hover:shadow-medium transition-shadow duration-200"
              )}
              style={getAppointmentStyle(appointment)}
            >
              <p className="font-medium text-sm text-foreground truncate">
                {appointment.clientName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {appointment.serviceName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {appointment.startTime} - {appointment.endTime}
              </p>
            </div>
          ))}
        </div>

        {/* Current Time Indicator */}
        <CurrentTimeIndicator />
      </div>
    </div>
  );
}

function CurrentTimeIndicator() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  if (hour < 8 || hour >= 20) return null;
  
  const top = ((hour - 8) * 60 + minute) * (80 / 60);
  
  return (
    <div
      className="absolute left-0 right-0 flex items-center z-10 pointer-events-none"
      style={{ top: `${top}px` }}
    >
      <div className="w-20 flex justify-end pr-2">
        <div className="w-3 h-3 rounded-full bg-destructive" />
      </div>
      <div className="flex-1 h-0.5 bg-destructive" />
    </div>
  );
}
