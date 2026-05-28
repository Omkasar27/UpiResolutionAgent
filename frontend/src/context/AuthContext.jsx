import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token")
      const savedUser  = localStorage.getItem("user")

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      console.error("Failed to load auth from storage:", err)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (token, userData) => {
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
  }

  const logout = () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } catch (err) {
      console.error("Failed to clear auth:", err)
    } finally {
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}