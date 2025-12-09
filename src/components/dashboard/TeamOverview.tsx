import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { teamMembers, appointments } from '@/data/mockData';
import { Users, Calendar } from 'lucide-react';
import { isToday } from 'date-fns';

export function TeamOverview() {
  const getTeamMemberAppointmentsToday = (memberId: string) => {
    return appointments.filter(
      apt => apt.teamMemberId === memberId && 
      isToday(new Date(apt.date)) && 
      apt.status !== 'cancelled'
    ).length;
  };

  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '300ms' }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Team Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.map((member) => {
          const appointmentsToday = getTeamMemberAppointmentsToday(member.id);
          
          return (
            <div 
              key={member.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-200"
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-background shadow-soft">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback 
                    className="font-medium"
                    style={{ backgroundColor: `${member.color}20`, color: member.color }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background"
                  style={{ backgroundColor: member.color }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {member.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {member.role}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Calendar className="w-4 h-4" />
                <span>{appointmentsToday} today</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
