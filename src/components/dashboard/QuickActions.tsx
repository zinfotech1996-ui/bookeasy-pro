import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  UserPlus, 
  Calendar, 
  Link, 
  Zap 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'New Appointment',
      icon: Plus,
      onClick: () => navigate('/appointments'),
      variant: 'hero' as const,
    },
    {
      label: 'Add Client',
      icon: UserPlus,
      onClick: () => navigate('/clients'),
      variant: 'secondary' as const,
    },
    {
      label: 'View Calendar',
      icon: Calendar,
      onClick: () => navigate('/calendar'),
      variant: 'secondary' as const,
    },
    {
      label: 'Booking Link',
      icon: Link,
      onClick: () => navigate('/book'),
      variant: 'secondary' as const,
    },
  ];

  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto py-4 flex-col gap-2"
              onClick={action.onClick}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
