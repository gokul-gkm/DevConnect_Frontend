'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, User, Calendar, MessageSquare, Info, Clock } from 'lucide-react'
import { Button } from '@/components/ui/shadcn-button'
import { Spinner } from '@/components/ui/spinner'
import { format } from 'date-fns'
import { useDebounce } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
import { useReviews } from '@/hooks/reviews/useReviews'

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    profilePicture: string;
  };
  session: {
    id: string;
    title: string;
    date: string;
    startTime: string;
  };
}

export function DeveloperReviews() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'highest' | 'lowest'>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  
  const debouncedSearch = useDebounce(searchTerm, 500)
  const navigate = useNavigate()

  const { 
    data, 
    isLoading,
    isFetching
  } = useReviews({ 
    page: currentPage, 
    limit: 10, 
    search: debouncedSearch,
    sortOrder 
  })

  const reviews = data?.reviews || []
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1 }
  const stats = data?.stats || { averageRating: 0, totalReviews: 0 }

  const handleViewSession = (sessionId: string) => {
    navigate(`/developer/sessions/history/${sessionId}`)
  }

  const updateParams = ({ page }: { page: number }) => {
    setCurrentPage(page)
  }

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 pt-20 lg:p-8 lg:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Your Reviews</h1>
        <p className="text-zinc-400">View feedback from your mentoring sessions</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 p-6 shadow-lg">
          <div className="mb-2 text-zinc-400 text-sm">Average Rating</div>
          <div className="flex items-center">
            <span className="text-3xl font-semibold text-white mr-2">{stats.averageRating}</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.round(stats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 p-6 shadow-lg">
          <div className="mb-2 text-zinc-400 text-sm">Total Reviews</div>
          <div className="text-3xl font-semibold text-white">{stats.totalReviews}</div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 p-6 shadow-lg">
          <div className="mb-2 text-zinc-400 text-sm">Response Rate</div>
          <div className="text-3xl font-semibold text-white">
            {stats.totalReviews > 0 ? '100%' : '0%'}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-900/70 border-zinc-800 focus:border-purple-500/50 rounded-xl"
          />
        </div>
        
        <div className="flex-shrink-0">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </motion.div>

      {isFetching && !isLoading && (
        <div className="text-center py-4">
          <Spinner size="sm" />
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review: Review, index: number) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="bg-gradient-to-br from-zinc-900/70 to-black/60 rounded-2xl backdrop-blur-md border border-zinc-800/50 p-6 hover:border-zinc-700/50 transition-all shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={review.user.profilePicture}
                      alt={review.user.username}
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-700/50"
                    />
                    <div className="absolute -bottom-3 -right-3 bg-zinc-800 rounded-xl p-1.5 border border-zinc-700/50">
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white font-medium">{review.user.username}</h3>
                      <p className="text-zinc-400 text-sm">
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 rounded-xl text-xs"
                      onClick={() => handleViewSession(review.session.id)}
                    >
                      <Info className="w-3.5 h-3.5 mr-1.5" />
                      View Session
                    </Button>
                  </div>

                  <div className="mb-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-300">{review.session.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-400">
                        {format(new Date(review.session.date), 'MMM dd')} at {format(new Date(review.session.startTime), 'hh:mm a')}
                      </span>
                    </div>
                  </div>

                  {review.comment && (
                    <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-700/20">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-zinc-400 mt-0.5" />
                        <h4 className="text-zinc-300 text-sm font-medium">Feedback</h4>
                      </div>
                      <p className="text-zinc-300">{review.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 p-8 text-center">
          <User className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-zinc-300 mb-2">No reviews yet</h3>
          <p className="text-zinc-400 max-w-md mx-auto">
            You haven't received any reviews for your sessions yet. As you complete more sessions, reviews will appear here.
          </p>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination pagination={pagination} updateParams={updateParams} />
      )}
    </div>
  )
}
