import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/shadcn-button';
import { Clock, Calendar as CalendarIcon, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAvailabilityManagement } from '@/hooks/slot/useAvailabilityManagement';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/Label';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface TimeSlot {
  time: string;
  value: string;
  available: boolean;
  booked: boolean;
}

export default function AvailabilityManagement() {
  const {
    selectedDate,
    setSelectedDate,
    isLoading,
    toggleSlotAvailability,
    saveUnavailableSlots,
    toggleAllSlots,
    getAllTimeSlots
  } = useAvailabilityManagement();

  const timeSlots = getAllTimeSlots();
  const availableCount = timeSlots.filter(slot => slot.available && !slot.booked).length;
  const totalNonBookedSlots = timeSlots.filter(slot => !slot.booked).length;

  if (isLoading && !selectedDate) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full -z-10" />
          <LoadingSpinner
            text='Loading slot availability...'
            bgColor='dark'
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col px-4 sm:px-6 py-6 lg:py-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-black/80 border-b border-white/5 px-4 py-3 mb-4 rounded-t-xl"
      >
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
        >
          Manage Availability
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 w-full"
      >
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-black to-gray-900/50 border-white/5 shadow-lg shadow-black/40">
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Select Date to Manage Availability
                </label>
                <div className="grid gap-6">
                  <div className="p-3 sm:p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
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
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Manage Time Slots Availability
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="toggle-all" 
                              checked={availableCount === totalNonBookedSlots}
                              onCheckedChange={(checked) => toggleAllSlots(checked)}
                            />
                            <Label htmlFor="toggle-all" className="text-sm text-zinc-400">
                              {availableCount === totalNonBookedSlots ? 'All Available' : 'Make All Available'}
                            </Label>
                          </div>
                        </div>
                      </div>

                      {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                          <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {timeSlots.map((slot: TimeSlot) => {
                            return (
                              <button
                                key={slot.value}
                                type="button"
                                disabled={slot.booked}
                                onClick={() => toggleSlotAvailability(slot.value)}
                                className={cn(
                                  'p-3 rounded-xl border backdrop-blur-xl transition-all flex items-center justify-center gap-2',
                                  {
                                    'bg-green-500/20 border-green-500/40 text-green-300': slot.available && !slot.booked,
                                    'bg-rose-500/10 border-rose-500/30 text-rose-400 cursor-not-allowed': slot.booked,
                                    'bg-gray-500/20 border-gray-500/40 text-gray-300': !slot.available && !slot.booked
                                  }
                                )}
                              >
                                <span className="text-sm">{slot.time}</span>
                                {slot.booked ? (
                                  <span className="text-xs bg-rose-500/20 px-1.5 py-0.5 rounded-full">Booked</span>
                                ) : slot.available ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <X className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                        <div className="text-sm text-zinc-400">
                          {availableCount} of {timeSlots.length} slots available
                        </div>
                        <Button
                          onClick={saveUnavailableSlots}
                          className="w-full sm:w-auto rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 text-white border-none shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:scale-[1.02]"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Saving...</span>
                            </div>
                          ) : (
                            'Save Availability'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
        </div>
      </motion.div>
    </div>
  );
}
