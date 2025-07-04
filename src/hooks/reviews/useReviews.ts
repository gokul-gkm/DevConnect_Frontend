import { useQuery } from '@tanstack/react-query'
import DeveloperApi from '@/service/Api/DeveloperApi'

interface UseReviewsParams {
  page: number
  limit?: number
  search?: string
  sortOrder?: 'newest' | 'highest' | 'lowest'
}

export function useReviews({ page, limit = 10, search = '', sortOrder = 'newest' }: UseReviewsParams) {
  return useQuery({
    queryKey: ['developerReviews', page, limit, search, sortOrder],
    queryFn: () => DeveloperApi.getMyReviews(page, limit, search, sortOrder),
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  })
}
