import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { TeamOverview } from '@/components/dashboard/TeamOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { appointments, clients } from '@/data/mockData';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';

export default function Dashboard() {
  const todayAppointments = appointments.filter(
    apt => isToday(new Date(apt.date)) && apt.status !== 'cancelled'
  ).length;

  const weeklyAppointments = appointments.filter(
    apt => isThisWeek(new Date(apt.date)) && apt.status !== 'cancelled'
  ).length;

  const monthlyRevenue = appointments
    .filter(apt => isThisMonth(new Date(apt.date)) && apt.status === 'completed')
    .reduce((sum, apt) => sum + apt.price, 0);

  const totalClients = clients.length;

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Good morning, Jane
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatsCard
            title="Today's Appointments"
            value={todayAppointments}
            change="+2 from yesterday"
            changeType="positive"
            icon={<Calendar className="w-6 h-6" />}
            delay={0}
          />
          <StatsCard
            title="This Week"
            value={weeklyAppointments}
            change="+15% vs last week"
            changeType="positive"
            icon={<TrendingUp className="w-6 h-6" />}
            delay={50}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`$${monthlyRevenue.toLocaleString()}`}
            change="+8% vs last month"
            changeType="positive"
            icon={<DollarSign className="w-6 h-6" />}
            delay={100}
          />
          <StatsCard
            title="Total Clients"
            value={totalClients}
            change="+3 new this week"
            changeType="positive"
            icon={<Users className="w-6 h-6" />}
            delay={150}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UpcomingAppointments />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <TeamOverview />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
