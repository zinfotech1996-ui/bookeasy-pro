import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewAppointment?: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onNewAppointment,
}: CalendarHeaderProps) {
  const getTitle = () => {
    switch (view) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        return format(currentDate, 'MMMM yyyy');
      case 'month':
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onPrevious}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="secondary" size="sm" onClick={onToday}>
          Today
        </Button>
        <h2 className="text-xl font-display font-semibold text-foreground">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['day', 'week', 'month'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                view === v
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        {onNewAppointment && (
          <Button variant="hero" onClick={onNewAppointment}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Appointment</span>
          </Button>
        )}
      </div>
    </div>
  );
}
