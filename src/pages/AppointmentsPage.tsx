import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { appointments, clients, teamMembers } from '@/data/mockData';
import { 
  Plus, 
  Clock, 
  Calendar,
  DollarSign,
  MoreVertical,
  Filter
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Appointment } from '@/types';

type StatusFilter = 'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled';

export default function AppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredAppointments = appointments
    .filter(apt => statusFilter === 'all' || apt.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime();
      return a.startTime.localeCompare(b.startTime);
    });

  const getClient = (clientId: string) => clients.find(c => c.id === clientId);
  const getTeamMember = (teamMemberId: string) => teamMembers.find(t => t.id === teamMemberId);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return format(date, 'MMM d');
    return format(date, 'EEE, MMM d');
  };

  const groupedAppointments = filteredAppointments.reduce((groups, apt) => {
    const dateKey = format(new Date(apt.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(apt);
    return groups;
  }, {} as Record<string, Appointment[]>);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Appointments
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your appointments
            </p>
          </div>
          <Button variant="hero">
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as StatusFilter[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "secondary"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {Object.entries(groupedAppointments).map(([dateKey, dayAppointments]) => (
            <div key={dateKey} className="animate-fade-in">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {getDateLabel(new Date(dateKey))}
                <Badge variant="secondary" className="ml-2">
                  {dayAppointments.length} appointments
                </Badge>
              </h3>
              
              <div className="space-y-3">
                {dayAppointments.map((appointment, index) => {
                  const client = getClient(appointment.clientId);
                  const teamMember = getTeamMember(appointment.teamMemberId);
                  
                  return (
                    <Card 
                      key={appointment.id} 
                      variant="interactive"
                      className="p-4 animate-slide-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Time Column */}
                        <div className="shrink-0 text-center w-16">
                          <p className="text-lg font-semibold text-foreground">
                            {appointment.startTime}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.duration} min
                          </p>
                        </div>

                        {/* Color Bar */}
                        <div 
                          className="w-1 h-16 rounded-full shrink-0"
                          style={{ backgroundColor: teamMember?.color }}
                        />

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <Avatar className="h-10 w-10 border border-background shadow-soft">
                              <AvatarImage src={client?.avatar} alt={appointment.clientName} />
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {appointment.clientName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {appointment.clientName}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {appointment.serviceName}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Team Member */}
                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                          <Avatar className="h-8 w-8 border border-background">
                            <AvatarImage src={teamMember?.avatar} alt={teamMember?.name} />
                            <AvatarFallback 
                              className="text-xs"
                              style={{ backgroundColor: `${teamMember?.color}20`, color: teamMember?.color }}
                            >
                              {teamMember?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground hidden md:inline">
                            {teamMember?.name}
                          </span>
                        </div>

                        {/* Status & Price */}
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge variant={appointment.status as any}>
                            {appointment.status}
                          </Badge>
                          <span className="text-sm font-medium text-foreground hidden sm:inline">
                            ${appointment.price}
                          </span>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No appointments found</p>
            <p className="text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
