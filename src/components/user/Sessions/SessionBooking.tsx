import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/shadcn-button';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Calendar as CalendarIcon, DollarSign, Tag, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import CustomSelector from '@/components/shared/CustomSelector';
import { useSessionBooking } from '@/hooks/session/useSessionBooking';
import { useBookingForm } from '@/hooks/session/useBookingForm';
import { Controller } from 'react-hook-form';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface TimeSlot {
  time: string;
  value: string;
}

export default function SessionBooking() {
  const {
    selectedDate,
    setSelectedDate,
    selectedTopics,
    control,
    handleSubmit,
    errors,
    selectedDuration,
    sessionCost,
    handleTopicsChange,
    setHourlyRate
  } = useBookingForm();

  const {
    developer,
    isLoadingDeveloper,
    isLoadingSlots,
    isLoadingUnavailableSlots,
    handleBookingSubmit,
    isBooking,
    isSlotBooked,
    isSlotUnavailable,
    generateTimeSlots
  } = useSessionBooking({
    selectedDate,
    selectedTopics,
    sessionCost,
  });

  useEffect(() => {
    if (developer?.developerProfile?.hourlyRate) {
      setHourlyRate(developer.developerProfile.hourlyRate);
    }
  }, [developer]);


  if (isLoadingDeveloper) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading session booking..."
        color="white"
        bgColor="dark"
        fullScreen={true}
      />
    );
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-black/80 space-y-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5 -mx-4 px-4 py-6"
      >
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            Book a Session
          </motion.h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-black to-gray-900/50 border-white/5 shadow-lg shadow-black/40">
          <form onSubmit={handleSubmit(handleBookingSubmit)} className="p-8 space-y-6">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 flex items-center gap-2">
                    <ListTodo className="w-4 h-4" />
                    Session Title
                  </label>
                  <Input
                    {...field}
                    placeholder="e.g., Code Review for React Project"
                    className="h-12 rounded-xl backdrop-blur-xl bg-white/5 border-white/10 hover:border-white/20 focus:border-white/30"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Description</label>
                  <Textarea
                    {...field}
                    placeholder="Describe what you'd like to discuss..."
                    className="min-h-[100px] rounded-xl backdrop-blur-xl bg-white/5 border-white/10 hover:border-white/20 focus:border-white/30"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Topics
              </label>
              <CustomSelector
                options={developer?.developerProfile?.expertise.map((topic: string) => ({
                  label: topic,
                  value: topic
                })) || []}
                value={selectedTopics}
                onChange={handleTopicsChange}
                placeholder="Select topics for the session"
                isMulti={true}
                error={errors.topics?.message}
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Select Date & Time
                </label>
                <div className="grid gap-6">
                  <div className="p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={{ before: new Date() }}
                      className="rounded-xl w-full"
                      inline={true}
                    />
                  </div>

                  {selectedDate && (
                    <div className="space-y-6">
                      <Controller
                        name="time"
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            <label className="text-sm text-zinc-400 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Available Time Slots
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                              {timeSlots.map((slot: TimeSlot) => {
                                const isBooked = isSlotBooked(slot.value);
                                const isUnavailable = isSlotUnavailable(slot.value);
                                const isSelected = field.value === slot.value;

                                const isToday =
                                  selectedDate &&
                                  new Date(selectedDate).toDateString() === new Date().toDateString();

                                let isPast = false;
                                if (isToday) {
                                  const [slotHour, slotMinute] = slot.value.split(':').map(Number);
                                  const now = new Date();
                                  if (
                                    slotHour < now.getHours() ||
                                    (slotHour === now.getHours() && slotMinute <= now.getMinutes())
                                  ) {
                                    isPast = true;
                                  }
                                }

                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    disabled={isBooked || isUnavailable || isPast}
                                    onClick={() => field.onChange(slot.value)}
                                    className={cn(
                                      'p-3 rounded-xl border backdrop-blur-xl transition-all flex items-center justify-center gap-2',
                                      {
                                        'bg-indigo-500/20 border-indigo-500/40 text-indigo-300': isSelected,
                                        'bg-green-500/10 border-green-500/30 text-green-400': isBooked && !isSelected,
                                        'bg-rose-500/10 border-rose-500/30 text-rose-400': isUnavailable && !isBooked && !isSelected,
                                        'bg-white/5 border-white/10 hover:border-white/20 text-zinc-400': !isBooked && !isUnavailable && !isSelected && !isPast,
                                        'bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed': isPast
                                      }
                                    )}
                                  >
                                    <span className="text-sm">{slot.time}</span>
                                  </button>
                                );
                              })}
                            </div>
                            {(isLoadingSlots || isLoadingUnavailableSlots) && (
                              <p className="text-sm text-zinc-400">Loading available slots...</p>
                            )}
                            {errors.time && (
                              <p className="text-sm text-red-500">{errors.time.message}</p>
                            )}
                          </div>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 space-y-1">
                          <div className="text-sm text-gray-400">Duration</div>
                          <Controller
                            name="duration"
                            control={control}
                            render={({ field }) => (
                              <div className="grid grid-cols-2 gap-2 ">
                                {[
                                  { value: 30, label: '30m' },
                                  { value: 60, label: '1h' },
                                  { value: 90, label: '1.5h' },
                                  { value: 120, label: '2h' }
                                ].map((duration) => (
                                  <button
                                    key={duration.value}
                                    type="button"
                                    onClick={() => field.onChange(duration.value)}
                                    className={cn(
                                      'p-2 rounded-xl border text-sm backdrop-blur-xl transition-all',
                                      field.value === duration.value
                                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                        : 'bg-white/5 border-white/10 hover:border-white/20 text-zinc-400'
                                    )}
                                  >
                                    {duration.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          />
                        </div>

                        <div className="p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 space-y-1">
                          <div className="text-sm text-gray-400">Total Cost</div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-indigo-400" />
                            <div className="text-2xl font-bold text-white">{sessionCost}</div>
                          </div>
                          <div className="text-sm text-gray-400">{selectedDuration} minutes</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 text-white border-none shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:scale-[1.02]"
              disabled={isBooking || selectedTopics.length === 0}
            >
              {isBooking ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  <span>Sending Request...</span>
                </div>
              ) : (
                'Book Session'
              )}
            </Button>
          </form>
          
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
        </div>
      </motion.div>
    </div>
  );
}