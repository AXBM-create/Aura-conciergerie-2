import { useEffect, useState } from 'react'
import { blink } from '@/blink/client'

export function useAuth() {
  const [user, setUser] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.isLoading) setIsLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, isLoading }
}
