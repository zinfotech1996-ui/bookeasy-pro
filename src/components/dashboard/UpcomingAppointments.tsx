import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { appointments, clients, teamMembers } from '@/data/mockData';
import { format, isToday, isTomorrow } from 'date-fns';
import { Clock, User } from 'lucide-react';

export function UpcomingAppointments() {
  const upcomingAppointments = appointments
    .filter(apt => apt.status !== 'cancelled' && apt.status !== 'completed')
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime();
      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, 5);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  const getClient = (clientId: string) => clients.find(c => c.id === clientId);
  const getTeamMember = (teamMemberId: string) => teamMembers.find(t => t.id === teamMemberId);

  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingAppointments.map((appointment) => {
          const client = getClient(appointment.clientId);
          const teamMember = getTeamMember(appointment.teamMemberId);
          
          return (
            <div 
              key={appointment.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-200"
            >
              <Avatar className="h-12 w-12 border-2 border-background shadow-soft">
                <AvatarImage src={client?.avatar} alt={appointment.clientName} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {appointment.clientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-foreground truncate">
                    {appointment.clientName}
                  </p>
                  <Badge 
                    variant={appointment.status as 'confirmed' | 'pending'}
                    className="text-xs"
                  >
                    {appointment.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {appointment.serviceName}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{teamMember?.name}</span>
                </div>
              </div>
              
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-foreground">
                  {appointment.startTime}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getDateLabel(new Date(appointment.date))}
                </p>
              </div>
            </div>
          );
        })}
        
        {upcomingAppointments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No upcoming appointments
          </div>
        )}
      </CardContent>
    </Card>
  );
}
