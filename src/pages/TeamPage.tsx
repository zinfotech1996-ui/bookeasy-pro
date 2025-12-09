import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { teamMembers, services, appointments } from '@/data/mockData';
import { 
  Plus, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  MoreVertical
} from 'lucide-react';
import { isToday, isThisWeek } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TeamPage() {
  const getTeamMemberServices = (memberId: string) => {
    return services.filter(s => s.teamMemberIds.includes(memberId));
  };

  const getTeamMemberStats = (memberId: string) => {
    const memberAppointments = appointments.filter(apt => apt.teamMemberId === memberId);
    const todayCount = memberAppointments.filter(apt => isToday(new Date(apt.date))).length;
    const weekCount = memberAppointments.filter(apt => isThisWeek(new Date(apt.date))).length;
    return { todayCount, weekCount };
  };

  const formatWorkingHours = (hours: { start: string; end: string } | null) => {
    if (!hours) return 'Off';
    return `${hours.start} - ${hours.end}`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Team
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their schedules
            </p>
          </div>
          <Button variant="hero">
            <Plus className="w-4 h-4" />
            Add Team Member
          </Button>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => {
            const memberServices = getTeamMemberServices(member.id);
            const stats = getTeamMemberStats(member.id);
            
            return (
              <Card 
                key={member.id} 
                variant="elevated"
                className="overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header with color */}
                <div 
                  className="h-2"
                  style={{ backgroundColor: member.color }}
                />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-medium">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback 
                            className="font-semibold text-lg"
                            style={{ backgroundColor: `${member.color}20`, color: member.color }}
                          >
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div 
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background"
                          style={{ backgroundColor: member.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem>Manage Services</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-lg font-semibold text-foreground">{stats.todayCount}</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-lg font-semibold text-foreground">{stats.weekCount}</p>
                        <p className="text-xs text-muted-foreground">This Week</p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {memberServices.map((service) => (
                        <Badge key={service.id} variant="secondary" className="text-xs">
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Working Hours Preview */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Working Hours
                    </p>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                        const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                        const hours = member.workingHours[dayNames[i]];
                        return (
                          <div
                            key={i}
                            className={`py-2 rounded text-xs font-medium ${
                              hours 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
