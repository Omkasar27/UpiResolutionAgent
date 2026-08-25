import { createContext, useCallback, useContext, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth] = useState(() => {
    try {
      const savedToken = localStorage.getItem("token")
      const savedUser  = localStorage.getItem("user")

      if (savedToken && savedUser) {
        return { token: savedToken, user: JSON.parse(savedUser) }
      }
    } catch (err) {
      console.error("Failed to load auth from storage:", err)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    return { token: null, user: null }
  })
  const [user, setUser] = useState(auth.user)
  const [token, setToken] = useState(auth.token)

  const login = useCallback((token, userData) => {
    try {
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setToken(token)
      setUser(userData)
      return true
    } catch (err) {
      console.error("Failed to save auth:", err)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } catch (err) {
      console.error("Failed to clear auth:", err)
    } finally {
      setToken(null)
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

// The hook intentionally lives beside its context provider for a stable public API.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}