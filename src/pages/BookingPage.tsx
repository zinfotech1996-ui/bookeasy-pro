import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { services, teamMembers } from '@/data/mockData';
import { 
  Calendar, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { format, addDays, isSameDay, isToday, startOfWeek, addWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import { Service, TeamMember } from '@/types';

type BookingStep = 'service' | 'staff' | 'datetime' | 'details' | 'confirm';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export default function BookingPage() {
  const [step, setStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<TeamMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const categories = [...new Set(services.map(s => s.category))];
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getStaffForService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return [];
    return teamMembers.filter(t => service.teamMemberIds.includes(t.id));
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedStaff(null);
    setStep('staff');
  };

  const handleStaffSelect = (staff: TeamMember) => {
    setSelectedStaff(staff);
    setStep('datetime');
  };

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedTime) {
      setStep('details');
    }
  };

  const handleSubmit = () => {
    setStep('confirm');
  };

  const goBack = () => {
    switch (step) {
      case 'staff':
        setStep('service');
        break;
      case 'datetime':
        setStep('staff');
        break;
      case 'details':
        setStep('datetime');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
            <Calendar className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-foreground">BookIt Studio</h1>
            <p className="text-sm text-muted-foreground">Book your appointment</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['service', 'staff', 'datetime', 'details'] as BookingStep[]).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === s && "bg-primary text-primary-foreground",
                (['service', 'staff', 'datetime', 'details'] as BookingStep[]).indexOf(step) > i && "bg-success text-success-foreground",
                (['service', 'staff', 'datetime', 'details'] as BookingStep[]).indexOf(step) < i && "bg-muted text-muted-foreground"
              )}>
                {(['service', 'staff', 'datetime', 'details'] as BookingStep[]).indexOf(step) > i ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 3 && (
                <div className={cn(
                  "w-12 h-0.5 mx-1",
                  (['service', 'staff', 'datetime', 'details'] as BookingStep[]).indexOf(step) > i ? "bg-success" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 'service' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Select a Service
            </h2>
            <p className="text-muted-foreground mb-6">
              Choose the service you'd like to book
            </p>

            {categories.map((category) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">{category}</h3>
                <div className="space-y-3">
                  {services.filter(s => s.category === category).map((service) => (
                    <Card
                      key={service.id}
                      variant="interactive"
                      className="p-4 cursor-pointer"
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{service.name}</h4>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold text-foreground">
                            ${service.price}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 'staff' && selectedService && (
          <div className="animate-fade-in">
            <Button variant="ghost" size="sm" onClick={goBack} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Choose Your Stylist
            </h2>
            <p className="text-muted-foreground mb-6">
              Select who you'd like to see for {selectedService.name}
            </p>

            <div className="grid gap-4">
              {getStaffForService(selectedService.id).map((staff) => (
                <Card
                  key={staff.id}
                  variant="interactive"
                  className="p-4 cursor-pointer"
                  onClick={() => handleStaffSelect(staff)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-soft">
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                      <AvatarFallback 
                        style={{ backgroundColor: `${staff.color}20`, color: staff.color }}
                      >
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{staff.name}</h4>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'datetime' && selectedService && selectedStaff && (
          <div className="animate-fade-in">
            <Button variant="ghost" size="sm" onClick={goBack} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Pick a Date & Time
            </h2>
            <p className="text-muted-foreground mb-6">
              When would you like to visit?
            </p>

            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setWeekStart(addWeeks(weekStart, -1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium text-foreground">
                {format(weekStart, 'MMMM yyyy')}
              </span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setWeekStart(addWeeks(weekStart, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {weekDays.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "p-3 rounded-xl text-center transition-all",
                    selectedDate && isSameDay(day, selectedDate)
                      ? "bg-primary text-primary-foreground shadow-medium"
                      : "bg-card border border-border hover:border-primary",
                    isToday(day) && !selectedDate && "border-primary"
                  )}
                >
                  <p className="text-xs text-inherit opacity-70 mb-1">
                    {format(day, 'EEE')}
                  </p>
                  <p className="text-lg font-semibold">
                    {format(day, 'd')}
                  </p>
                </button>
              ))}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <h3 className="font-medium text-foreground mb-3">Available Times</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-3 px-4 rounded-lg text-sm font-medium transition-all",
                        selectedTime === time
                          ? "bg-primary text-primary-foreground shadow-medium"
                          : "bg-card border border-border hover:border-primary"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full mt-6"
                onClick={handleDateTimeSelect}
              >
                Continue
              </Button>
            )}
          </div>
        )}

        {step === 'details' && (
          <div className="animate-fade-in">
            <Button variant="ghost" size="sm" onClick={goBack} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Your Details
            </h2>
            <p className="text-muted-foreground mb-6">
              Please enter your contact information
            </p>

            <Card variant="elevated" className="p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Booking Summary */}
            <Card variant="gradient" className="p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-foreground">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stylist</span>
                  <span className="font-medium text-foreground">{selectedStaff?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && format(selectedDate, 'EEE, MMM d')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">{selectedTime}</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-foreground">${selectedService?.price}</span>
                </div>
              </div>
            </Card>

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handleSubmit}
              disabled={!formData.name || !formData.email || !formData.phone}
            >
              Confirm Booking
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="animate-scale-in text-center py-12">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your appointment has been booked successfully. We've sent a confirmation email to {formData.email}
            </p>

            <Card variant="elevated" className="p-6 max-w-md mx-auto text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-foreground">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">With</span>
                  <span className="font-medium text-foreground">{selectedStaff?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">When</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && format(selectedDate, 'EEE, MMM d')} at {selectedTime}
                  </span>
                </div>
              </div>
            </Card>

            <Button 
              variant="secondary" 
              size="lg" 
              className="mt-8"
              onClick={() => {
                setStep('service');
                setSelectedService(null);
                setSelectedStaff(null);
                setSelectedDate(null);
                setSelectedTime(null);
                setFormData({ name: '', email: '', phone: '', notes: '' });
              }}
            >
              Book Another Appointment
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
