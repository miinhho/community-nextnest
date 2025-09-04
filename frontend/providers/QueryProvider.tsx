'use client'

import { getQueryClient } from '@/lib/query'
import { QueryClientProvider } from '@tanstack/react-query'

export default function QueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
