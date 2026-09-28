import { useEffect, useState } from 'react'
import { authApi } from '../api/auth.api'
import { AuthContext } from './auth.context'

const getUserFromResponse = (response) => response.data?.user || response.data

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    authApi.me()
      .then((response) => {
        if (active) setUser(getUserFromResponse(response))
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    const handleExpiredSession = () => setUser(null)
    window.addEventListener('auth:expired', handleExpiredSession)

    return () => {
      active = false
      window.removeEventListener('auth:expired', handleExpiredSession)
    }
  }, [])

  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    const nextUser = getUserFromResponse(response)
    setUser(nextUser)
    return nextUser
  }

  const register = async (payload) => {
    const response = await authApi.register(payload)
    return getUserFromResponse(response)
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: Boolean(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
