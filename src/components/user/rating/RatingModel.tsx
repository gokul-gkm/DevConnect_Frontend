'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/shadcn-button'
import { Star, Loader, Award } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import SessionApi from '@/service/Api/SessionApi'
import { motion, AnimatePresence } from 'framer-motion'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  onRatingSubmitted?: () => void
  initialRating?: number
  initialFeedback?: string
  isEdit?: boolean
}

export function RatingModal({ 
  isOpen, 
  onClose, 
  sessionId, 
  onRatingSubmitted,
  initialRating = 0,
  initialFeedback = '',
  isEdit = false
}: RatingModalProps) {
  const [rating, setRating] = useState(initialRating)
  const [feedback, setFeedback] = useState(initialFeedback)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setRating(initialRating)
    setFeedback(initialFeedback)
  }, [initialRating, initialFeedback])

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating before submitting')
      return
    }

    try {
      setIsSubmitting(true)
      
      if (isEdit) {
        await SessionApi.updateRating(sessionId, {
          rating,
          feedback
        })
        toast.success("Rating updated successfully!")
      } else {
        await SessionApi.rateSession(sessionId, {
          rating,
          feedback
        })
        toast.success("Rating submitted. Thank you for your feedback!")
      }

      if (onRatingSubmitted) {
        onRatingSubmitted()
      }
      
      onClose()
      
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      toast.error(`Failed to ${isEdit ? 'update' : 'submit'} rating. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    toast('Rating skipped, You can rate this session later from your history', {
        icon: '⏩',
    });
    onClose()
  }
  
  const getRatingText = () => {
    switch(rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Select a rating";
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="p-0 max-w-md overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-black/80 to-zinc-900/90 backdrop-blur-xl rounded-3xl border border-white/10">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-purple-500/10 to-transparent rounded-t-3xl" />          
            
            <div className="p-5 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {isEdit ? 'Update Your Rating' : 'Rate Your Experience'}
                </h2>
              </div>
              <p className="text-zinc-400 text-sm">
                Your feedback helps developers improve their services
              </p>
            </div>
          </div>
          
          <div className="px-5 pb-3">
            <AnimatePresence>
              <motion.div 
                className="flex flex-col items-center space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-zinc-800/20 backdrop-blur-sm rounded-xl border border-zinc-700/20 p-4 w-full">
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="focus:outline-none"
                      >
                        <Star
                          size={32}
                          className={`${
                            star <= (hoveredRating || rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-zinc-700'
                          } drop-shadow-md transition-colors duration-200`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.p 
                    key={rating}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-zinc-300 font-medium mt-2 text-sm"
                  >
                    {getRatingText()}
                  </motion.p>
                </div>
                
                <div className="w-full">
                  <Textarea
                    placeholder="Share your thoughts (optional)"
                    className="dark:bg-zinc-800/50 dark:border-zinc-700/50 focus:border-purple-500/50 text-white resize-none 
                      rounded-xl shadow-inner placeholder:text-zinc-500 text-sm"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="border-t border-zinc-800/50 p-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isSubmitting}
              size="sm"
              className="border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 hover:text-white rounded-xl shadow-sm"
            >
              Skip
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                text-white rounded-xl shadow-md transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-3 h-3 mr-1.5 animate-spin" />
                  {isEdit ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                isEdit ? 'Update Rating' : 'Submit Rating'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
